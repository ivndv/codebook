// Iconos
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
// Estilos
import { botonPrimario } from "@/components/ui/estilos";

// Estado bloqueado de la lista para invitados: existe, pero necesita sesión
export function LockedSnippets() {
	return (
		<div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
			<span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text">
				<Lock size={24} aria-hidden />
			</span>
			<p className="mt-3 text-sm font-medium">
				Inicia sesión para ver tus snippets
			</p>
			<p className="mt-1 text-xs text-muted">
				Tus snippets se guardan en tu cuenta, no en este navegador.
			</p>
			<Link href="/login" className={`${botonPrimario} mt-5`}>
				<LogIn size={16} aria-hidden />
				Iniciar sesión
			</Link>
		</div>
	);
}
