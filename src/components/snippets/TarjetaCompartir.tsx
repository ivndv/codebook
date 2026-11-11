// Iconos
import { BookOpen } from "lucide-react";
// Tipos
import type { Snippet } from "@/core/snippets/domain/snippet";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
// Infraestructura
import { resaltarCodigo } from "@/lib/resaltar-codigo";
import * as m from "@/paraglide/messages";

export type FormatoTarjeta = "escritorio" | "movil";

// Medidas de cada formato de la tarjeta
const FORMATOS = {
	escritorio: {
		ancho: "w-[800px]",
		alto: "",
		padding: "p-8",
		codigo: "max-h-[520px] text-[12px]",
		explicacion: "",
		maxLineas: 24,
	},
	movil: {
		ancho: "w-[540px]",
		alto: "h-[960px]",
		padding: "p-7",
		codigo: "max-h-[440px] shrink-0 text-[12px]",
		explicacion: "line-clamp-4",
		maxLineas: 20,
	},
} as const;

// Formatea la fecha de creación en el idioma activo
function formatearFecha(iso: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
		new Date(iso),
	);
}

// Tarjeta visual que se descarga como PNG
export function TarjetaCompartir({
	snippet,
	formato,
}: {
	snippet: Snippet;
	formato: FormatoTarjeta;
}) {
	const locale = useLocale();
	const medidas = FORMATOS[formato];

	const lineas = snippet.code.split("\n");
	const codigo =
		lineas.slice(0, medidas.maxLineas).join("\n") +
		(lineas.length > medidas.maxLineas ? "\n…" : "");
	const html = resaltarCodigo(codigo, snippet.language);

	return (
		<div
			className={`flex flex-col bg-bg text-text ${medidas.ancho} ${medidas.alto} ${medidas.padding}`}
			style={{
				fontFamily: "var(--font-sans)",
				textRendering: "geometricPrecision",
				WebkitFontSmoothing: "auto",
			}}
		>
			<div className="flex items-center gap-2.5">
				<span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
					<BookOpen size={18} aria-hidden />
				</span>
				<span className="text-base font-semibold leading-6 tracking-tight">
					codebook
				</span>
			</div>

			{formato === "movil" && <div className="flex-1" aria-hidden />}

			<div className="mt-6 flex items-center justify-between">
				<span className="text-[10px] font-semibold uppercase leading-4 tracking-wider text-muted">
					{m.snippet_share_code_label({}, { locale })}
				</span>
				<span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[10px] font-medium uppercase leading-4 tracking-wide text-accent-text">
					{snippet.language ?? m.snippet_default_language({}, { locale })}
				</span>
			</div>

			<pre
				className={`codigo-resaltado mt-2 overflow-hidden rounded-xl border border-border bg-surface-2 p-4 font-mono leading-5 ${medidas.codigo}`}
			>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: highlight.js escapa el código antes de generar el HTML */}
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>

			<span className="mt-4 block text-[10px] font-semibold uppercase leading-4 tracking-wider text-muted">
				{m.snippet_share_explanation_label({}, { locale })}
			</span>

			<p className={`mt-1 text-sm leading-5 text-muted ${medidas.explicacion}`}>
				{snippet.explanation}
			</p>

			{formato === "movil" && <div className="flex-1" aria-hidden />}

			<div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-[10px] leading-4 text-muted">
				<span>{formatearFecha(snippet.createdAt, locale)}</span>
				<span>codebook</span>
			</div>
		</div>
	);
}
