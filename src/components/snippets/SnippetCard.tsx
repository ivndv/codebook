"use client";

// Iconos
import { MessageSquareText, Share2, Trash2 } from "lucide-react";
// React
import { useMemo, useState } from "react";
// Componentes
import { FechaRelativa } from "@/components/snippets/FechaRelativa";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { tarjeta } from "@/components/ui/estilos";
// Tipos
import type { Snippet } from "@/core/snippets/domain/snippet";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
// Infraestructura
import { resaltarCodigo } from "@/lib/resaltar-codigo";
// Paraglide
import * as m from "@/paraglide/messages";

// Líneas de código que se muestran antes de ofrecer "ver más"
const LINEAS_VISIBLES = 6;

// Tarjeta de un snippet: metadatos, código, explicación y compartir
export function SnippetCard({
	snippet,
	onDelete,
	onShare,
	eliminando,
}: {
	snippet: Snippet;
	onDelete: (id: string) => void;
	onShare: (snippet: Snippet) => void;
	eliminando: boolean;
}) {
	const locale = useLocale();

	// Estado
	const [expandido, setExpandido] = useState(false);

	// Render
	const lineas = snippet.code.split("\n");
	const ocultas = lineas.length - LINEAS_VISIBLES;
	const codigoVisible = expandido
		? snippet.code
		: lineas.slice(0, LINEAS_VISIBLES).join("\n");
	const html = useMemo(
		() => resaltarCodigo(codigoVisible, snippet.language),
		[codigoVisible, snippet.language],
	);
	const etiquetaCompartir = m.snippet_share_aria({}, { locale });
	const etiquetaEliminar = m.snippet_delete_aria({}, { locale });

	return (
		<article
			className={`${tarjeta} p-5 transition-colors hover:border-accent/40`}
		>
			<header className="mb-3 flex flex-wrap items-center gap-2">
				{snippet.language && <Badge>{snippet.language}</Badge>}
				<FechaRelativa iso={snippet.createdAt} />

				<span className="ml-auto flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => onShare(snippet)}
						aria-label={etiquetaCompartir}
						title={etiquetaCompartir}
						className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent-text"
					>
						<Share2 size={14} aria-hidden />
						{m.common_share({}, { locale })}
					</button>

					<CopyButton
						text={snippet.code}
						label={m.snippet_copy_label({}, { locale })}
						ariaLabel={m.snippet_copy_aria({}, { locale })}
					/>

					<button
						type="button"
						onClick={() => onDelete(snippet.id)}
						disabled={eliminando}
						aria-busy={eliminando}
						aria-label={etiquetaEliminar}
						title={etiquetaEliminar}
						className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-red-500/60 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{eliminando ? "…" : <Trash2 size={14} aria-hidden />}
					</button>
				</span>
			</header>

			<pre className="codigo-resaltado overflow-x-auto rounded-lg border border-border bg-bg p-3.5 text-xs leading-relaxed">
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: highlight.js escapa el código antes de generar el HTML */}
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>

			{ocultas > 0 && (
				<button
					type="button"
					onClick={() => setExpandido((previo) => !previo)}
					className="mt-2 text-xs text-accent-text hover:underline"
				>
					{expandido
						? m.snippet_show_less({}, { locale })
						: m.snippet_show_more({ count: ocultas }, { locale })}
				</button>
			)}

			<p className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-muted">
				<MessageSquareText size={14} aria-hidden className="mt-0.5 shrink-0" />
				<span>{snippet.explanation}</span>
			</p>
		</article>
	);
}
