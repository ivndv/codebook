"use client";

// React
import { useState } from "react";
// Acciones
import { borrarSnippet } from "@/app/actions/delete";
// Componentes
import { BuscadorSnippets } from "@/components/BuscadorSnippets";
import { DialogoCompartir } from "@/components/DialogoCompartir";
import { LockedSnippets } from "@/components/LockedSnippets";
import { Paginacion } from "@/components/Paginacion";
import { SnippetForm } from "@/components/SnippetForm";
import { SnippetList } from "@/components/SnippetList";
// Tipos
import type { FiltrosSnippets } from "@/core/domain/filtros-snippets";
import type { Snippet } from "@/core/domain/snippet";
import type { Usuario } from "@/core/domain/usuario";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Panel de la app: formulario + lista paginada y filtrable
export function CodebookApp({
	usuario,
	snippets,
	total,
	pagina,
	totalPaginas,
	filtros,
	lenguajes,
}: {
	usuario: Usuario | null;
	snippets: Snippet[];
	total: number;
	pagina: number;
	totalPaginas: number;
	filtros: FiltrosSnippets;
	lenguajes: string[];
}) {
	const locale = useLocale();

	// Estado
	const logueado = usuario !== null;
	const [eliminandoId, setEliminandoId] = useState<string | null>(null);
	const [errorAccion, setErrorAccion] = useState<string | null>(null);
	const [compartiendo, setCompartiendo] = useState<Snippet | null>(null);

	// Handlers
	async function eliminar(id: string) {
		if (!window.confirm(m.snippet_delete_confirm({}, { locale }))) return;

		setErrorAccion(null);
		setEliminandoId(id);

		try {
			const { error } = await borrarSnippet(locale, id);
			if (error) setErrorAccion(error);
		} catch (error) {
			console.error("[eliminar]", error);
			setErrorAccion(m.err_delete({}, { locale }));
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
					{m.snippet_heading({}, { locale })}{" "}
					{logueado && total > 0 && (
						<span className="font-normal text-muted">({total})</span>
					)}
				</h2>

				{logueado ? (
					<>
						<BuscadorSnippets filtros={filtros} lenguajes={lenguajes} />

						{errorAccion && (
							<p
								role="alert"
								className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
							>
								{errorAccion}
							</p>
						)}

						<SnippetList
							snippets={snippets}
							onDelete={eliminar}
							onShare={setCompartiendo}
							eliminandoId={eliminandoId}
							filtros={filtros}
						/>
						<Paginacion
							pagina={pagina}
							totalPaginas={totalPaginas}
							filtros={filtros}
						/>
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
