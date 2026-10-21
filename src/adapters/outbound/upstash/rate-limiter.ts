// Upstash
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Límites de análisis por ventana
const MAXIMO_MINUTO = 10;
const MAXIMO_DIA = 100;
const MAXIMO_GLOBAL_DIA = 800;
const TIMEOUT_MS = 1_500;

// Resultado que consume el adaptador de entrada
export interface ResultadoLimite {
	permitido: boolean;
	mensaje?: string;
}

interface Limitadores {
	minuto: Ratelimit;
	dia: Ratelimit;
	global: Ratelimit;
}

let limitadores: Limitadores | null = null;

// Comprueba si las variables de Upstash están presentes
function tieneConfiguracion(): boolean {
	return Boolean(
		process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
	);
}

// Crea los limitadores una sola vez por proceso
function obtenerLimitadores(): Limitadores | null {
	if (!tieneConfiguracion()) return null;
	if (limitadores) return limitadores;

	const redis = new Redis({
		url: process.env.UPSTASH_REDIS_REST_URL as string,
		token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
	});

	limitadores = {
		minuto: new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(MAXIMO_MINUTO, "1 m"),
			prefix: "codebook:analisis:minuto",
			timeout: TIMEOUT_MS,
		}),
		dia: new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(MAXIMO_DIA, "1 d"),
			prefix: "codebook:analisis:dia",
			timeout: TIMEOUT_MS,
		}),
		global: new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(MAXIMO_GLOBAL_DIA, "1 d"),
			prefix: "codebook:analisis:global",
			timeout: TIMEOUT_MS,
		}),
	};

	return limitadores;
}

// Devuelve null si Redis no está configurado; el llamador decide el fallback
export async function limitarConRedis(
	identidad: string,
): Promise<ResultadoLimite | null> {
	const limites = obtenerLimitadores();

	if (!limites) return null;

	// 1. Ráfaga por minuto
	const minuto = await limites.minuto.limit(identidad);

	// Si Upstash no responde, el adaptador de entrada usa el fallback local
	if (minuto.reason === "timeout") {
		throw new Error("Upstash tardó demasiado en responder.");
	}

	if (!minuto.success) {
		return {
			permitido: false,
			mensaje:
				"Demasiados análisis seguidos. Espera un minuto e inténtalo de nuevo.",
		};
	}

	// 2. Cuota diaria por usuario o IP
	const dia = await limites.dia.limit(identidad);

	if (dia.reason === "timeout") {
		throw new Error("Upstash tardó demasiado en responder.");
	}

	if (!dia.success) {
		return {
			permitido: false,
			mensaje: "Llegaste al límite diario de análisis.",
		};
	}

	// 3. Cuota global del servicio
	const global = await limites.global.limit("global");

	if (global.reason === "timeout") {
		throw new Error("Upstash tardó demasiado en responder.");
	}

	if (!global.success) {
		return {
			permitido: false,
			mensaje:
				"El servicio alcanzó su límite diario. Inténtalo de nuevo mañana.",
		};
	}

	return { permitido: true };
}
