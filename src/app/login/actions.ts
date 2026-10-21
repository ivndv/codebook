"use server";

// Next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Infraestructura
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
import { SupabaseAuthGateway } from "@/adapters/outbound/supabase/auth-gateway";
import { createClient } from "@/adapters/outbound/supabase/server";
// Aplicación
import { autenticar as autenticarCaso } from "@/core/application/autenticar";
// Tipos
import type { AuthState } from "./types";

// Crea el gateway de auth de esta request
async function crearGateway(): Promise<SupabaseAuthGateway> {
	const supabase = await createClient();
	const origen = await obtenerOrigen();

	return new SupabaseAuthGateway(supabase, origen);
}

// Entra o crea cuenta según el campo intent del formulario (login | signup)
export async function autenticar(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const intencion = formData.get("intent") === "signup" ? "signup" : "login";
	const gateway = await crearGateway();
	const resultado = await autenticarCaso(email, password, intencion, gateway);

	if (!resultado.ok) {
		return { error: resultado.error.mensaje, message: null };
	}

	// Con confirmación por email activada todavía no hay sesión
	if (resultado.valor.mensaje) {
		return { error: null, message: resultado.valor.mensaje };
	}

	// Refresca el layout y vuelve al inicio ya logueado
	revalidatePath("/", "layout");
	redirect("/");
}

// Cierra la sesión actual
export async function cerrarSesion(): Promise<void> {
	const gateway = await crearGateway();

	try {
		await gateway.cerrarSesion();
	} catch (error) {
		// La sesión local se limpia igual; solo registramos el fallo remoto
		console.error("[cerrarSesion]", error);
	}

	revalidatePath("/", "layout");
	redirect("/");
}

// Arranca el flujo OAuth con Google
export async function iniciarConGoogle(): Promise<void> {
	const gateway = await crearGateway();
	const url = await gateway.obtenerUrlGoogle().catch(() => null);

	if (!url) redirect("/login");

	redirect(url);
}
