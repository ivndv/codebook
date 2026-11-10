"use client";

// Iconos
import {
	CircleUserRound,
	Globe,
	LogIn,
	LogOut,
	Monitor,
	Moon,
	Sun,
} from "lucide-react";
// Next
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
// React
import { useEffect, useRef, useState } from "react";
// Acciones
import { cerrarSesion } from "@/app/[locale]/(auth)/login/actions";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import { ruta } from "@/i18n/rutas";
// Paraglide
import * as m from "@/paraglide/messages";
import { type Locale, setLocale } from "@/paraglide/runtime";

// Idiomas disponibles para cambiar desde el menú
const IDIOMAS = [
	{ valor: "es", codigo: "ES" },
	{ valor: "en", codigo: "EN" },
] as const satisfies readonly { valor: Locale; codigo: string }[];

// Temas disponibles con su icono
const TEMAS = [
	{ valor: "light", Icono: Sun },
	{ valor: "dark", Icono: Moon },
	{ valor: "system", Icono: Monitor },
] as const;

// Etiqueta traducida de cada tema
function etiquetaTema(valor: (typeof TEMAS)[number]["valor"], locale: Locale) {
	if (valor === "light") return m.theme_light({}, { locale });
	if (valor === "dark") return m.theme_dark({}, { locale });
	return m.theme_system({}, { locale });
}

// Menú de ajustes: cuenta, idioma y tema en un solo panel
export function MenuAjustes({ email }: { email: string | null }) {
	// Estado
	const [abierto, setAbierto] = useState(false);
	const contenedorRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	const inicial = email?.charAt(0).toUpperCase() ?? "";
	const temaActual = theme ?? "system";

	// Cierra al hacer click fuera o pulsar Escape, y enfoca el panel al abrir
	useEffect(() => {
		if (!abierto) return;

		panelRef.current?.focus();

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

	// Cambia de idioma conservando la ruta y la query actuales
	function cambiarIdioma(otro: Locale) {
		if (otro === locale) return;

		// Guarda la cookie de Paraglide y deja que Next navegue sin recargar
		void setLocale(otro, { reload: false });

		const resto = pathname.replace(/^\/(?:es|en)(?=\/|$)/, "");
		const query = typeof window === "undefined" ? "" : window.location.search;

		setAbierto(false);
		router.push(`${ruta(otro, resto || "/")}${query}`);
	}

	return (
		<div ref={contenedorRef} className="relative">
			<button
				type="button"
				onClick={() => setAbierto((previo) => !previo)}
				aria-label={m.nav_settings({}, { locale })}
				aria-haspopup="dialog"
				aria-expanded={abierto}
				className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-text"
			>
				{email ? (
					<span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold leading-none text-white">
						{inicial}
					</span>
				) : (
					<CircleUserRound size={18} aria-hidden />
				)}
			</button>

			{abierto && (
				<div
					ref={panelRef}
					role="dialog"
					aria-label={m.nav_settings({}, { locale })}
					tabIndex={-1}
					className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-card outline-none"
				>
					{/* Cuenta */}
					{email ? (
						<div className="flex items-center gap-3 px-2 py-1.5">
							<span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold leading-none text-white">
								{inicial}
							</span>
							<div className="min-w-0">
								<p className="truncate text-[13px] font-medium text-text">
									{email}
								</p>
								<p className="text-[10px] text-muted">
									{m.nav_account({}, { locale })}
								</p>
							</div>
						</div>
					) : null}

					{/* Preferencias */}
					<section className="mt-1 border-t border-border px-2 pb-1.5 pt-1.5">
						<p className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
							{m.nav_preferences({}, { locale })}
						</p>

						<div className="flex items-center justify-between gap-3 py-1">
							<span className="flex items-center gap-2 text-[13px] text-muted">
								<Globe size={14} aria-hidden />
								{m.nav_language({}, { locale })}
							</span>

							<div
								role="radiogroup"
								aria-label={m.nav_language({}, { locale })}
								className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5 focus-within:ring-2 focus-within:ring-accent"
							>
								{IDIOMAS.map(({ valor, codigo }) => {
									const activo = valor === locale;

									return (
										<label
											key={valor}
											htmlFor={`idioma-${valor}`}
											className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
												activo
													? "bg-surface text-text shadow-sm"
													: "text-muted hover:text-text"
											}`}
										>
											<input
												type="radio"
												id={`idioma-${valor}`}
												name="idioma"
												value={valor}
												checked={activo}
												onChange={() => cambiarIdioma(valor)}
												className="sr-only"
											/>
											{codigo}
										</label>
									);
								})}
							</div>
						</div>

						<div className="flex items-center justify-between gap-3 py-1">
							<span className="flex items-center gap-2 text-[13px] text-muted">
								<Sun size={14} aria-hidden />
								{m.theme_label({}, { locale })}
							</span>

							<div
								role="radiogroup"
								aria-label={m.theme_label({}, { locale })}
								className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5 focus-within:ring-2 focus-within:ring-accent"
							>
								{TEMAS.map(({ valor, Icono }) => {
									const activo = temaActual === valor;
									const etiqueta = etiquetaTema(valor, locale);

									return (
										<label
											key={valor}
											htmlFor={`tema-${valor}`}
											title={etiqueta}
											className={`grid size-6 cursor-pointer place-items-center rounded-md transition-colors ${
												activo
													? "bg-surface text-text shadow-sm"
													: "text-muted hover:text-text"
											}`}
										>
											<input
												type="radio"
												id={`tema-${valor}`}
												name="tema"
												value={valor}
												checked={activo}
												aria-label={etiqueta}
												onChange={() => setTheme(valor)}
												className="sr-only"
											/>
											<Icono size={13} aria-hidden />
										</label>
									);
								})}
							</div>
						</div>
					</section>

					{/* Sesión */}
					<div className="mt-1 border-t border-border px-2 pt-1.5">
						{email ? (
							<form action={cerrarSesion}>
								<button
									type="submit"
									className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-danger transition-colors hover:bg-danger/10"
								>
									<LogOut size={14} aria-hidden />
									{m.nav_logout({}, { locale })}
								</button>
							</form>
						) : (
							<Link
								href={ruta(locale, "/login")}
								onClick={() => setAbierto(false)}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-2 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
							>
								<LogIn size={14} aria-hidden />
								{m.nav_login({}, { locale })}
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
