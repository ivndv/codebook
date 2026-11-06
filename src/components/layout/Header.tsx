// Iconos
import { BookOpen } from "lucide-react";
import Link from "next/link";
// Componentes
import { MenuAjustes } from "@/components/layout/MenuAjustes";
import { NavPrincipal } from "@/components/layout/NavPrincipal";
// Tipos
import type { Usuario } from "@/core/auth/domain/usuario";
// Locales
import { ruta } from "@/i18n/rutas";
import { localeActual } from "@/i18n/servidor";

// Barra superior fija: marca, navegación y ajustes (Server Component)
export async function Header({ usuario }: { usuario: Usuario | null }) {
	const locale = await localeActual();
	return (
		<header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/40">
			<div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-6">
				<Link
					href={ruta(locale, "/")}
					className="inline-flex items-center gap-2.5 justify-self-start font-semibold tracking-tight"
				>
					<span className="grid size-8 place-items-center rounded-lg bg-accent text-white">
						<BookOpen size={16} aria-hidden />
					</span>
					<span className="hidden sm:inline">codebook</span>
				</Link>

				<NavPrincipal />

				<div className="justify-self-end">
					<MenuAjustes email={usuario?.email ?? null} />
				</div>
			</div>
		</header>
	);
}
