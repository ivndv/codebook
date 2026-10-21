// Next
import { redirect } from "next/navigation";
import { connection } from "next/server";
// Componentes
import { CodebookApp } from "@/components/CodebookApp";
import { Header } from "@/components/Header";
// Infraestructura
import { crearContenedor } from "@/composition/container";
// Aplicación
import { listarSnippets } from "@/core/application/listar-snippets";

// La sesión se resuelve en cada request (getClaims usa Date.now())
export const instant = false;

// Lee ?pagina=N (1-based) con cordura
function numeroPagina(valor: string | string[] | undefined): number {
	const texto = Array.isArray(valor) ? valor[0] : valor;
	const numero = Number.parseInt(texto ?? "1", 10);
	return Number.isFinite(numero) && numero > 0 ? numero : 1;
}

export default async function Home(props: PageProps<"/">) {
	// El prerender se detiene aquí: todo lo de abajo corre en cada request
	await connection();

	// 1. Resuelve la sesión y la página pedida
	const deps = await crearContenedor();
	const usuario = await deps.sesion.obtenerUsuario();
	const params = await props.searchParams;
	const pedida = numeroPagina(params.pagina);

	// 2. Trae la página de snippets (solo si hay sesión)
	const pagina = usuario
		? await listarSnippets(pedida, deps.snippets)
		: { snippets: [], pagina: 1, total: 0, totalPaginas: 1 };

	// 3. Si la página pedida ya no existe (p. ej. borró lo último), vuelve a la válida
	if (usuario && pedida > pagina.totalPaginas) {
		redirect(`/?pagina=${pagina.totalPaginas}`);
	}

	return (
		<>
			<Header usuario={usuario} />

			<main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
				<div className="mb-10 space-y-3 sm:mb-12">
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Guarda tu código, con su explicación
					</h1>
					<p className="max-w-xl text-sm leading-relaxed text-muted">
						Pega un fragmento y la IA te devuelve un resumen de una línea.
						Inicia sesión para guardarlo en tu colección.
					</p>
				</div>

				<CodebookApp
					usuario={usuario}
					snippets={pagina.snippets}
					total={pagina.total}
					pagina={pagina.pagina}
					totalPaginas={pagina.totalPaginas}
				/>
			</main>
		</>
	);
}
