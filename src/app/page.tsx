// Next

import { ArrowRight, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";

export const metadata: Metadata = {
	title: "codebook — Tu código, explicado",
	description:
		"Pega un fragmento y la IA te devuelve un resumen de una línea. Guárdalo en tu colección personal.",
};

// La sesión se resuelve en cada request (getHeader)
export const instant = false;

// Pasos del flujo, como píldoras bajo el titular
const PASOS = [
	{ numero: "01", texto: "Pega tu código" },
	{ numero: "02", texto: "Analiza con IA" },
	{ numero: "03", texto: "Guarda y consulta" },
];

const ctaPrimario =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover";

const ctaSecundario =
	"inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-text";

export default async function LandingPage() {
	// Solo necesitamos la sesión para el estado del header
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-16 sm:px-6 sm:py-24">
				<section className="grid w-full max-w-[54rem] gap-5">
					<p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-text">
						Memoria de código
					</p>

					<h1 className="text-[clamp(2.4rem,7vw,4.8rem)] font-bold leading-[0.95] tracking-[-0.055em]">
						Tu código, <span className="text-accent-text">explicado</span>.
					</h1>

					<p className="max-w-[42rem] text-[1.02rem] leading-[1.7] text-muted">
						Pega un fragmento y la IA te devuelve un resumen de una línea.
						Inicia sesión para guardarlo en tu colección y consultarlo cuando
						quieras.
					</p>

					<ol className="mt-2 flex flex-wrap gap-2">
						{PASOS.map((paso) => (
							<li
								key={paso.numero}
								className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-[0.74rem] text-muted"
							>
								<span className="font-mono text-[0.62rem] text-accent-text">
									{paso.numero}
								</span>
								{paso.texto}
							</li>
						))}
					</ol>

					<div className="mt-4 flex flex-wrap items-center gap-3">
						<Link href="/generador" className={ctaPrimario}>
							Abrir el generador
							<ArrowRight size={16} aria-hidden />
						</Link>

						{!usuario && (
							<Link href="/login" className={ctaSecundario}>
								<LogIn size={16} aria-hidden />
								Iniciar sesión
							</Link>
						)}
					</div>
				</section>
			</main>
		</>
	);
}
