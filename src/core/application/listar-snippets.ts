// Tipos
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import {
	type FiltrosSnippets,
	type PaginaSnippets,
	SNIPPETS_POR_PAGINA,
} from "@/core/domain/snippet";
import {
	normalizarAlcance,
	normalizarFecha,
	normalizarLenguaje,
	normalizarOrden,
	validarBusqueda,
} from "@/core/domain/snippet-campos";

// Trae una página de snippets y calcula los metadatos de paginación
export async function listarSnippets(
	pagina: number,
	filtros: FiltrosSnippets,
	repo: SnippetRepository,
): Promise<PaginaSnippets> {
	const paginaValida =
		Number.isFinite(pagina) && pagina > 0 ? Math.floor(pagina) : 1;

	const filtrosLimpios: FiltrosSnippets = {
		busqueda: validarBusqueda(filtros.busqueda),
		lenguaje: normalizarLenguaje(filtros.lenguaje),
		orden: normalizarOrden(filtros.orden),
		alcance: normalizarAlcance(filtros.alcance),
		fecha: normalizarFecha(filtros.fecha),
	};

	const { snippets, total } = await repo.listar(paginaValida, filtrosLimpios);

	return {
		snippets,
		pagina: paginaValida,
		total,
		totalPaginas: Math.max(1, Math.ceil(total / SNIPPETS_POR_PAGINA)),
	};
}
