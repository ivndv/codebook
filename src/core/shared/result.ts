// Resultado explícito para errores esperados (sin lanzar excepciones)
export type Result<T, E> =
	| { readonly ok: true; readonly valor: T }
	| { readonly ok: false; readonly error: E };

// Caso exitoso
export function ok<T>(valor: T): Result<T, never> {
	return { ok: true, valor };
}

// Caso fallido
export function err<E>(error: E): Result<never, E> {
	return { ok: false, error };
}
