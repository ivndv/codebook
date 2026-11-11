"use client";

// Iconos
import {
	Check,
	Download,
	Link2,
	LoaderCircle,
	Monitor,
	Share2,
	Smartphone,
	X,
} from "lucide-react";
// React
import { useEffect, useRef, useState } from "react";
// Acciones
import { compartirSnippet } from "@/app/actions/share";
// Componentes
import {
	type FormatoTarjeta,
	TarjetaCompartir,
} from "@/components/snippets/TarjetaCompartir";
import {
	botonPrimarioCompacto,
	botonSecundarioCompacto,
} from "@/components/ui/estilos";
// Tipos
import type { Snippet } from "@/core/snippets/domain/snippet";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Anchos de la tarjeta según el formato
const ANCHOS: Record<FormatoTarjeta, number> = {
	escritorio: 800,
	movil: 540,
};
const ALTO_MOVIL = 960;
const ESCALA = 3;

// Las fuentes embebidas se calculan una sola vez por sesión
let fuentesEmbebidas: string | null = null;

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
	const [formato, setFormato] = useState<FormatoTarjeta>("escritorio");

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
			const { getFontEmbedCSS, toPng } = await import("html-to-image");
			const nodo = tarjetaRef.current;
			await document.fonts.ready;

			// Incrusta las fuentes de next/font en el SVG de la captura
			if (fuentesEmbebidas === null) {
				try {
					fuentesEmbebidas = await getFontEmbedCSS(nodo);
				} catch (e) {
					console.warn("[descargar] no se pudieron incrustar las fuentes", e);
				}
			}

			const fontEmbedCSS = fuentesEmbebidas ?? undefined;

			const opciones = {
				width: ANCHOS[formato],
				height: formato === "movil" ? ALTO_MOVIL : nodo.scrollHeight,
				pixelRatio: ESCALA,
				cacheBust: true,
				backgroundColor: getComputedStyle(nodo).backgroundColor || "#0f0e12",
				preferredFontFormat: "woff2" as const,
				fontEmbedCSS,
			};

			// Primera captura: deja las fuentes listas para la definitiva
			await toPng(nodo, opciones);
			const dataUrl = await toPng(nodo, opciones);

			const enlace = document.createElement("a");
			enlace.download = `codebook-${actual.id.slice(0, 8)}-${formato}.png`;
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

				<fieldset className="mb-3 min-w-0">
					<legend className="sr-only">
						{m.snippet_share_format({}, { locale })}
					</legend>

					<div className="flex flex-wrap items-center gap-2">
						<div className="flex gap-1 rounded-lg border border-border bg-bg p-1">
							{(
								[
									[
										"escritorio",
										m.snippet_share_format_desktop({}, { locale }),
										Monitor,
									],
									[
										"movil",
										m.snippet_share_format_mobile({}, { locale }),
										Smartphone,
									],
								] as const
							).map(([valor, etiqueta, Icono]) => (
								<button
									key={valor}
									type="button"
									aria-pressed={formato === valor}
									onClick={() => setFormato(valor)}
									className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
										formato === valor
											? "bg-accent-soft text-accent-text"
											: "text-muted hover:text-text"
									}`}
								>
									<Icono size={14} aria-hidden />
									{etiqueta}
								</button>
							))}
						</div>

						<span className="text-[11px] text-muted">
							{formato === "movil" ? "1620 × 2880 px" : "2400 px"}
						</span>
					</div>
				</fieldset>

				<div className="overflow-x-auto rounded-xl bg-bg p-3">
					<div className="flex justify-center">
						<div
							ref={tarjetaRef}
							className="bg-bg"
							style={{ width: ANCHOS[formato] }}
						>
							<TarjetaCompartir snippet={snippet} formato={formato} />
						</div>
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
						className={botonPrimarioCompacto}
					>
						{generando ? (
							<LoaderCircle size={14} aria-hidden className="animate-spin" />
						) : (
							<Download size={14} aria-hidden />
						)}
						{m.snippet_download_png({}, { locale })}
					</button>

					<button
						type="button"
						onClick={() => void copiarEnlace()}
						disabled={generando}
						className={botonSecundarioCompacto}
					>
						{copiado ? (
							<Check size={14} aria-hidden />
						) : (
							<Link2 size={14} aria-hidden />
						)}
						{copiado
							? m.common_copied({}, { locale })
							: m.snippet_copy_link({}, { locale })}
					</button>

					<button
						type="button"
						onClick={() => void compartir()}
						disabled={generando}
						className={botonSecundarioCompacto}
					>
						<Share2 size={14} aria-hidden />
						{m.common_share({}, { locale })}
					</button>
				</div>
			</div>
		</div>
	);
}
