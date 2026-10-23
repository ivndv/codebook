// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import type {
	AuthGateway,
	ResultadoAuth,
} from "@/core/domain/ports/auth-gateway";
import { err, ok, type Result } from "@/core/domain/result";

// Guarda la contraseña nueva de una sesión de recuperación
export async function restablecerPassword(
	password: string,
	gateway: AuthGateway,
): Promise<Result<ResultadoAuth, ErrorDominio>> {
	if (!password || password.length < 6) {
		return err({
			tipo: "autenticacion",
			mensaje: "La contraseña debe tener al menos 6 caracteres.",
		});
	}

	try {
		await gateway.actualizarPassword(password);
		return ok({ mensaje: null });
	} catch (error) {
		console.error("[restablecerPassword]", error);
		return err({
			tipo: "autenticacion",
			mensaje: "No se pudo actualizar la contraseña. Solicita un enlace nuevo.",
		});
	}
}
