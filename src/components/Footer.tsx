// Next
import { BookOpen } from "lucide-react";
import Link from "next/link";

// Tecnologías del proyecto, en la barra inferior
const TECNOLOGIAS = ["Next.js", "Supabase", "FastAPI", "Vercel"];

// Enlaces de navegación del sitio
const NAVEGACION = [
	{ href: "/", etiqueta: "Inicio" },
	{ href: "/generador", etiqueta: "Generador" },
	{ href: "/login", etiqueta: "Iniciar sesión" },
];

// Enlaces al proyecto
const PROYECTO = [
	{ href: "https://github.com/ivndv/codebook", etiqueta: "Repositorio" },
	{
		href: "https://github.com/ivndv/codebook#readme",
		etiqueta: "Documentación",
	},
	{ href: "https://codebook-ivndv.vercel.app", etiqueta: "Producción" },
];

// Icono de GitHub (lucide v1 ya no incluye iconos de marca)
function IconoGithub() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden
			className="size-[18px]"
		>
			<path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
		</svg>
	);
}

// Año actual, cacheado en build: Next 16 prohíbe new Date() durante el render
async function obtenerAnio(): Promise<number> {
	"use cache";
	return new Date().getFullYear();
}

// Pie de página global: identidad, navegación, proyecto y créditos
export async function Footer() {
	const anio = await obtenerAnio();

	return (
		<footer className="mt-20 border-t border-border">
			<div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
				{/* Columnas */}
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
					{/* Identidad */}
					<div className="space-y-4">
						<Link
							href="/"
							className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
						>
							<span className="grid size-8 place-items-center rounded-lg bg-accent text-white">
								<BookOpen size={16} aria-hidden />
							</span>
							codebook
						</Link>
						<p className="max-w-xs text-sm leading-relaxed text-muted">
							Pega un fragmento y la IA te devuelve un resumen de una línea. Tu
							memoria de código, siempre a mano.
						</p>
						<a
							href="https://github.com/ivndv/codebook"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Repositorio en GitHub"
							className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent-text"
						>
							<IconoGithub />
						</a>
					</div>

					{/* Navegación */}
					<div className="space-y-3">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
							Navegación
						</h3>
						<ul className="space-y-2 text-sm">
							{NAVEGACION.map((enlace) => (
								<li key={enlace.href}>
									<Link
										href={enlace.href}
										className="text-muted transition-colors hover:text-accent-text"
									>
										{enlace.etiqueta}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Proyecto */}
					<div className="space-y-3">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
							Proyecto
						</h3>
						<ul className="space-y-2 text-sm">
							{PROYECTO.map((enlace) => (
								<li key={enlace.href}>
									<a
										href={enlace.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted transition-colors hover:text-accent-text"
									>
										{enlace.etiqueta}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Barra inferior: créditos, tecnologías y derechos */}
				<div className="mt-12 flex flex-col items-center gap-6 border-t border-border pt-8 sm:flex-row sm:justify-between">
					<p className="text-xs text-muted">
						© {anio} codebook · Desarrollado por{" "}
						<span className="font-medium text-text">Ivan Cruz</span>
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						{TECNOLOGIAS.map((tech) => (
							<span
								key={tech}
								className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent-text"
							>
								{tech}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
