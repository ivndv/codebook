// Tipos
import type { Snippet } from "./snippet";

// Página de snippets lista para la UI
export interface PaginaSnippets {
	snippets: Snippet[];
	pagina: number;
	total: number;
	totalPaginas: number;
}

// Tamaño de página de la lista
export const SNIPPETS_POR_PAGINA = 5;
