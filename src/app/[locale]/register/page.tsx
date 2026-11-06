// Next

import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { Header } from "@/components/layout/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { ruta } from "@/i18n/rutas";
import { localeActual } from "@/i18n/servidor";
// Paraglide
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";
import { RegistroForm } from "./RegistroForm";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const idioma = isLocale(locale) ? locale : "es";

	return { title: m.meta_register_title({}, { locale: idioma }) };
}

// La sesión se resuelve en cada request
export const instant = false;

export default async function RegistroPage() {
	const locale = await localeActual();

	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	// Si ya hay sesión, no tiene sentido el registro
	if (usuario) redirect(ruta(locale, "/generator"));

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex min-h-svh w-full max-w-5xl flex-1 items-center px-4 pt-[var(--header-h)] pb-14 sm:px-6 sm:pb-20">
				<div className="mx-auto w-full max-w-sm">
					<div className="space-y-3 text-center">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-white">
							<UserPlus size={22} aria-hidden />
						</span>

						<h1 className="text-3xl font-bold tracking-tight">
							{m.auth_register_title({}, { locale })}
						</h1>
						<p className="text-sm text-muted">
							{m.auth_register_have_account({}, { locale })}{" "}
							<Link
								href={ruta(locale, "/login")}
								className="text-accent-text hover:underline"
							>
								{m.auth_register_login_link({}, { locale })}
							</Link>
							.
						</p>
					</div>

					<div className="mt-8">
						<RegistroForm />
					</div>

					<p className="mt-8 text-center text-xs text-muted">
						{m.auth_terms({}, { locale })}
					</p>
				</div>
			</main>
		</>
	);
}
