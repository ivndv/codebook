// Next

import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { RegistroForm } from "./RegistroForm";

export const metadata: Metadata = {
	title: "Crear cuenta · codebook",
};

// La sesión se resuelve en cada request
export const instant = false;

export default async function RegistroPage() {
	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	// Si ya hay sesión, no tiene sentido el registro
	if (usuario) redirect("/generador");

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-14 sm:px-6 sm:py-20">
				<div className="mx-auto w-full max-w-sm">
					<div className="space-y-3 text-center">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-white">
							<UserPlus size={22} aria-hidden />
						</span>

						<h1 className="text-3xl font-bold tracking-tight">
							Crea tu cuenta
						</h1>
						<p className="text-sm text-muted">
							¿Ya tienes cuenta?{" "}
							<Link href="/login" className="text-accent-text hover:underline">
								Entra
							</Link>
							.
						</p>
					</div>

					<div className="mt-8">
						<RegistroForm />
					</div>

					<p className="mt-8 text-center text-xs text-muted">
						Al continuar aceptas el uso personal de codebook.
					</p>
				</div>
			</main>
		</>
	);
}
