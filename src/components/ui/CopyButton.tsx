"use client";

// Iconos
import { Check, Copy } from "lucide-react";
// React
import { useEffect, useState } from "react";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Botón de copiar con feedback "¡Copiado!" — lo comparten el resultado y las tarjetas
export function CopyButton({
	text,
	label,
	ariaLabel,
}: {
	text: string;
	label?: string;
	ariaLabel?: string;
}) {
	const locale = useLocale();

	// Estado
	const [copiado, setCopiado] = useState(false);

	// Textos por defecto del catálogo
	const etiqueta = label ?? m.common_copy({}, { locale });
	const etiquetaAria = ariaLabel ?? m.common_copy_aria({}, { locale });

	// Vuelve al texto normal a los 2 segundos
	useEffect(() => {
		if (!copiado) return;
		const id = setTimeout(() => setCopiado(false), 2000);
		return () => clearTimeout(id);
	}, [copiado]);

	// Handlers
	async function copiar() {
		try {
			await navigator.clipboard.writeText(text);
			setCopiado(true);
		} catch {
			// Si el navegador bloquea el portapapeles, no rompemos la interfaz
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={copiar}
				aria-label={etiquetaAria}
				className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent-text"
			>
				{copiado ? (
					<Check size={14} aria-hidden />
				) : (
					<Copy size={14} aria-hidden />
				)}
				{copiado ? m.common_copied({}, { locale }) : etiqueta}
			</button>
			<span aria-live="polite" className="sr-only">
				{copiado ? m.common_copied_aria({}, { locale }) : ""}
			</span>
		</>
	);
}
