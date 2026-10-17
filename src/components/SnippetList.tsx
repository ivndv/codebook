// Componentes
import { SnippetCard } from "@/components/SnippetCard";
// Tipos
import type { Snippet } from "@/lib/snippets";

// Lista de snippets guardados, con su estado vacío
export function SnippetList({
	snippets,
	onDelete,
}: {
	snippets: Snippet[];
	onDelete: (id: string) => void;
}) {
	if (snippets.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border p-12 text-center">
				<p className="text-2xl" aria-hidden>
					📭
				</p>
				<p className="mt-2 text-sm font-medium">Todavía no tienes snippets</p>
				<p className="mt-1 text-xs text-muted">
					Pega código arriba y pulsa «Analizar y Guardar».
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{snippets.map((snippet) => (
				<SnippetCard key={snippet.id} snippet={snippet} onDelete={onDelete} />
			))}
		</div>
	);
}
