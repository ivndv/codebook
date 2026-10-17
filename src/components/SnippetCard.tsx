"use client";

// React
import { useState } from "react";
// Componentes
import { FechaRelativa } from "@/components/FechaRelativa";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
// Tipos
import type { Snippet } from "@/lib/snippets";

// Líneas de código que se muestran antes de ofrecer "ver más"
const LINEAS_VISIBLES = 6;

// Tarjeta de un snippet guardado: meta, código y explicación
export function SnippetCard({
	snippet,
	onDelete,
}: {
	snippet: Snippet;
	onDelete: (id: string) => void;
}) {
	// Estado
	const [expandido, setExpandido] = useState(false);

	// Render
	const lineas = snippet.code.split("\n");
	const ocultas = lineas.length - LINEAS_VISIBLES;
	const codigoVisible = expandido
		? snippet.code
		: lineas.slice(0, LINEAS_VISIBLES).join("\n");

	return (
		<article className="rounded-lg border border-border bg-surface p-4">
			<header className="mb-3 flex flex-wrap items-center gap-2">
				{snippet.language && <Badge>{snippet.language}</Badge>}
				<FechaRelativa iso={snippet.created_at} />

				<span className="ml-auto flex items-center gap-2">
					<CopyButton
						text={snippet.code}
						label="⧉ código"
						ariaLabel="Copiar el código"
					/>
					<button
						type="button"
						onClick={() => onDelete(snippet.id)}
						aria-label="Eliminar el snippet"
						className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-red-500/60 hover:text-red-300"
					>
						🗑
					</button>
				</span>
			</header>

			<pre className="overflow-x-auto rounded-md border border-border bg-bg p-3 text-xs leading-relaxed">
				<code>{codigoVisible}</code>
			</pre>

			{ocultas > 0 && (
				<button
					type="button"
					onClick={() => setExpandido((previo) => !previo)}
					className="mt-2 text-xs text-accent hover:underline"
				>
					{expandido ? "ver menos" : `ver ${ocultas} líneas más`}
				</button>
			)}

			<p className="mt-3 text-sm leading-relaxed text-muted">
				💬 {snippet.explanation}
			</p>
		</article>
	);
}
