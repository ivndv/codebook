// Iconos
import { LoaderCircle, Save, Sparkles } from "lucide-react";
// Componentes
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { botonPrimarioCompacto, tarjeta } from "@/components/ui/estilos";
// Tipos
import type { Summary } from "@/core/snippets/domain/snippet";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
// Infraestructura
import { resaltarCodigo } from "@/lib/resaltar-codigo";
// Paraglide
import * as m from "@/paraglide/messages";

// Panel del resultado del análisis actual
export function SnippetResult({
	summary,
	codigo,
	onSave,
	guardando = false,
}: {
	summary: Summary;
	codigo?: string | null;
	onSave?: () => void;
	guardando?: boolean;
}) {
	const locale = useLocale();
	const html = codigo ? resaltarCodigo(codigo, summary.language) : null;

	return (
		<div className={`${tarjeta} p-5`}>
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<span className="inline-flex items-center gap-2 text-sm font-semibold">
					<span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent-text">
						<Sparkles size={15} aria-hidden />
					</span>
					{m.gen_explanation({}, { locale })}
				</span>
				{summary.language && <Badge>{summary.language}</Badge>}

				<span className="ml-auto flex items-center gap-2">
					<CopyButton
						text={summary.explanation}
						ariaLabel={m.gen_copy_explanation_aria({}, { locale })}
					/>
					{onSave && (
						<button
							type="button"
							onClick={onSave}
							disabled={guardando}
							aria-busy={guardando}
							className={botonPrimarioCompacto}
						>
							{guardando ? (
								<LoaderCircle size={14} aria-hidden className="animate-spin" />
							) : (
								<Save size={14} aria-hidden />
							)}
							{guardando
								? m.gen_saving({}, { locale })
								: m.gen_save({}, { locale })}
						</button>
					)}
				</span>
			</div>

			<p className="text-sm leading-relaxed text-muted">
				{summary.explanation}
			</p>

			{html && (
				<pre className="codigo-resaltado mt-3 max-h-[320px] overflow-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed">
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: highlight.js escapa el código antes de generar el HTML */}
					<code dangerouslySetInnerHTML={{ __html: html }} />
				</pre>
			)}
		</div>
	);
}
