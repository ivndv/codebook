// Tipos
import { ErrorCaptcha, type ErrorDominio } from "@/core/domain/errors";
import type {
	AuthGateway,
	CredencialesAuth,
	ResultadoAuth,
} from "@/core/domain/ports/auth-gateway";
import { err, ok, type Result } from "@/core/domain/result";

// Inicia sesión con email y contraseña (el captcha lo valida Supabase)
export async function iniciarSesion(
	credenciales: CredencialesAuth,
	gateway: AuthGateway,
): Promise<Result<ResultadoAuth, ErrorDominio>> {
	if (!credenciales.email || !credenciales.password) {
		return err({
			tipo: "autenticacion",
			mensaje: "Correo y contraseña son obligatorios.",
		});
	}

	if (!credenciales.captchaToken) {
		return err({
			tipo: "autenticacion",
			mensaje: "Completa la verificación para continuar.",
		});
	}

	try {
		await gateway.iniciarSesion(credenciales);
		return ok({ mensaje: null });
	} catch (error) {
		if (error instanceof ErrorCaptcha) {
			return err({ tipo: "autenticacion", mensaje: error.message });
		}

		console.error("[iniciarSesion]", error);
		return err({
			tipo: "autenticacion",
			mensaje: "Correo o contraseña incorrectos.",
		});
	}
}
