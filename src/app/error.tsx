"use client";

// Iconos
import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react";
// Next
import Link from "next/link";
// React
import { useEffect } from "react";

// Fallback para errores no controlados de la home o el login
export default function ErrorPage({
	error,
	retry,
}: {
	error: unknown;
	retry: () => void;
}) {
	// Deja el error en la consola del navegador para poder rastrearlo
	useEffect(() => {
		console.error("[app]", error);
	}, [error]);

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 text-center">
			<TriangleAlert size={40} aria-hidden className="text-red-400" />
			<h1 className="mt-4 text-xl font-bold tracking-tight">Algo salió mal</h1>
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
				No pudimos cargar esta página. Vuelve a intentarlo en unos segundos.
			</p>

			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => retry()}
					className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
				>
					<RotateCcw size={16} aria-hidden />
					Reintentar
				</button>
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-text"
				>
					<ArrowLeft size={16} aria-hidden />
					Volver al inicio
				</Link>
			</div>
		</main>
	);
}
