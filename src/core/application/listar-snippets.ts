// Tipos

import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import {
	type PaginaSnippets,
	SNIPPETS_POR_PAGINA,
} from "@/core/domain/snippet";

// Trae una página de snippets y calcula los metadatos de paginación
export async function listarSnippets(
	pagina: number,
	repo: SnippetRepository,
): Promise<PaginaSnippets> {
	const paginaValida =
		Number.isFinite(pagina) && pagina > 0 ? Math.floor(pagina) : 1;

	const { snippets, total } = await repo.listar(paginaValida);

	return {
		snippets,
		pagina: paginaValida,
		total,
		totalPaginas: Math.max(1, Math.ceil(total / SNIPPETS_POR_PAGINA)),
	};
}
