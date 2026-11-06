"use client";

// Next
import Link from "next/link";
import { usePathname } from "next/navigation";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import { ruta } from "@/i18n/rutas";
// Paraglide
import * as m from "@/paraglide/messages";
import type { Locale } from "@/paraglide/runtime";

// Enlaces principales del sitio
const ENLACES = [
	{ href: "/", etiqueta: (locale: Locale) => m.nav_home({}, { locale }) },
	{
		href: "/generator",
		etiqueta: (locale: Locale) => m.nav_generator({}, { locale }),
	},
];

// Nav centrada: marca la ruta activa con una línea inferior
export function NavPrincipal() {
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<nav
			aria-label={m.nav_primary({}, { locale })}
			className="flex items-center justify-center gap-5"
		>
			{ENLACES.map(({ href, etiqueta }) => {
				const destino = ruta(locale, href);
				const activo = pathname === destino;

				return (
					<Link
						key={href}
						href={destino}
						aria-current={activo ? "page" : undefined}
						className={`relative py-1 text-sm transition-colors ${
							activo ? "text-accent-text" : "text-muted hover:text-text"
						}`}
					>
						{etiqueta(locale)}
						{activo ? (
							<span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
						) : null}
					</Link>
				);
			})}
		</nav>
	);
}
