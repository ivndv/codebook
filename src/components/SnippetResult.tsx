// Componentes
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
// Tipos
import type { Summary } from "@/lib/summarize";

// Panel del resultado del análisis actual (el mock se marca con su badge)
export function SnippetResult({ summary }: { summary: Summary }) {
	return (
		<div className="rounded-lg border border-border bg-surface p-4">
			<div className="mb-2 flex flex-wrap items-center gap-2">
				<span className="text-sm font-semibold">✨ Explicación</span>
				{summary.language && <Badge>{summary.language}</Badge>}
				<Badge>mock</Badge>

				<span className="ml-auto">
					<CopyButton
						text={summary.explanation}
						ariaLabel="Copiar la explicación"
					/>
				</span>
			</div>

			<p className="text-sm leading-relaxed text-muted">
				{summary.explanation}
			</p>
		</div>
	);
}
