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
