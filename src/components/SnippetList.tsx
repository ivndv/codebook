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
	onShare,
	eliminandoId,
}: {
	snippets: Snippet[];
	onDelete: (id: string) => void;
	onShare: (snippet: Snippet) => void;
	eliminandoId: string | null;
}) {
	if (snippets.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
				<span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text">
					<Inbox size={24} aria-hidden />
				</span>
				<p className="mt-3 text-sm font-medium">Todavía no tienes snippets</p>
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
					onShare={onShare}
					eliminando={snippet.id === eliminandoId}
				/>
			))}
		</div>
	);
}
