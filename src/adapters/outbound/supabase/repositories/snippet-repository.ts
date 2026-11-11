// Node
import { randomUUID } from "node:crypto";
// Supabase
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
	FechaFiltro,
	FiltrosSnippets,
} from "@/core/snippets/domain/filtros-snippets";
import { SNIPPETS_POR_PAGINA } from "@/core/snippets/domain/paginacion";
import type { SnippetRepository } from "@/core/snippets/domain/ports/snippet-repository";
import type { NuevoSnippet, Snippet } from "@/core/snippets/domain/snippet";
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

// Quita caracteres que rompen el filtro de PostgREST o actúan como comodines
function sanitizarBusqueda(valor: string): string {
	return valor
		.replace(/[%_,()*\\"]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

// Fecha de corte para el filtro (24 h, 7 días o 30 días)
function desdeFecha(fecha: FechaFiltro): string | null {
	if (fecha === "todo") return null;

	const dias = fecha === "hoy" ? 1 : fecha === "7d" ? 7 : 30;
	return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
}

// Adaptador Supabase del puerto SnippetRepository
export class SupabaseSnippetRepository implements SnippetRepository {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async listar(
		pagina: number,
		filtros: FiltrosSnippets,
	): Promise<{ snippets: Snippet[]; total: number }> {
		// 1. Calcula el rango de la página pedida
		const desde = (pagina - 1) * SNIPPETS_POR_PAGINA;
		const hasta = desde + SNIPPETS_POR_PAGINA - 1;

		// 2. Constructor de la consulta con filtros (RLS filtra por auth.uid())
		const consulta = () => {
			let q = this.supabase.from("snippets").select("*", { count: "exact" });
			const busqueda = sanitizarBusqueda(filtros.busqueda);

			if (busqueda) {
				const patron = `%${busqueda}%`;

				if (filtros.alcance === "codigo") {
					q = q.ilike("code", patron);
				} else if (filtros.alcance === "explicacion") {
					q = q.ilike("explanation", patron);
				} else {
					q = q.or(`explanation.ilike.${patron},code.ilike.${patron}`);
				}
			}

			if (filtros.lenguaje) {
				q = q.eq("language", filtros.lenguaje);
			}

			const corte = desdeFecha(filtros.fecha);

			if (corte) {
				q = q.gte("created_at", corte);
			}

			return q.order("created_at", {
				ascending: filtros.orden === "antiguos",
			});
		};

		// 3. Pide la página; si ya no existe, pide la primera para que la UI redirija
		const { data, count, error } = await consulta().range(desde, hasta);
		const fueraDeRango =
			error?.code === "PGRST103" ||
			/range not satisfiable/i.test(error?.message ?? "");

		if (fueraDeRango) {
			const {
				data: primera,
				count: total,
				error: errorPrimera,
			} = await consulta().range(0, SNIPPETS_POR_PAGINA - 1);

			if (errorPrimera) throw new Error(errorPrimera.message);

			return { snippets: (primera ?? []).map(mapear), total: total ?? 0 };
		}

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

	async lenguajes(): Promise<string[]> {
		const { data, error } = await this.supabase
			.from("snippets")
			.select("language")
			.not("language", "is", null)
			.order("language", { ascending: true })
			.limit(1_000);

		if (error) throw new Error(error.message);

		const unicos = new Set<string>();

		for (const fila of data ?? []) {
			if (fila.language) unicos.add(fila.language);
		}

		return [...unicos];
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

	async crearEnlacePublico(id: string): Promise<string> {
		// 1. Reutiliza el token si ya existe
		const { data, error } = await this.supabase
			.from("snippets")
			.select("share_token")
			.eq("id", id)
			.single();

		if (error || !data) {
			throw new Error(error?.message ?? "No se encontró el snippet.");
		}

		if (data.share_token) return data.share_token;

		// 2. Genera uno nuevo y lo guarda
		const token = randomUUID();
		const { data: actualizado, error: errorUpdate } = await this.supabase
			.from("snippets")
			.update({ share_token: token })
			.eq("id", id)
			.select("share_token")
			.single();

		if (errorUpdate || !actualizado?.share_token) {
			throw new Error(errorUpdate?.message ?? "No se pudo crear el enlace.");
		}

		return actualizado.share_token;
	}

	async obtenerPublico(token: string): Promise<Snippet | null> {
		const { data, error } = await this.supabase.rpc("obtener_snippet_publico", {
			p_token: token,
		});

		if (error) throw new Error(error.message);

		const fila = data?.[0];

		if (!fila) return null;

		return {
			id: fila.id,
			code: fila.code,
			explanation: fila.explanation,
			language: fila.language,
			createdAt: fila.created_at,
		};
	}
}
