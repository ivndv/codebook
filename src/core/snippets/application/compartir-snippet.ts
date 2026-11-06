// Tipos
import type { ErrorDominio } from "@/core/shared/errors";
import { err, ok, type Result } from "@/core/shared/result";
import type { SnippetRepository } from "@/core/snippets/domain/ports/snippet-repository";

// Crea (o reutiliza) el enlace público de un snippet
export async function compartirSnippet(
	id: string,
	repo: SnippetRepository,
): Promise<Result<string, ErrorDominio>> {
	try {
		const token = await repo.crearEnlacePublico(id);
		return ok(token);
	} catch (error) {
		console.error("[compartirSnippet]", error);
		return err({
			tipo: "persistencia",
			mensaje: "No se pudo crear el enlace público.",
		});
	}
}
