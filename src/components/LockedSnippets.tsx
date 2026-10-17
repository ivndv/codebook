// Next
import Link from "next/link";

// Estado bloqueado de la lista para invitados: existe, pero necesita sesión
export function LockedSnippets() {
	return (
		<div className="rounded-lg border border-dashed border-border p-12 text-center">
			<p className="text-2xl" aria-hidden>
				🔒
			</p>
			<p className="mt-2 text-sm font-medium">
				Inicia sesión para ver tus snippets
			</p>
			<p className="mt-1 text-xs text-muted">
				Tus snippets se guardan en tu cuenta, no en este navegador.
			</p>
			<Link
				href="/login"
				className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
			>
				Iniciar sesión
			</Link>
		</div>
	);
}
