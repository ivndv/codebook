// Tipos
import type { NuevoSnippet, Snippet } from "@/core/domain/snippet";

// Puerto de persistencia: el dominio define qué necesita, no cómo se guarda
export interface SnippetRepository {
	listar(pagina: number): Promise<{ snippets: Snippet[]; total: number }>;
	crear(input: NuevoSnippet): Promise<Snippet>;
	borrar(id: string): Promise<void>;
}
