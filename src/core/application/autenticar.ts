// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import type {
	AuthGateway,
	IntencionAuth,
	ResultadoAuth,
} from "@/core/domain/ports/auth-gateway";
import { err, ok, type Result } from "@/core/domain/result";

// Valida credenciales y delega en el gateway de autenticación
export async function autenticar(
	email: string,
	password: string,
	intencion: IntencionAuth,
	gateway: AuthGateway,
): Promise<Result<ResultadoAuth, ErrorDominio>> {
	if (!email || !password) {
		return err({
			tipo: "autenticacion",
			mensaje: "Correo y contraseña son obligatorios.",
		});
	}

	try {
		if (intencion === "signup") {
			const { requiereConfirmacion } = await gateway.registrar(email, password);

			return ok({
				mensaje: requiereConfirmacion
					? "Te enviamos un correo para confirmar la cuenta. Revisa tu bandeja de entrada."
					: null,
			});
		}

		await gateway.iniciarSesion(email, password);
		return ok({ mensaje: null });
	} catch (error) {
		console.error("[autenticar]", error);

		return err({
			tipo: "autenticacion",
			mensaje:
				intencion === "signup"
					? "No se pudo crear la cuenta."
					: "Correo o contraseña incorrectos.",
		});
	}
}
