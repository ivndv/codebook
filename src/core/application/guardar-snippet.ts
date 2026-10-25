// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import type { SessionReader } from "@/core/domain/ports/session-reader";
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import { err, ok, type Result } from "@/core/domain/result";
import type { Snippet } from "@/core/domain/snippet";
import {
	normalizarLenguaje,
	validarExplicacion,
} from "@/core/domain/snippet-campos";
import type { Usuario } from "@/core/domain/usuario";
import { validarCodigo } from "@/core/domain/validar-codigo";

// Datos que la UI congela después de analizar
export interface DatosGuardado {
	code: string;
	explanation: string;
	language: string | null;
}

// Dependencias del guardado
export interface DepsGuardado {
	sesion: SessionReader;
	snippets: SnippetRepository;
}

// Guarda un snippet ya analizado. Exige sesión y deja que RLS valide el dueño
export async function guardarSnippet(
	datos: DatosGuardado,
	deps: DepsGuardado,
): Promise<Result<Snippet, ErrorDominio>> {
	const codigo = validarCodigo(datos.code);

	if (!codigo.ok) return err(codigo.error);

	const explanation = validarExplicacion(datos.explanation);

	if (!explanation.ok) return err(explanation.error);

	const language = normalizarLenguaje(datos.language);

	// 1. Exige una sesión válida antes de escribir
	let usuario: Usuario | null;

	try {
		usuario = await deps.sesion.obtenerUsuario();
	} catch (error) {
		console.error("[guardarSnippet] sesión", error);
		return err({
			tipo: "sesion",
			mensaje: "No se pudo verificar tu sesión. Vuelve a iniciar sesión.",
		});
	}

	if (!usuario) {
		return err({
			tipo: "autenticacion",
			mensaje: "Inicia sesión para guardar el snippet.",
		});
	}

	// 2. Guarda con el código exacto que se analizó
	try {
		const snippet = await deps.snippets.crear({
			code: codigo.valor,
			explanation: explanation.valor,
			language,
		});

		return ok(snippet);
	} catch (error) {
		console.error("[guardarSnippet] guardar", error);
		return err({
			tipo: "persistencia",
			mensaje: "No se pudo guardar el snippet. Inténtalo de nuevo.",
		});
	}
}
