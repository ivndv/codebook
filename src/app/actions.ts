"use server";

// Next
import { revalidatePath } from "next/cache";
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
// Infraestructura
import { limitarAnalisis } from "@/adapters/inbound/next/rate-limit";
import {
	codigoEntradaSchema,
	datosGuardadoSchema,
	idSnippetSchema,
} from "@/adapters/inbound/next/schemas";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { analizar as analizarCaso } from "@/core/application/analizar";
import { borrarSnippet as borrarSnippetCaso } from "@/core/application/borrar-snippet";
import { compartirSnippet as compartirSnippetCaso } from "@/core/application/compartir-snippet";
import type {
	ResultadoAnalisisAccion,
	ResultadoGuardadoAccion,
} from "@/core/application/dto";
import { guardarSnippet as guardarSnippetCaso } from "@/core/application/guardar-snippet";
// Locales
import * as m from "@/paraglide/messages";
import { isLocale, type Locale } from "@/paraglide/runtime";

// Normaliza el idioma que llega del formulario
function idioma(locale: unknown): Locale {
	return typeof locale === "string" && isLocale(locale) ? locale : "es";
}

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

// Guarda un snippet ya analizado. Solo funciona con sesión
export async function guardarSnippet(
	locale: unknown,
	datos: unknown,
): Promise<ResultadoGuardadoAccion> {
	const l = idioma(locale);
	const entrada = datosGuardadoSchema.safeParse(datos);

	if (!entrada.success) {
		return { ok: false, error: m.err_invalid_snippet({}, { locale: l }) };
	}

	const deps = await crearContenedor();
	const resultado = await guardarSnippetCaso(entrada.data, deps);

	if (!resultado.ok) {
		return { ok: false, error: resultado.error.mensaje };
	}

	// Refresca la lista para que aparezca el snippet recién guardado
	revalidatePath("/generador");

	return { ok: true };
}

// Borra un snippet del usuario. RLS impide borrar los de otro
export async function borrarSnippet(
	locale: unknown,
	id: unknown,
): Promise<{ error: string | null }> {
	const l = idioma(locale);
	const entrada = idSnippetSchema.safeParse(id);

	if (!entrada.success) {
		return { error: m.err_invalid_snippet({}, { locale: l }) };
	}

	const deps = await crearContenedor();

	try {
		await borrarSnippetCaso(entrada.data, deps.snippets);
	} catch (error) {
		console.error("[borrarSnippet]", error);
		return { error: m.err_delete({}, { locale: l }) };
	}

	revalidatePath("/", "layout");
	return { error: null };
}

// Crea (o reutiliza) el enlace público de un snippet
export async function compartirSnippet(
	locale: unknown,
	id: unknown,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
	const l = idioma(locale);
	const entrada = idSnippetSchema.safeParse(id);

	if (!entrada.success) {
		return { ok: false, error: m.err_invalid_snippet({}, { locale: l }) };
	}

	const deps = await crearContenedor();
	const resultado = await compartirSnippetCaso(entrada.data, deps.snippets);

	if (!resultado.ok) {
		return { ok: false, error: resultado.error.mensaje };
	}

	const origen = await obtenerOrigen();
	return { ok: true, url: `${origen}/${l}/s/${resultado.valor}` };
}
