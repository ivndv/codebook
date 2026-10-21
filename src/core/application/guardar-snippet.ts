// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import type { SessionReader } from "@/core/domain/ports/session-reader";
import type { SnippetRepository } from "@/core/domain/ports/snippet-repository";
import { err, ok, type Result } from "@/core/domain/result";
import type { Snippet } from "@/core/domain/snippet";
import type { Usuario } from "@/core/domain/usuario";
import { validarCodigo } from "@/core/domain/validar-codigo";

// Límite defensivo para una explicación de una línea
const MAX_EXPLANATION_LENGTH = 2_000;

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

	const explanation = datos.explanation.trim();

	if (!explanation) {
		return err({
			tipo: "validacion",
			mensaje: "La explicación está vacía.",
		});
	}

	if (explanation.length > MAX_EXPLANATION_LENGTH) {
		return err({
			tipo: "validacion",
			mensaje: "La explicación es demasiado larga.",
		});
	}

	const language = datos.language?.trim() || null;

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
			explanation,
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
