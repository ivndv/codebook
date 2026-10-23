// Etiqueta compacta para metadatos (lenguaje, contadores…)
export function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-text">
			{children}
		</span>
	);
}
