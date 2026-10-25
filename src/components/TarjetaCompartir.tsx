// Iconos
import { BookOpen } from "lucide-react";
// Tipos
import type { Snippet } from "@/core/domain/snippet";

const MAX_LINEAS = 14;

// Formatea la fecha de creación en español
function formatearFecha(iso: string): string {
	return new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(
		new Date(iso),
	);
}

// Tarjeta visual que se descarga como PNG
export function TarjetaCompartir({ snippet }: { snippet: Snippet }) {
	const lineas = snippet.code.split("\n");
	const codigo =
		lineas.slice(0, MAX_LINEAS).join("\n") +
		(lineas.length > MAX_LINEAS ? "\n…" : "");

	return (
		<div
			className="w-[640px] bg-bg p-8 text-text"
			style={{ fontFamily: "var(--font-sans)" }}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
						<BookOpen size={18} aria-hidden />
					</span>
					<span className="text-base font-semibold tracking-tight">
						codebook
					</span>
				</div>

				<span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-accent-text">
					{snippet.language ?? "snippet"}
				</span>
			</div>

			<pre className="mt-6 max-h-[280px] overflow-hidden rounded-xl border border-border bg-surface-2 p-4 font-mono text-[12px] leading-relaxed">
				<code>{codigo}</code>
			</pre>

			<p className="mt-4 text-sm leading-relaxed text-muted">
				{snippet.explanation}
			</p>

			<div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-[10px] text-muted">
				<span>{formatearFecha(snippet.createdAt)}</span>
				<span>codebook</span>
			</div>
		</div>
	);
}
