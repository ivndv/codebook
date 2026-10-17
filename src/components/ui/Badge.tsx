// Etiqueta compacta para metadatos (lenguaje, mock, contadores…)
export function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
			{children}
		</span>
	);
}
