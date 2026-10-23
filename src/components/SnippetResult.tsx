// Iconos
import { Sparkles } from "lucide-react";
// Componentes
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { tarjeta } from "@/components/ui/estilos";
// Tipos
import type { Summary } from "@/core/domain/snippet";

// Panel del resultado del análisis actual
export function SnippetResult({ summary }: { summary: Summary }) {
	return (
		<div className={`${tarjeta} p-5`}>
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<span className="inline-flex items-center gap-2 text-sm font-semibold">
					<span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent-text">
						<Sparkles size={15} aria-hidden />
					</span>
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
