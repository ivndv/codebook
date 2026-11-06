"use client";

// React
import { useEffect, useState } from "react";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";

// Fecha absoluta legible, estable (no depende de la hora actual)
function formatearFechaAbsoluta(iso: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(iso));
}

// Fecha relativa en el idioma activo: "hace 2 minutos", "2 minutes ago"…
function formatearFechaRelativa(fecha: string, locale: string): string {
	const segundos = Math.round((Date.parse(fecha) - Date.now()) / 1000);
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

	if (Math.abs(segundos) < 60) return rtf.format(0, "second");

	const minutos = Math.round(segundos / 60);
	if (Math.abs(minutos) < 60) return rtf.format(minutos, "minute");

	const horas = Math.round(minutos / 60);
	if (Math.abs(horas) < 24) return rtf.format(horas, "hour");

	return rtf.format(Math.round(horas / 24), "day");
}

// Muestra "hace X" calculado en el cliente: Next 16 prohíbe Date.now() en el render,
// así que el servidor pinta una fecha absoluta estable y el cliente la reemplaza
export function FechaRelativa({ iso }: { iso: string }) {
	const locale = useLocale();

	// Estado
	const [texto, setTexto] = useState(() => formatearFechaAbsoluta(iso, locale));

	useEffect(() => {
		const actualizar = () => setTexto(formatearFechaRelativa(iso, locale));
		actualizar();
		// Refresca cada minuto para que "hace 2 minutos" no se quede viejo
		const id = setInterval(actualizar, 60_000);
		return () => clearInterval(id);
	}, [iso, locale]);

	return (
		<span suppressHydrationWarning className="text-xs text-muted">
			{texto}
		</span>
	);
}
