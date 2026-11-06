// Next
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { CodebookApp } from "@/components/CodebookApp";
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Aplicación
import { listarSnippets } from "@/core/application/listar-snippets";
// Dominio
import type { FiltrosSnippets } from "@/core/domain/snippet";
import {
	normalizarAlcance,
	normalizarFecha,
	normalizarLenguaje,
	normalizarOrden,
	validarBusqueda,
} from "@/core/domain/snippet-campos";
// Locales
import { urlGenerador } from "@/lib/filtros-url";
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";

// Título y descripción según el idioma de la ruta
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const activo = isLocale(locale) ? locale : "es";

	return {
		title: m.meta_generator_title({}, { locale: activo }),
		description: m.meta_generator_description({}, { locale: activo }),
	};
}

// La sesión se resuelve en cada request (getClaims usa Date.now())
export const instant = false;

// Lee un searchParam que puede venir repetido
function texto(valor: string | string[] | undefined): string {
	return Array.isArray(valor) ? (valor[0] ?? "") : (valor ?? "");
}

// Lee ?pagina=N (1-based) con cordura
function numeroPagina(valor: string | string[] | undefined): number {
	const numero = Number.parseInt(texto(valor) || "1", 10);
	return Number.isFinite(numero) && numero > 0 ? numero : 1;
}

export default async function GeneradorPage(
	props: PageProps<"/[locale]/generator">,
) {
	// El prerender se detiene aquí: todo lo de abajo corre en cada request
	await connection();

	const { locale: idioma } = await props.params;
	const locale = isLocale(idioma) ? idioma : "es";

	// 1. Resuelve la sesión, los filtros y la página pedida
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();
	const params = await props.searchParams;
	const pedida = numeroPagina(params.pagina);

	const filtros: FiltrosSnippets = {
		busqueda: validarBusqueda(texto(params.q)),
		lenguaje: normalizarLenguaje(texto(params.lenguaje)),
		orden: normalizarOrden(texto(params.orden)),
		alcance: normalizarAlcance(texto(params.en)),
		fecha: normalizarFecha(texto(params.fecha)),
	};

	// 2. Trae la página de snippets (solo si hay sesión)
	const pagina = usuario
		? await listarSnippets(pedida, filtros, deps.snippets)
		: { snippets: [], pagina: 1, total: 0, totalPaginas: 1 };

	const lenguajes = usuario ? await deps.snippets.lenguajes() : [];

	// 3. Si la página pedida ya no existe (p. ej. borró lo último), vuelve a la válida
	if (usuario && pedida > pagina.totalPaginas) {
		redirect(urlGenerador(locale, filtros, pagina.totalPaginas));
	}

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto flex min-h-svh w-full max-w-5xl flex-1 flex-col px-4 pt-[calc(var(--header-h)+2rem)] pb-10 sm:px-6 sm:pb-14">
				<div className="mb-10 max-w-2xl space-y-2">
					<span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-text">
						{m.nav_generator({}, { locale })}
					</span>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						{m.gen_title({}, { locale })}
					</h1>
					<p className="text-sm leading-relaxed text-muted">
						{m.gen_subtitle({}, { locale })}
					</p>
				</div>

				<CodebookApp
					usuario={usuario}
					snippets={pagina.snippets}
					total={pagina.total}
					pagina={pagina.pagina}
					totalPaginas={pagina.totalPaginas}
					filtros={filtros}
					lenguajes={lenguajes}
				/>
			</main>
		</>
	);
}
