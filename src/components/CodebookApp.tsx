"use client";

// React
import { useState } from "react";
// Acciones
import { borrarSnippet } from "@/app/actions";
// Componentes
import { DialogoCompartir } from "@/components/DialogoCompartir";
import { LockedSnippets } from "@/components/LockedSnippets";
import { Paginacion } from "@/components/Paginacion";
import { SnippetForm } from "@/components/SnippetForm";
import { SnippetList } from "@/components/SnippetList";
// Tipos
import type { Snippet } from "@/core/domain/snippet";
import type { Usuario } from "@/core/domain/usuario";

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
	const [eliminandoId, setEliminandoId] = useState<string | null>(null);
	const [errorBorrado, setErrorBorrado] = useState<string | null>(null);
	const [compartiendo, setCompartiendo] = useState<Snippet | null>(null);

	// Handlers
	async function eliminar(id: string) {
		if (!window.confirm("¿Eliminar este snippet? No se puede deshacer."))
			return;

		setErrorBorrado(null);
		setEliminandoId(id);

		try {
			const { error } = await borrarSnippet(id);
			if (error) setErrorBorrado(error);
		} catch (error) {
			console.error("[eliminar]", error);
			setErrorBorrado("No se pudo borrar el snippet.");
		} finally {
			setEliminandoId(null);
		}
	}

	return (
		<div className="space-y-12">
			<SnippetForm logueado={logueado} />

			<section
				id="tus-snippets"
				className="scroll-mt-24 space-y-4 border-t border-border pt-10"
			>
				<h2 className="text-base font-semibold tracking-tight">
					Tus snippets{" "}
					{logueado && total > 0 && (
						<span className="font-normal text-muted">({total})</span>
					)}
				</h2>

				{logueado ? (
					<>
						{errorBorrado && (
							<p
								role="alert"
								className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
							>
								{errorBorrado}
							</p>
						)}

						<SnippetList
							snippets={snippets}
							onDelete={eliminar}
							onShare={setCompartiendo}
							eliminandoId={eliminandoId}
						/>
						<Paginacion pagina={pagina} totalPaginas={totalPaginas} />
					</>
				) : (
					<LockedSnippets />
				)}
			</section>

			<DialogoCompartir
				snippet={compartiendo}
				onClose={() => setCompartiendo(null)}
			/>
		</div>
	);
}
