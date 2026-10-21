// Supabase
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import {
	type NuevoSnippet,
	SNIPPETS_POR_PAGINA,
	type Snippet,
} from "@/core/domain/snippet";
// Tipos
import type { Database, Tables } from "@/lib/database.types";

type FilaSnippet = Tables<"snippets">;

// Convierte una fila de Postgres al tipo del dominio
function mapear(fila: FilaSnippet): Snippet {
	return {
		id: fila.id,
		code: fila.code,
		explanation: fila.explanation,
		language: fila.language,
		createdAt: fila.created_at,
	};
}

// Adaptador Supabase del puerto SnippetRepository
export class SupabaseSnippetRepository implements SnippetRepository {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async listar(
		pagina: number,
	): Promise<{ snippets: Snippet[]; total: number }> {
		// 1. Calcula el rango de la página pedida
		const desde = (pagina - 1) * SNIPPETS_POR_PAGINA;
		const hasta = desde + SNIPPETS_POR_PAGINA - 1;

		// 2. Consulta la página con el total exacto (RLS filtra por auth.uid())
		const { data, count, error } = await this.supabase
			.from("snippets")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(desde, hasta);

		if (error) throw new Error(error.message);

		return {
			snippets: (data ?? []).map(mapear),
			total: count ?? 0,
		};
	}

	async crear(input: NuevoSnippet): Promise<Snippet> {
		const { data, error } = await this.supabase
			.from("snippets")
			.insert({
				code: input.code,
				explanation: input.explanation,
				language: input.language,
			})
			.select("*")
			.single();

		if (error || !data) {
			throw new Error(error?.message ?? "No se pudo crear el snippet.");
		}

		return mapear(data);
	}

	async borrar(id: string): Promise<void> {
		// Devuelve la fila borrada para detectar un id inexistente o ajeno
		const { data, error } = await this.supabase
			.from("snippets")
			.delete()
			.eq("id", id)
			.select("id");

		if (error) throw new Error(error.message);
		if (!data || data.length === 0) {
			throw new Error("El snippet no existe o no te pertenece.");
		}
	}
}
