// Next

// Iconos
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const claseNumero =
	"flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm text-muted transition-colors hover:border-accent hover:text-text";

const claseNumeroActual =
	"flex h-8 w-8 items-center justify-center rounded-md border border-accent bg-accent text-sm font-semibold text-white";

const claseFlechaDeshabilitada =
	"flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm text-muted/30";

// Ventana de hasta 3 números centrada en la página actual
function ventana(pagina: number, total: number): number[] {
	const inicio = Math.max(1, Math.min(pagina - 1, total - 2));
	return [inicio, inicio + 1, inicio + 2].filter((n) => n >= 1 && n <= total);
}

// Paginación numerada: flechas, ventana de 3 y salto manual
export function Paginacion({
	pagina,
	totalPaginas,
}: {
	pagina: number;
	totalPaginas: number;
}) {
	if (totalPaginas <= 1) return null;

	const hayAnterior = pagina > 1;
	const haySiguiente = pagina < totalPaginas;

	return (
		<nav
			aria-label="Paginación de snippets"
			className="flex flex-wrap items-center justify-center gap-3 pt-2"
		>
			<div className="flex items-center gap-2">
				{/* Flecha anterior */}
				{hayAnterior ? (
					<Link
						href={`/?pagina=${pagina - 1}`}
						aria-label="Página anterior"
						className={claseNumero}
					>
						<ChevronLeft size={16} aria-hidden />
					</Link>
				) : (
					<span aria-hidden className={claseFlechaDeshabilitada}>
						<ChevronLeft size={16} aria-hidden />
					</span>
				)}

				{/* Números (la actual no es enlace) */}
				{ventana(pagina, totalPaginas).map((numero) =>
					numero === pagina ? (
						<span
							key={numero}
							aria-current="page"
							className={claseNumeroActual}
						>
							{numero}
						</span>
					) : (
						<Link
							key={numero}
							href={`/?pagina=${numero}`}
							aria-label={`Ir a la página ${numero}`}
							className={claseNumero}
						>
							{numero}
						</Link>
					),
				)}

				{/* Flecha siguiente */}
				{haySiguiente ? (
					<Link
						href={`/?pagina=${pagina + 1}`}
						aria-label="Página siguiente"
						className={claseNumero}
					>
						<ChevronRight size={16} aria-hidden />
					</Link>
				) : (
					<span aria-hidden className={claseFlechaDeshabilitada}>
						<ChevronRight size={16} aria-hidden />
					</span>
				)}

				<span className="ml-2 text-xs text-muted">
					Página {pagina} de {totalPaginas}
				</span>
			</div>

			{/* Salto manual: formulario GET → /?pagina=N (sin JavaScript) */}
			<form action="/" method="get" className="flex items-center gap-2">
				<label htmlFor="pagina" className="text-xs text-muted">
					Ir a
				</label>
				<input
					id="pagina"
					name="pagina"
					type="number"
					min={1}
					max={totalPaginas}
					defaultValue={pagina}
					className="w-16 rounded-md border border-border bg-surface px-2 py-1 text-center text-xs outline-none transition-colors focus:border-accent"
				/>
				<button
					type="submit"
					className="rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-text"
				>
					Ir
				</button>
			</form>
		</nav>
	);
}
