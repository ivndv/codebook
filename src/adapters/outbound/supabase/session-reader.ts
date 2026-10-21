// Supabase
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SessionReader } from "@/core/domain/ports/session-reader";
import type { Usuario } from "@/core/domain/usuario";
// Tipos
import type { Database } from "@/lib/database.types";

// Adaptador de sesión: convierte los claims de Supabase en Usuario
export class SupabaseSessionReader implements SessionReader {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async obtenerUsuario(): Promise<Usuario | null> {
		const { data, error } = await this.supabase.auth.getClaims();

		// Sin sesión es null; un fallo al validarla no puede parecer "invitado"
		if (error) throw new Error(error.message);

		const claims = data?.claims;

		if (!claims) return null;

		return {
			id: String(claims.sub),
			email: (claims as { email?: string }).email ?? "",
		};
	}
}
