// Next
import { headers } from "next/headers";
// Infraestructura
import {
	limitarConRedis,
	type ResultadoLimite,
} from "@/adapters/outbound/upstash/rate-limiter";

// Fallback en memoria por si Redis no está configurado o falla
const VENTANA_MS = 60_000;
const MAXIMO_ANALISIS = 10;

const registros = new Map<string, number[]>();
let avisoFallback = false;

// Lee la IP real que añade el proxy de Vercel
async function obtenerIp(): Promise<string> {
	const h = await headers();
	const reenviado = h.get("x-forwarded-for") ?? "";
	const primera = reenviado.split(",")[0]?.trim();

	return primera || h.get("x-real-ip") || "desconocida";
}

// Límite local de una sola ventana; solo se usa como respaldo
function limitarEnMemoria(identidad: string): ResultadoLimite {
	const ahora = Date.now();
	const previos = (registros.get(identidad) ?? []).filter(
		(marca) => ahora - marca < VENTANA_MS,
	);

	if (previos.length >= MAXIMO_ANALISIS) {
		registros.set(identidad, previos);
		return {
			permitido: false,
			mensaje:
				"Demasiados análisis seguidos. Espera un minuto e inténtalo de nuevo.",
		};
	}

	previos.push(ahora);
	registros.set(identidad, previos);

	// Limpia identidades viejas para que el mapa no crezca sin control
	if (registros.size > 1_000) {
		for (const [clave, marcas] of registros) {
			if (marcas.every((marca) => ahora - marca >= VENTANA_MS)) {
				registros.delete(clave);
			}
		}
	}

	return { permitido: true };
}

// Limita por usuario si hay sesión; si no, por IP
export async function limitarAnalisis(
	usuarioId: string | null,
): Promise<ResultadoLimite> {
	const ip = await obtenerIp();
	const identidad = usuarioId ? `user:${usuarioId}` : `ip:${ip}`;

	try {
		const resultado = await limitarConRedis(identidad);
		if (resultado) return resultado;

		if (process.env.NODE_ENV === "production" && !avisoFallback) {
			console.warn("[rate-limit] Upstash no configurado; usando memoria");
			avisoFallback = true;
		}
	} catch (error) {
		if (!avisoFallback) {
			console.warn("[rate-limit] Redis no disponible; usando memoria", error);
			avisoFallback = true;
		}
	}

	return limitarEnMemoria(identidad);
}
