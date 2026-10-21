// Esqueleto mientras el Server Component resuelve sesión y snippets
export default function Loading() {
	return (
		<main
			aria-busy="true"
			role="status"
			className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16"
		>
			<span className="sr-only">Cargando…</span>

			<div className="mb-10 space-y-3 sm:mb-12">
				<div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-surface" />
				<div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-surface" />
			</div>

			<div className="space-y-4">
				<div className="h-56 animate-pulse rounded-lg bg-surface" />
				<div className="h-24 animate-pulse rounded-lg bg-surface" />
			</div>
		</main>
	);
}
