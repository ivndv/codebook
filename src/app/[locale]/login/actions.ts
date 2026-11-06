"use server";

// Next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Infraestructura
import { credencialesSchema } from "@/adapters/inbound/next/schemas/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { iniciarSesion as iniciarSesionCaso } from "@/core/auth/application/iniciar-sesion";
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

// Inicia sesión con email, contraseña y captcha
export async function iniciarSesion(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const locale = idioma(formData);
	const entrada = credencialesSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		password: String(formData.get("password") ?? ""),
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return {
			error: m.auth_error_missing_fields({}, { locale }),
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await iniciarSesionCaso(entrada.data, deps.auth);

	if (!resultado.ok) {
		return { error: m.auth_error_credentials({}, { locale }), message: null };
	}

	// Refresca el layout y entra directo al generador
	revalidatePath("/", "layout");
	redirect(ruta(locale, "/generator"));
}

// Cierra la sesión actual
export async function cerrarSesion(): Promise<void> {
	const deps = await crearContenedor();

	try {
		await deps.auth.cerrarSesion();
	} catch (error) {
		// La sesión local se limpia igual; solo registramos el fallo remoto
		console.error("[cerrarSesion]", error);
	}

	revalidatePath("/", "layout");
	redirect("/");
}

// Arranca el flujo OAuth con Google
export async function iniciarConGoogle(formData: FormData): Promise<void> {
	const locale = idioma(formData);
	const deps = await crearContenedor();
	const url = await deps.auth.obtenerUrlGoogle().catch(() => null);

	if (!url) redirect(ruta(locale, "/login"));

	redirect(url);
}
