// Datos
import { SNIPPETS_POR_PAGINA, type Snippet } from "@/lib/snippets";
// Supabase
import { createClient } from "@/lib/supabase/server";

export interface PaginaSnippets {
	snippets: Snippet[];
	// Página actual (1-based)
	pagina: number;
	total: number;
	totalPaginas: number;
}

// Una página de snippets del usuario, lo más nuevo primero.
// Usa range (offset) + count porque la UI numera las páginas; RLS filtra por auth.uid()
export async function listarSnippets(pagina = 1): Promise<PaginaSnippets> {
	const supabase = await createClient();

	// 1. Calcula el rango de la página pedida
	const desde = (pagina - 1) * SNIPPETS_POR_PAGINA;
	const hasta = desde + SNIPPETS_POR_PAGINA - 1;

	// 2. Consulta la página con el total exacto (lo necesita la paginación)
	const { data, count, error } = await supabase
		.from("snippets")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(desde, hasta);

	if (error) throw new Error(error.message);

	// 3. Calcula cuántas páginas hay en total
	const total = count ?? 0;

	return {
		snippets: data ?? [],
		pagina,
		total,
		totalPaginas: Math.max(1, Math.ceil(total / SNIPPETS_POR_PAGINA)),
	};
}
