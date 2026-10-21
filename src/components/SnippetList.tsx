// Iconos
import { Inbox } from "lucide-react";
// Componentes
import { SnippetCard } from "@/components/SnippetCard";
// Tipos
import type { Snippet } from "@/core/domain/snippet";

// Lista de snippets guardados, con su estado vacío
export function SnippetList({
	snippets,
	onDelete,
	eliminandoId,
}: {
	snippets: Snippet[];
	onDelete: (id: string) => void;
	eliminandoId: string | null;
}) {
	if (snippets.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border p-12 text-center">
				<Inbox size={32} aria-hidden className="mx-auto text-muted" />
				<p className="mt-2 text-sm font-medium">Todavía no tienes snippets</p>
				<p className="mt-1 text-xs text-muted">
					Pega código arriba, analízalo y guárdalo en tu colección.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{snippets.map((snippet) => (
				<SnippetCard
					key={snippet.id}
					snippet={snippet}
					onDelete={onDelete}
					eliminando={snippet.id === eliminandoId}
				/>
			))}
		</div>
	);
}
