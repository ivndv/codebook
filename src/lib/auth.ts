// Supabase
import { createClient } from "@/lib/supabase/server";
// Tipos
import type { Usuario } from "@/lib/usuario";

// Usuario de la sesión actual (verificado con getClaims) o null si es invitado
export async function obtenerUsuario(): Promise<Usuario | null> {
	const supabase = await createClient();
	const { data } = await supabase.auth.getClaims();
	const claims = data?.claims;
	if (!claims) return null;

	return {
		id: String(claims.sub),
		email: (claims as { email?: string }).email ?? "",
	};
}
