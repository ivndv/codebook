// Next

import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { RestablecerForm } from "./RestablecerForm";

export const metadata: Metadata = {
	title: "Nueva contraseña · codebook",
};

// La sesión se resuelve en cada request
export const instant = false;

export default async function RestablecerPage() {
	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	// Solo se llega con la sesión que crea el enlace del correo
	if (!usuario) redirect("/recuperar");

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-14 sm:px-6 sm:py-20">
				<div className="mx-auto w-full max-w-sm">
					<div className="space-y-3 text-center">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-white">
							<LockKeyhole size={22} aria-hidden />
						</span>

						<h1 className="text-3xl font-bold tracking-tight">
							Nueva contraseña
						</h1>
						<p className="text-sm text-muted">
							Elige una contraseña nueva para tu cuenta.
						</p>
					</div>

					<div className="mt-8">
						<RestablecerForm />
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
