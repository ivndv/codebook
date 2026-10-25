// Tipos
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import type { Snippet } from "@/core/domain/snippet";

// Lee un snippet público por su token; devuelve null si no existe
export async function obtenerSnippetPublico(
	token: string,
	repo: SnippetRepository,
): Promise<Snippet | null> {
	if (!token) return null;

	return repo.obtenerPublico(token);
}
