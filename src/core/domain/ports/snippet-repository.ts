// Tipos
import type {
	FiltrosSnippets,
	NuevoSnippet,
	Snippet,
} from "@/core/domain/snippet";

// Puerto de persistencia: el dominio define qué necesita, no cómo se guarda
export interface SnippetRepository {
	listar(
		pagina: number,
		filtros: FiltrosSnippets,
	): Promise<{ snippets: Snippet[]; total: number }>;
	crear(input: NuevoSnippet): Promise<Snippet>;
	lenguajes(): Promise<string[]>;
	borrar(id: string): Promise<void>;
	crearEnlacePublico(id: string): Promise<string>;
	obtenerPublico(token: string): Promise<Snippet | null>;
}
