// Supabase
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthGateway } from "@/core/domain/ports/auth-gateway";
// Tipos
import type { Database } from "@/lib/database.types";

// Adaptador Supabase del puerto AuthGateway
export class SupabaseAuthGateway implements AuthGateway {
	constructor(
		private readonly supabase: SupabaseClient<Database>,
		private readonly origen: string,
	) {}

	async registrar(
		email: string,
		password: string,
	): Promise<{ requiereConfirmacion: boolean }> {
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${this.origen}/auth/callback` },
		});

		if (error) throw new Error(error.message);

		return { requiereConfirmacion: !data.session };
	}

	async iniciarSesion(email: string, password: string): Promise<void> {
		const { error } = await this.supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw new Error(error.message);
	}

	async cerrarSesion(): Promise<void> {
		const { error } = await this.supabase.auth.signOut();
		if (error) throw new Error(error.message);
	}

	async obtenerUrlGoogle(): Promise<string> {
		const { data, error } = await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${this.origen}/auth/callback` },
		});

		if (error || !data.url) {
			throw new Error(error?.message ?? "No se pudo iniciar el flujo OAuth.");
		}

		return data.url;
	}
}
