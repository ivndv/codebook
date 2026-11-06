// Tipos

import type {
	AuthGateway,
	CredencialesAuth,
	ResultadoAuth,
} from "@/core/auth/domain/ports/auth-gateway";
import { ErrorCaptcha, type ErrorDominio } from "@/core/shared/errors";
import { err, ok, type Result } from "@/core/shared/result";

// Crea una cuenta nueva (el captcha lo valida Supabase)
export async function registrar(
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
		const { requiereConfirmacion } = await gateway.registrar(credenciales);

		return ok({
			mensaje: requiereConfirmacion
				? "Te enviamos un correo para confirmar la cuenta. Revisa tu bandeja de entrada."
				: null,
		});
	} catch (error) {
		if (error instanceof ErrorCaptcha) {
			return err({ tipo: "autenticacion", mensaje: error.message });
		}

		console.error("[registrar]", error);
		return err({
			tipo: "autenticacion",
			mensaje: "No se pudo crear la cuenta.",
		});
	}
}
