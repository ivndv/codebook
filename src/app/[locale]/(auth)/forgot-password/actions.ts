"use server";

// Infraestructura
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
import { recuperacionSchema } from "@/adapters/inbound/next/schemas/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { solicitarRecuperacion as solicitarRecuperacionCaso } from "@/core/auth/application/solicitar-recuperacion";
// Locales
import { ruta } from "@/i18n/rutas";
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
	const origen = await obtenerOrigen();
	const redirectTo = `${origen}/auth/confirm?next=${encodeURIComponent(ruta(locale, "/reset-password"))}`;
	const resultado = await solicitarRecuperacionCaso(
		entrada.data,
		redirectTo,
		deps.auth,
	);

	if (!resultado.ok) {
		return { error: m.auth_error_invalid_reset({}, { locale }), message: null };
	}

	return {
		error: null,
		message: m.auth_forgot_sent({}, { locale }),
	};
}
