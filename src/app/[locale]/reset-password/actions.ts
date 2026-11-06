"use server";

// Next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Infraestructura
import { nuevaPasswordSchema } from "@/adapters/inbound/next/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { restablecerPassword as restablecerPasswordCaso } from "@/core/application/restablecer-password";
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

// Guarda la contraseña nueva de la sesión de recuperación
export async function restablecerPassword(
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

	const entrada = nuevaPasswordSchema.safeParse({ password });

	if (!entrada.success) {
		return {
			error: m.auth_error_password_length({}, { locale }),
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await restablecerPasswordCaso(
		entrada.data.password,
		deps.auth,
	);

	if (!resultado.ok) {
		return {
			error: m.auth_error_update_password({}, { locale }),
			message: null,
		};
	}

	revalidatePath("/", "layout");
	redirect(ruta(locale, "/generator"));
}
