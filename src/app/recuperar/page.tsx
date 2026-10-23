// Next

import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { RecuperarForm } from "./RecuperarForm";

export const metadata: Metadata = {
	title: "Recuperar acceso · codebook",
};

// La sesión se resuelve en cada request
export const instant = false;

export default async function RecuperarPage() {
	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-14 sm:px-6 sm:py-20">
				<div className="mx-auto w-full max-w-sm">
					<div className="space-y-3 text-center">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-white">
							<KeyRound size={22} aria-hidden />
						</span>

						<h1 className="text-3xl font-bold tracking-tight">
							Recupera tu acceso
						</h1>
						<p className="text-sm text-muted">
							Te enviaremos un enlace para restablecer tu contraseña.
						</p>
					</div>

					<div className="mt-8">
						<RecuperarForm />
					</div>

					<p className="mt-8 text-center text-xs text-muted">
						<Link href="/login" className="text-accent-text hover:underline">
							Volver a entrar
						</Link>
					</p>
				</div>
			</main>
		</>
	);
}
