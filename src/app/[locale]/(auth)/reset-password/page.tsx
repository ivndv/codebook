// Next

import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Locales
import { ruta } from "@/i18n/rutas";
// Paraglide
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";
import { RestablecerForm } from "./RestablecerForm";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const idioma = isLocale(locale) ? locale : "es";

	return { title: m.meta_reset_title({}, { locale: idioma }) };
}

// La sesión se resuelve en cada request
export const instant = false;

export default async function RestablecerPage({
	params,
}: PageProps<"/[locale]/reset-password">) {
	const { locale: idioma } = await params;
	const locale = isLocale(idioma) ? idioma : "es";

	// El prerender se detiene aquí
	await connection();
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();

	// Solo se llega con la sesión que crea el enlace del correo
	if (!usuario) redirect(ruta(locale, "/forgot-password"));

	return (
		<>
			<main className="mx-auto flex min-h-svh w-full max-w-5xl flex-1 items-center px-4 pt-[var(--header-h)] pb-14 sm:px-6 sm:pb-20">
				<div className="mx-auto w-full max-w-sm">
					<div className="space-y-3 text-center">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-white">
							<LockKeyhole size={22} aria-hidden />
						</span>

						<h1 className="text-3xl font-bold tracking-tight">
							{m.auth_new_password({}, { locale })}
						</h1>
						<p className="text-sm text-muted">
							{m.auth_reset_subtitle({}, { locale })}
						</p>
					</div>

					<div className="mt-8">
						<RestablecerForm />
					</div>

					<p className="mt-8 text-center text-xs text-muted">
						<Link
							href={ruta(locale, "/login")}
							className="text-accent-text hover:underline"
						>
							{m.auth_back_to_login({}, { locale })}
						</Link>
					</p>
				</div>
			</main>
		</>
	);
}
