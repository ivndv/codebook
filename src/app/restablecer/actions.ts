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

// Guarda la contraseña nueva de la sesión de recuperación
export async function restablecerPassword(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const password = String(formData.get("password") ?? "");
	const confirmacion = String(formData.get("confirmPassword") ?? "");

	if (password !== confirmacion) {
		return { error: "Las contraseñas no coinciden.", message: null };
	}

	const entrada = nuevaPasswordSchema.safeParse({ password });

	if (!entrada.success) {
		return {
			error: "La contraseña debe tener al menos 6 caracteres.",
			message: null,
		};
	}

	const deps = await crearContenedor();
	const resultado = await restablecerPasswordCaso(
		entrada.data.password,
		deps.auth,
	);

	if (!resultado.ok) {
		return { error: resultado.error.mensaje, message: null };
	}

	revalidatePath("/", "layout");
	redirect("/generador");
}
