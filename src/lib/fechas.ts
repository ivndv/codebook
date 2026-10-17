// Utilidades de fecha. SOLO cliente: Date.now() no puede vivir en un render del servidor

// Fecha absoluta legible, estable (no depende de la hora actual)
export function formatearFechaAbsoluta(iso: string): string {
	return new Intl.DateTimeFormat("es", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(iso));
}

// Fecha relativa en español: "hace un momento", "hace 2 minutos"…
export function formatearFechaRelativa(fecha: string | Date): string {
	const ms = typeof fecha === "string" ? Date.parse(fecha) : fecha.getTime();
	const segundos = Math.round((ms - Date.now()) / 1000);
	if (Math.abs(segundos) < 60) return "hace un momento";

	const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
	const minutos = Math.round(segundos / 60);
	if (Math.abs(minutos) < 60) return rtf.format(minutos, "minute");

	const horas = Math.round(minutos / 60);
	if (Math.abs(horas) < 24) return rtf.format(horas, "hour");

	return rtf.format(Math.round(horas / 24), "day");
}
