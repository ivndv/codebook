// Login o creación de cuenta
export type IntencionAuth = "login" | "signup";

// Resultado de autenticar (mensaje para confirmación de correo)
export interface ResultadoAuth {
	mensaje: string | null;
}

// Puerto de autenticación: el caso de uso no conoce Supabase
export interface AuthGateway {
	registrar(
		email: string,
		password: string,
	): Promise<{ requiereConfirmacion: boolean }>;
	iniciarSesion(email: string, password: string): Promise<void>;
	cerrarSesion(): Promise<void>;
	obtenerUrlGoogle(): Promise<string>;
}
