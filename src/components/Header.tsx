// Iconos
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
// Componentes
import { MenuSesion } from "@/components/MenuSesion";
import { NavPrincipal } from "@/components/NavPrincipal";
// Tipos
import type { Usuario } from "@/core/domain/usuario";

// Barra superior fija: marca y acción de sesión (Server Component)
export function Header({ usuario }: { usuario: Usuario | null }) {
	return (
		<header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/40">
			<div className="mx-auto grid h-16 w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-6">
				<Link
					href="/"
					className="inline-flex items-center gap-2.5 justify-self-start font-semibold tracking-tight"
				>
					<span className="grid size-8 place-items-center rounded-lg bg-accent text-white">
						<BookOpen size={16} aria-hidden />
					</span>
					<span className="hidden sm:inline">codebook</span>
				</Link>

				<NavPrincipal />

				<div className="justify-self-end">
					{usuario ? (
						<MenuSesion email={usuario.email} />
					) : (
						<Link
							href="/login"
							className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-text"
						>
							<User size={16} aria-hidden />
							Iniciar sesión
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
