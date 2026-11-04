"use client";

// Next
import Link from "next/link";
import { usePathname } from "next/navigation";

// Enlaces principales del sitio
const ENLACES = [
	{ href: "/", etiqueta: "Inicio" },
	{ href: "/generador", etiqueta: "Generador" },
];

// Nav centrada: marca la ruta activa con una línea inferior
export function NavPrincipal() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Navegación principal"
			className="flex items-center justify-center gap-5"
		>
			{ENLACES.map(({ href, etiqueta }) => {
				const activo = pathname === href;

				return (
					<Link
						key={href}
						href={href}
						aria-current={activo ? "page" : undefined}
						className={`relative py-1 text-sm transition-colors ${
							activo ? "text-accent-text" : "text-muted hover:text-text"
						}`}
					>
						{etiqueta}
						{activo ? (
							<span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
						) : null}
					</Link>
				);
			})}
		</nav>
	);
}
