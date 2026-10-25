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

// Alcance de la búsqueda
export type AlcanceBusqueda = "todo" | "codigo" | "explicacion";

// Orden de la lista
export type OrdenSnippets = "recientes" | "antiguos";

// Rango de fechas
export type FechaFiltro = "todo" | "hoy" | "7d" | "30d";

// Filtros de la lista
export interface FiltrosSnippets {
	busqueda: string;
	lenguaje: string | null;
	orden: OrdenSnippets;
	alcance: AlcanceBusqueda;
	fecha: FechaFiltro;
}

// Filtros por defecto
export const FILTROS_INICIALES: FiltrosSnippets = {
	busqueda: "",
	lenguaje: null,
	orden: "recientes",
	alcance: "todo",
	fecha: "todo",
};

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
