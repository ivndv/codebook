"use server";

// Next
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Supabase
import { createClient } from "@/lib/supabase/server";
// Tipos
import type { AuthState } from "./types";

// Origen absoluto de la app (lo necesitan los redirects de auth)
async function obtenerOrigen(): Promise<string> {
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const proto = h.get("x-forwarded-proto") ?? "http";
	return `${proto}://${host}`;
}

// Entra o crea cuenta según el campo intent del formulario (login | signup)
export async function autenticar(
	_previo: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const supabase = await createClient();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const intent = formData.get("intent");

	if (!email || !password) {
		return { error: "Correo y contraseña son obligatorios.", message: null };
	}

	// 1. Crear cuenta (puede requerir confirmar el correo)
	if (intent === "signup") {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${await obtenerOrigen()}/auth/callback` },
		});

		if (error) return { error: error.message, message: null };

		// Con confirmación por email activada todavía no hay sesión
		if (!data.session) {
			return {
				error: null,
				message:
					"Te enviamos un correo para confirmar la cuenta. Revísalo en Mailpit (localhost:54324).",
			};
		}
	} else {
		// 2. Entrar con correo y contraseña
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			return { error: "Correo o contraseña incorrectos.", message: null };
		}
	}

	// 3. Refresca el layout y vuelve al inicio ya logueado
	revalidatePath("/", "layout");
	redirect("/");
}

// Cierra la sesión actual
export async function cerrarSesion(): Promise<void> {
	const supabase = await createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	redirect("/");
}

// Arranca el flujo OAuth con Google
export async function iniciarConGoogle(): Promise<void> {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: { redirectTo: `${await obtenerOrigen()}/auth/callback` },
	});

	if (error || !data.url) redirect("/login");

	redirect(data.url);
}
