// Next
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = {
	title: "Entrar · codebook",
};

// La sesión se resuelve en cada request
export const instant = false;

export default async function LoginPage() {
	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	// Si ya hay sesión, el formulario de entrada no tiene sentido
	if (usuario) redirect("/");

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
				<div className="mx-auto max-w-sm space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-2xl font-bold tracking-tight">
							Entra a codebook
						</h1>
						<p className="text-sm text-muted">
							Guarda tus snippets y encuéntralos cuando los necesites.
						</p>
					</div>

					<AuthForm />
				</div>
			</main>
		</>
	);
}
