// Tipos
import type { FiltrosSnippets } from "@/core/domain/snippet";

// Construye la URL del generador conservando los filtros activos
export function urlGenerador(
	filtros: FiltrosSnippets,
	pagina?: number,
): string {
	const params = new URLSearchParams();

	if (filtros.busqueda) params.set("q", filtros.busqueda);
	if (filtros.lenguaje) params.set("lenguaje", filtros.lenguaje);
	if (filtros.orden !== "recientes") params.set("orden", filtros.orden);
	if (filtros.alcance !== "todo") params.set("en", filtros.alcance);
	if (filtros.fecha !== "todo") params.set("fecha", filtros.fecha);
	if (pagina && pagina > 1) params.set("pagina", String(pagina));

	const query = params.toString();
	return query ? `/generador?${query}` : "/generador";
}
