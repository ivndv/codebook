"use server";

// Next
import { revalidatePath } from "next/cache";
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
import type {
	ResultadoAnalisisAccion,
	ResultadoGuardadoAccion,
} from "@/core/application/dto";
import { guardarSnippet as guardarSnippetCaso } from "@/core/application/guardar-snippet";

// Analiza el fragmento sin tocar la base. El invitado también puede usarlo
export async function analizar(
	code: unknown,
): Promise<ResultadoAnalisisAccion> {
	const entrada = codigoEntradaSchema.safeParse(code);

	if (!entrada.success) {
		return { ok: false, error: "El código no es válido." };
	}

	// 1. Resuelve la identidad y corta el abuso antes de gastar IA
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario().catch(() => null);
	const limite = await limitarAnalisis(usuario?.id ?? null);

	if (!limite.permitido) {
		return {
			ok: false,
			error: limite.mensaje ?? "No se pudo comprobar el límite de análisis.",
		};
	}

	// 2. Pide la explicación a codebook-api
	const resultado = await analizarCaso(entrada.data, {
		resumen: deps.resumen,
	});

	if (!resultado.ok) {
		return { ok: false, error: resultado.error.mensaje };
	}

	return { ok: true, ...resultado.valor };
}

// Guarda un snippet ya analizado. Solo funciona con sesión
export async function guardarSnippet(
	datos: unknown,
): Promise<ResultadoGuardadoAccion> {
	const entrada = datosGuardadoSchema.safeParse(datos);

	if (!entrada.success) {
		return { ok: false, error: "Los datos del snippet no son válidos." };
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
	id: unknown,
): Promise<{ error: string | null }> {
	const entrada = idSnippetSchema.safeParse(id);

	if (!entrada.success) {
		return { error: "El snippet no es válido." };
	}

	const deps = await crearContenedor();

	try {
		await borrarSnippetCaso(entrada.data, deps.snippets);
	} catch (error) {
		console.error("[borrarSnippet]", error);
		return { error: "No se pudo borrar el snippet." };
	}

	revalidatePath("/generador");
	return { error: null };
}
