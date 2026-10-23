// Supabase
import type { SupabaseClient } from "@supabase/supabase-js";
// Dominio
import { ErrorCaptcha } from "@/core/domain/errors";
import type {
	AuthGateway,
	CredencialesAuth,
	CredencialesRecuperacion,
} from "@/core/domain/ports/auth-gateway";
// Tipos
import type { Database } from "@/lib/database.types";

// Supabase devuelve un error genérico cuando el captcha falla
function traducirError(mensaje: string): Error {
	return /captcha/i.test(mensaje) ? new ErrorCaptcha() : new Error(mensaje);
}

// Adaptador Supabase del puerto AuthGateway
export class SupabaseAuthGateway implements AuthGateway {
	constructor(
		private readonly supabase: SupabaseClient<Database>,
		private readonly origen: string,
	) {}

	async registrar({
		email,
		password,
		captchaToken,
	}: CredencialesAuth): Promise<{ requiereConfirmacion: boolean }> {
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${this.origen}/auth/callback`,
				captchaToken,
			},
		});

		if (error) throw traducirError(error.message);

		return { requiereConfirmacion: !data.session };
	}

	async iniciarSesion({
		email,
		password,
		captchaToken,
	}: CredencialesAuth): Promise<void> {
		const { error } = await this.supabase.auth.signInWithPassword({
			email,
			password,
			options: { captchaToken },
		});

		if (error) throw traducirError(error.message);
	}

	async solicitarRecuperacion({
		email,
		captchaToken,
	}: CredencialesRecuperacion): Promise<void> {
		const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${this.origen}/auth/callback?next=/restablecer`,
			captchaToken,
		});

		if (error) throw traducirError(error.message);
	}

	async actualizarPassword(password: string): Promise<void> {
		const { error } = await this.supabase.auth.updateUser({ password });
		if (error) throw new Error(error.message);
	}

	async cerrarSesion(): Promise<void> {
		const { error } = await this.supabase.auth.signOut();
		if (error) throw new Error(error.message);
	}

	async obtenerUrlGoogle(): Promise<string> {
		const { data, error } = await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${this.origen}/auth/callback?next=/generador`,
			},
		});

		if (error || !data.url) {
			throw new Error(error?.message ?? "No se pudo iniciar el flujo OAuth.");
		}

		return data.url;
	}
}
