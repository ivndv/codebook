// Usuario mínimo que necesita la UI (derivado de los claims de Supabase Auth)
export interface Usuario {
	id: string;
	email: string;
}
