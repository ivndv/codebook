// Esqueleto mientras el Server Component resuelve sesión y snippets
export default function Loading() {
	return (
		<main
			aria-busy="true"
			role="status"
			className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
		>
			<span className="sr-only">Cargando…</span>

			<div className="mb-10 max-w-2xl space-y-3">
				<div className="h-4 w-24 animate-pulse rounded-full bg-surface" />
				<div className="h-8 w-80 max-w-full animate-pulse rounded-lg bg-surface" />
				<div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-surface" />
			</div>

			<div className="space-y-4">
				<div className="h-56 animate-pulse rounded-xl bg-surface" />
				<div className="h-24 animate-pulse rounded-xl bg-surface" />
			</div>
		</main>
	);
}
