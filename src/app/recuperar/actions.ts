"use server";

// Infraestructura
import { recuperacionSchema } from "@/adapters/inbound/next/schemas";
// Tipos
import type { AuthState } from "@/app/auth-types";
import { crearContenedor } from "@/composition/container";
// Aplicación
import { solicitarRecuperacion as solicitarRecuperacionCaso } from "@/core/application/solicitar-recuperacion";

// Envía el enlace de recuperación al correo indicado
export async function solicitarRecuperacion(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const entrada = recuperacionSchema.safeParse({
		email: String(formData.get("email") ?? "").trim(),
		captchaToken: String(formData.get("captchaToken") ?? ""),
	});

	if (!entrada.success) {
		return { error: "Revisa el correo y la verificación.", message: null };
	}

	const deps = await crearContenedor();
	const resultado = await solicitarRecuperacionCaso(entrada.data, deps.auth);

	if (!resultado.ok) {
		return { error: resultado.error.mensaje, message: null };
	}

	return { error: null, message: resultado.valor.mensaje };
}
