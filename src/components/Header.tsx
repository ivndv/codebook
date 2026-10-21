// Next

// Iconos
import { BookOpen, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
// Acciones
import { cerrarSesion } from "@/app/login/actions";
// Tipos
import type { Usuario } from "@/core/domain/usuario";

// Barra superior: logo y estado de sesión (Server Component)
export function Header({ usuario }: { usuario: Usuario | null }) {
	return (
		<header className="border-b border-border">
			<div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2">
					<BookOpen size={18} aria-hidden />
					<span className="font-semibold tracking-tight">codebook</span>
				</Link>

				{usuario ? (
					<div className="flex items-center gap-3">
						<span className="text-xs text-muted">{usuario.email}</span>
						<form action={cerrarSesion}>
							<button
								type="submit"
								className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-text"
							>
								<LogOut size={16} aria-hidden />
								Cerrar sesión
							</button>
						</form>
					</div>
				) : (
					<Link
						href="/login"
						className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-text"
					>
						<LogIn size={16} aria-hidden />
						Iniciar sesión
					</Link>
				)}
			</div>
		</header>
	);
}
