"use client";

// Iconos
import { Check, Download, Link2, LoaderCircle, Share2, X } from "lucide-react";
// React
import { useEffect, useRef, useState } from "react";
// Acciones
import { compartirSnippet } from "@/app/actions/share";
// Componentes
import { TarjetaCompartir } from "@/components/snippets/TarjetaCompartir";
import { botonPrimario, botonSecundario } from "@/components/ui/estilos";
// Tipos
import type { Snippet } from "@/core/snippets/domain/snippet";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Diálogo de compartir: PNG local + enlace público + Web Share
export function DialogoCompartir({
	snippet,
	onClose,
}: {
	snippet: Snippet | null;
	onClose: () => void;
}) {
	const locale = useLocale();

	// Estado
	const tarjetaRef = useRef<HTMLDivElement>(null);
	const [generando, setGenerando] = useState(false);
	const [copiado, setCopiado] = useState(false);
	const [url, setUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Cierra con Escape
	useEffect(() => {
		if (!snippet) return;

		function alPulsar(evento: KeyboardEvent) {
			if (evento.key === "Escape") onClose();
		}

		document.addEventListener("keydown", alPulsar);
		return () => document.removeEventListener("keydown", alPulsar);
	}, [snippet, onClose]);

	if (!snippet) return null;

	const actual = snippet;

	// Handlers
	async function crearUrl(): Promise<string | null> {
		const resultado = await compartirSnippet(locale, actual.id);

		if (!resultado.ok) {
			setError(resultado.error);
			return null;
		}

		setUrl(resultado.url);
		return resultado.url;
	}

	async function descargar() {
		if (!tarjetaRef.current) return;

		setGenerando(true);
		setError(null);

		try {
			const { toPng } = await import("html-to-image");
			const dataUrl = await toPng(tarjetaRef.current, {
				pixelRatio: 2,
				cacheBust: true,
				backgroundColor: "#0f0e12",
			});

			const enlace = document.createElement("a");
			enlace.download = `codebook-${actual.id.slice(0, 8)}.png`;
			enlace.href = dataUrl;
			enlace.click();
		} catch (e) {
			console.error("[descargar]", e);
			setError(m.err_image({}, { locale }));
		} finally {
			setGenerando(false);
		}
	}

	async function copiarEnlace() {
		setGenerando(true);
		setError(null);

		const enlace = url ?? (await crearUrl());

		if (!enlace) {
			setGenerando(false);
			return;
		}

		try {
			await navigator.clipboard.writeText(enlace);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2_000);
		} catch {
			setError(m.err_copy_link({}, { locale }));
		} finally {
			setGenerando(false);
		}
	}

	async function compartir() {
		setError(null);

		const enlace = url ?? (await crearUrl());

		if (!enlace) return;

		if (navigator.share) {
			try {
				await navigator.share({
					title: m.snippet_share_title({}, { locale }),
					url: enlace,
				});
			} catch {
				// El usuario canceló el diálogo nativo
			}
			return;
		}

		await copiarEnlace();
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label={m.common_close({}, { locale })}
				onClick={onClose}
				className="absolute inset-0 bg-black/70"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={m.snippet_dialog_title({}, { locale })}
				className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-card"
			>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-sm font-semibold">
						{m.snippet_dialog_title({}, { locale })}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={m.common_close({}, { locale })}
						className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-text"
					>
						<X size={16} aria-hidden />
					</button>
				</div>

				<div className="overflow-x-auto rounded-xl bg-bg p-3">
					<div ref={tarjetaRef} className="mx-auto w-[800px]">
						<TarjetaCompartir snippet={snippet} />
					</div>
				</div>

				{error && (
					<p
						role="alert"
						className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
					>
						{error}
					</p>
				)}

				{url && <p className="mt-3 truncate text-xs text-muted">{url}</p>}

				<div className="mt-4 flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => void descargar()}
						disabled={generando}
						className={botonPrimario}
					>
						{generando ? (
							<LoaderCircle size={16} aria-hidden className="animate-spin" />
						) : (
							<Download size={16} aria-hidden />
						)}
						{m.snippet_download_png({}, { locale })}
					</button>

					<button
						type="button"
						onClick={() => void copiarEnlace()}
						disabled={generando}
						className={botonSecundario}
					>
						{copiado ? (
							<Check size={16} aria-hidden />
						) : (
							<Link2 size={16} aria-hidden />
						)}
						{copiado
							? m.common_copied({}, { locale })
							: m.snippet_copy_link({}, { locale })}
					</button>

					<button
						type="button"
						onClick={() => void compartir()}
						disabled={generando}
						className={botonSecundario}
					>
						<Share2 size={16} aria-hidden />
						{m.common_share({}, { locale })}
					</button>
				</div>
			</div>
		</div>
	);
}
