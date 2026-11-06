"use server";

// Infraestructura
import { recuperacionSchema } from "@/adapters/inbound/next/schemas/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { solicitarRecuperacion as solicitarRecuperacionCaso } from "@/core/auth/application/solicitar-recuperacion";
// Paraglide
import * as m from "@/paraglide/messages";
import { isLocale, type Locale } from "@/paraglide/runtime";

// Idioma del formulario con el base como respaldo
function idioma(formData: FormData): Locale {
	const valor = String(formData.get("locale") ?? "");

	return isLocale(valor) ? valor : "es";
}

// Envía el enlace de recuperación al correo indicado
export async function solicitarRecuperacion(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const locale = idioma(formData);
	const entrada = recuperacionSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return {
			error: m.auth_error_invalid_reset({}, { locale }),
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await solicitarRecuperacionCaso(entrada.data, deps.auth);

	if (!resultado.ok) {
		return { error: m.auth_error_invalid_reset({}, { locale }), message: null };
	}

	return {
		error: null,
		message: m.auth_forgot_sent({}, { locale }),
	};
}
