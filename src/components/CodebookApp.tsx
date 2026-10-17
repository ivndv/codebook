"use client";

// Acciones
import { borrarSnippet } from "@/app/actions";
// Componentes
import { LockedSnippets } from "@/components/LockedSnippets";
import { Paginacion } from "@/components/Paginacion";
import { SnippetForm } from "@/components/SnippetForm";
import { SnippetList } from "@/components/SnippetList";
// Tipos
import type { Snippet } from "@/lib/snippets";
import type { Usuario } from "@/lib/usuario";

// Panel de la app: formulario + lista paginada.
// Los snippets vienen de Postgres (Server Component); al guardar o borrar,
// revalidatePath refresca la lista
export function CodebookApp({
	usuario,
	snippets,
	total,
	pagina,
	totalPaginas,
}: {
	usuario: Usuario | null;
	snippets: Snippet[];
	total: number;
	pagina: number;
	totalPaginas: number;
}) {
	// Estado
	const logueado = usuario !== null;

	// Handlers
	async function eliminar(id: string) {
		await borrarSnippet(id);
	}

	return (
		<div className="space-y-12">
			<SnippetForm />

			<section className="space-y-4 border-t border-border pt-10">
				<h2 className="text-sm font-semibold tracking-tight">
					Tus snippets{" "}
					{logueado && total > 0 && (
						<span className="text-muted">({total})</span>
					)}
				</h2>

				{logueado ? (
					<>
						<SnippetList snippets={snippets} onDelete={eliminar} />
						<Paginacion pagina={pagina} totalPaginas={totalPaginas} />
					</>
				) : (
					<LockedSnippets />
				)}
			</section>
		</div>
	);
}
