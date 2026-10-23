"use server";

// Next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Infraestructura
import { credencialesSchema } from "@/adapters/inbound/next/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { iniciarSesion as iniciarSesionCaso } from "@/core/application/iniciar-sesion";

// Inicia sesión con email, contraseña y captcha
export async function iniciarSesion(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const entrada = credencialesSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		password: String(formData.get("password") ?? ""),
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return {
			error: "Revisa el correo, la contraseña y la verificación.",
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await iniciarSesionCaso(entrada.data, deps.auth);

	if (!resultado.ok) {
		return { error: resultado.error.mensaje, message: null };
	}

	// Refresca el layout y entra directo al generador
	revalidatePath("/", "layout");
	redirect("/generador");
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
export async function iniciarConGoogle(): Promise<void> {
	const deps = await crearContenedor();
	const url = await deps.auth.obtenerUrlGoogle().catch(() => null);

	if (!url) redirect("/login");

	redirect(url);
}
