"use server";

// Next
import { revalidatePath } from "next/cache";
// Infraestructura
import { datosGuardadoSchema } from "@/adapters/inbound/next/schemas/schemas";
import { crearContenedor } from "@/composition/container";
// Aplicación
import type { ResultadoGuardadoAccion } from "@/core/snippets/application/dto";
import { guardarSnippet as guardarSnippetCaso } from "@/core/snippets/application/guardar-snippet";
// Locales
import * as m from "@/paraglide/messages";
// Acciones
import { idioma } from "./idioma";

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
	revalidatePath("/", "layout");

	return { ok: true };
}
