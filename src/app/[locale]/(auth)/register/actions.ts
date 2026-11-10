"use server";

// Next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Infraestructura
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
import { credencialesSchema } from "@/adapters/inbound/next/schemas/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { registrar as registrarCaso } from "@/core/auth/application/registrar";
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

// Crea una cuenta nueva con email, contraseña y captcha
export async function registrar(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const locale = idioma(formData);
	const password = String(formData.get("password") ?? "");
	const confirmacion = String(formData.get("confirmPassword") ?? "");

	if (password !== confirmacion) {
		return {
			error: m.auth_error_password_mismatch({}, { locale }),
			message: null,
		};
	}

	const entrada = credencialesSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		password,
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return {
			error: m.auth_error_missing_fields({}, { locale }),
			message: null,
		};
	}

	const deps = await crearContenedor();
	const origen = await obtenerOrigen();
	const redirectTo = `${origen}/auth/confirm?next=${encodeURIComponent(ruta(locale, "/generator"))}`;
	const resultado = await registrarCaso(entrada.data, redirectTo, deps.auth);

	if (!resultado.ok) {
		return {
			error: m.auth_error_invalid_register({}, { locale }),
			message: null,
		};
	}

	// Con confirmación por email activada todavía no hay sesión
	if (resultado.valor.mensaje) {
		return {
			error: null,
			message: m.auth_register_confirmation({}, { locale }),
		};
	}

	revalidatePath("/", "layout");
	redirect(ruta(locale, "/generator"));
}
