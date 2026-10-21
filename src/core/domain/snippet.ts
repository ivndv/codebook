// Un snippet es independiente del esquema de la base de datos
export interface Snippet {
	id: string;
	code: string;
	explanation: string;
	language: string | null;
	createdAt: string;
}

// Datos necesarios para crear un snippet
export interface NuevoSnippet {
	code: string;
	explanation: string;
	language: string | null;
}

// Resumen que devuelve el servicio de IA
export interface Summary {
	explanation: string;
	language: string | null;
}

// Página de snippets lista para la UI
export interface PaginaSnippets {
	snippets: Snippet[];
	pagina: number;
	total: number;
	totalPaginas: number;
}

// Límite compartido con codebook-api
export const MAX_CODE_LENGTH = 10_000;

// Tamaño de página de la lista
export const SNIPPETS_POR_PAGINA = 5;
