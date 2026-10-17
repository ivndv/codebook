"use client";

// React
import { useEffect, useState } from "react";
// Fechas
import { formatearFechaAbsoluta, formatearFechaRelativa } from "@/lib/fechas";

// Muestra "hace X" calculado en el cliente: Next 16 prohíbe Date.now() en el render,
// así que el servidor pinta una fecha absoluta estable y el cliente la reemplaza
export function FechaRelativa({ iso }: { iso: string }) {
	// Estado
	const [texto, setTexto] = useState(() => formatearFechaAbsoluta(iso));

	useEffect(() => {
		const actualizar = () => setTexto(formatearFechaRelativa(iso));
		actualizar();
		// Refresca cada minuto para que "hace 2 minutos" no se quede viejo
		const id = setInterval(actualizar, 60_000);
		return () => clearInterval(id);
	}, [iso]);

	return (
		<span suppressHydrationWarning className="text-xs text-muted">
			{texto}
		</span>
	);
}
