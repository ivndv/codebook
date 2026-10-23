"use client";

// Iconos
import { LogOut, User } from "lucide-react";
// React
import { useEffect, useRef, useState } from "react";
// Acciones
import { cerrarSesion } from "@/app/login/actions";

// Menú de cuenta: el icono abre el email y la opción de cerrar sesión
export function MenuSesion({ email }: { email: string }) {
	// Estado
	const [abierto, setAbierto] = useState(false);
	const contenedorRef = useRef<HTMLDivElement>(null);

	// Cierra al hacer click fuera o pulsar Escape
	useEffect(() => {
		if (!abierto) return;

		function alClickFuera(evento: MouseEvent) {
			if (
				contenedorRef.current &&
				!contenedorRef.current.contains(evento.target as Node)
			) {
				setAbierto(false);
			}
		}

		function alPulsarTecla(evento: KeyboardEvent) {
			if (evento.key === "Escape") setAbierto(false);
		}

		document.addEventListener("mousedown", alClickFuera);
		document.addEventListener("keydown", alPulsarTecla);

		return () => {
			document.removeEventListener("mousedown", alClickFuera);
			document.removeEventListener("keydown", alPulsarTecla);
		};
	}, [abierto]);

	return (
		<div ref={contenedorRef} className="relative">
			<button
				type="button"
				onClick={() => setAbierto((previo) => !previo)}
				aria-label="Menú de cuenta"
				aria-haspopup="menu"
				aria-expanded={abierto}
				className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-text"
			>
				<User size={16} aria-hidden />
			</button>

			{abierto && (
				<div
					role="menu"
					className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-card"
				>
					<p className="truncate border-b border-border px-4 py-3 text-xs text-muted">
						{email}
					</p>

					<form action={cerrarSesion}>
						<button
							type="submit"
							role="menuitem"
							className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-accent-soft hover:text-text"
						>
							<LogOut size={15} aria-hidden />
							Cerrar sesión
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
