// Estado que devuelven las Server Actions de auth al formulario
export interface AuthState {
	error: string | null;
	message: string | null;
}

// Estado inicial del formulario de auth
export const ESTADO_INICIAL: AuthState = { error: null, message: null };
