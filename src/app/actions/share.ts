"use server";

// Infraestructura
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
import { idSnippetSchema } from "@/adapters/inbound/next/schemas/schemas";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { compartirSnippet as compartirSnippetCaso } from "@/core/snippets/application/compartir-snippet";
// Locales
import * as m from "@/paraglide/messages";
// Acciones
import { idioma } from "./idioma";

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
