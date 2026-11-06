// Iconos
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
// Estilos
import { botonPrimario } from "@/components/ui/estilos";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import { ruta } from "@/i18n/rutas";
import * as m from "@/paraglide/messages";

// Estado bloqueado de la lista para invitados: existe, pero necesita sesión
export function LockedSnippets() {
	const locale = useLocale();

	return (
		<div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
			<span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text">
				<Lock size={24} aria-hidden />
			</span>
			<p className="mt-3 text-sm font-medium">
				{m.snippet_locked_title({}, { locale })}
			</p>
			<p className="mt-1 text-xs text-muted">
				{m.snippet_locked_body({}, { locale })}
			</p>
			<Link href={ruta(locale, "/login")} className={`${botonPrimario} mt-5`}>
				<LogIn size={16} aria-hidden />
				{m.nav_login({}, { locale })}
			</Link>
		</div>
	);
}
