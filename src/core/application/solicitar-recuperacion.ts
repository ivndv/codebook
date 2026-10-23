// Tipos
import { ErrorCaptcha, type ErrorDominio } from "@/core/domain/errors";
import type {
	AuthGateway,
	CredencialesRecuperacion,
	ResultadoAuth,
} from "@/core/domain/ports/auth-gateway";
import { err, ok, type Result } from "@/core/domain/result";

// Mensaje neutro: no revela si el correo existe
const MENSAJE =
	"Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.";

// Envía el enlace de recuperación (el captcha lo valida Supabase)
export async function solicitarRecuperacion(
	credenciales: CredencialesRecuperacion,
	gateway: AuthGateway,
): Promise<Result<ResultadoAuth, ErrorDominio>> {
	if (!credenciales.email) {
		return err({ tipo: "autenticacion", mensaje: "Escribe tu correo." });
	}

	if (!credenciales.captchaToken) {
		return err({
			tipo: "autenticacion",
			mensaje: "Completa la verificación para continuar.",
		});
	}

	try {
		await gateway.solicitarRecuperacion(credenciales);
		return ok({ mensaje: MENSAJE });
	} catch (error) {
		if (error instanceof ErrorCaptcha) {
			return err({ tipo: "autenticacion", mensaje: error.message });
		}

		// Ante un fallo interno también respondemos neutro (anti-enumeración)
		console.error("[solicitarRecuperacion]", error);
		return ok({ mensaje: MENSAJE });
	}
}
