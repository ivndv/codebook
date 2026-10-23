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
import { registrar as registrarCaso } from "@/core/application/registrar";

// Crea una cuenta nueva con email, contraseña y captcha
export async function registrar(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const password = String(formData.get("password") ?? "");
	const confirmacion = String(formData.get("confirmPassword") ?? "");

	if (password !== confirmacion) {
		return { error: "Las contraseñas no coinciden.", message: null };
	}

	const entrada = credencialesSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		password,
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return {
			error: "Revisa el correo, la contraseña y la verificación.",
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await registrarCaso(entrada.data, deps.auth);

	if (!resultado.ok) {
		return { error: resultado.error.mensaje, message: null };
	}

	// Con confirmación por email activada todavía no hay sesión
	if (resultado.valor.mensaje) {
		return { error: null, message: resultado.valor.mensaje };
	}

	revalidatePath("/", "layout");
	redirect("/generador");
}
