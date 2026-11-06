"use server";

// Next
import { revalidatePath } from "next/cache";
// Infraestructura
import { idSnippetSchema } from "@/adapters/inbound/next/schemas";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { borrarSnippet as borrarSnippetCaso } from "@/core/application/borrar-snippet";
// Locales
import * as m from "@/paraglide/messages";
// Acciones
import { idioma } from "./idioma";

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
