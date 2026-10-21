// Iconos
import { Sparkles } from "lucide-react";
// Componentes
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
// Tipos
import type { Summary } from "@/core/domain/snippet";

// Panel del resultado del análisis actual
export function SnippetResult({ summary }: { summary: Summary }) {
	return (
		<div className="rounded-lg border border-border bg-surface p-4">
			<div className="mb-2 flex flex-wrap items-center gap-2">
				<span className="inline-flex items-center gap-1.5 text-sm font-semibold">
					<Sparkles size={16} aria-hidden />
					Explicación
				</span>
				{summary.language && <Badge>{summary.language}</Badge>}

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
