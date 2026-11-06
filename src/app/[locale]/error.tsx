"use client";

// Iconos
import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react";
// Next
import Link from "next/link";
// React
import { useEffect } from "react";
// Estilos
import { botonPrimario, botonSecundario } from "@/components/ui/estilos";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import { ruta } from "@/i18n/rutas";
import * as m from "@/paraglide/messages";

// Fallback para errores no controlados de la home o el login
export default function ErrorPage({
	error,
	retry,
}: {
	error: unknown;
	retry: () => void;
}) {
	const locale = useLocale();

	// Deja el error en la consola del navegador para poder rastrearlo
	useEffect(() => {
		console.error("[app]", error);
	}, [error]);

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
			<span className="grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-400">
				<TriangleAlert size={26} aria-hidden />
			</span>
			<h1 className="mt-5 text-2xl font-bold tracking-tight">
				{m.err_generic_title({}, { locale })}
			</h1>
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
				{m.err_generic_body({}, { locale })}
			</p>

			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				<button type="button" onClick={() => retry()} className={botonPrimario}>
					<RotateCcw size={16} aria-hidden />
					{m.common_retry({}, { locale })}
				</button>
				<Link href={ruta(locale, "/")} className={botonSecundario}>
					<ArrowLeft size={16} aria-hidden />
					{m.err_back_home({}, { locale })}
				</Link>
			</div>
		</main>
	);
}
