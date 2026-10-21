// Tipos
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";

// Borra un snippet; RLS impide borrar los de otro usuario
export async function borrarSnippet(
	id: string,
	repo: SnippetRepository,
): Promise<void> {
	await repo.borrar(id);
}
