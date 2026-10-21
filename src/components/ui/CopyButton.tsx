"use client";

// Iconos
import { Check, Copy } from "lucide-react";
// React
import { useEffect, useState } from "react";

// Botón de copiar con feedback "¡Copiado!" — lo comparten el resultado y las tarjetas
export function CopyButton({
	text,
	label = "Copiar",
	ariaLabel = "Copiar al portapapeles",
}: {
	text: string;
	label?: string;
	ariaLabel?: string;
}) {
	// Estado
	const [copiado, setCopiado] = useState(false);

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
				aria-label={ariaLabel}
				className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-text"
			>
				{copiado ? (
					<Check size={14} aria-hidden />
				) : (
					<Copy size={14} aria-hidden />
				)}
				{copiado ? "¡Copiado!" : label}
			</button>
			<span aria-live="polite" className="sr-only">
				{copiado ? "Copiado al portapapeles" : ""}
			</span>
		</>
	);
}
