// Iconos
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
// Componentes
import { MenuSesion } from "@/components/MenuSesion";
// Tipos
import type { Usuario } from "@/core/domain/usuario";

// Barra superior fija: marca y acción de sesión (Server Component)
export function Header({ usuario }: { usuario: Usuario | null }) {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					href="/"
					className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
				>
					<span className="grid size-8 place-items-center rounded-lg bg-accent text-white">
						<BookOpen size={16} aria-hidden />
					</span>
					codebook
				</Link>

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
		</header>
	);
}
