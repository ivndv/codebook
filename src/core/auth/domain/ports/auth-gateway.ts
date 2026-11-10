// Credenciales de auth: el token de Turnstile lo verifica Supabase
export interface CredencialesAuth {
	email: string;
	password: string;
	captchaToken: string;
}

// Credenciales para solicitar un enlace de recuperación
export interface CredencialesRecuperacion {
	email: string;
	captchaToken: string;
}

// Resultado de autenticar (mensaje para confirmación de correo)
export interface ResultadoAuth {
	mensaje: string | null;
}

// Puerto de autenticación: el caso de uso no conoce Supabase
export interface AuthGateway {
	registrar(
		credenciales: CredencialesAuth,
		redirectTo: string,
	): Promise<{ requiereConfirmacion: boolean }>;
	iniciarSesion(credenciales: CredencialesAuth): Promise<void>;
	solicitarRecuperacion(
		credenciales: CredencialesRecuperacion,
		redirectTo: string,
	): Promise<void>;
	actualizarPassword(password: string): Promise<void>;
	cerrarSesion(): Promise<void>;
	obtenerUrlGoogle(redirectTo: string): Promise<string>;
}
