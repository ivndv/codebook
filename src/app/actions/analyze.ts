"use server";

// Infraestructura
import { limitarAnalisis } from "@/adapters/inbound/next/rate-limit";
import { codigoEntradaSchema } from "@/adapters/inbound/next/schemas";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { analizar as analizarCaso } from "@/core/application/analizar";
import type { ResultadoAnalisisAccion } from "@/core/application/dto";
// Locales
import * as m from "@/paraglide/messages";
// Acciones
import { idioma } from "./idioma";

// Analiza el fragmento sin tocar la base. El invitado también puede usarlo
export async function analizar(
	locale: unknown,
	code: unknown,
): Promise<ResultadoAnalisisAccion> {
	const l = idioma(locale);
	const entrada = codigoEntradaSchema.safeParse(code);

	if (!entrada.success) {
		return { ok: false, error: m.err_invalid_code({}, { locale: l }) };
	}

	// 1. Resuelve la identidad y corta el abuso antes de gastar IA
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario().catch(() => null);
	const limite = await limitarAnalisis(usuario?.id ?? null);

	if (!limite.permitido) {
		return {
			ok: false,
			error: limite.mensaje ?? m.err_rate_limit({}, { locale: l }),
		};
	}

	// 2. Pide la explicación a codebook-api
	const resultado = await analizarCaso(
		entrada.data,
		{ resumen: deps.resumen },
		l,
	);

	if (!resultado.ok) {
		return { ok: false, error: resultado.error.mensaje };
	}

	return { ok: true, ...resultado.valor };
}
