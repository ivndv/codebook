// Infraestructura
import { CodebookApiClient } from "@/adapters/outbound/http/codebook-api/client";
import { SupabaseAuthGateway } from "@/adapters/outbound/supabase/auth/auth-gateway";
import { SupabaseSessionReader } from "@/adapters/outbound/supabase/auth/session-reader";
import { createClient } from "@/adapters/outbound/supabase/client/server";
import { SupabaseSnippetRepository } from "@/adapters/outbound/supabase/repositories/snippet-repository";

// Composition root: crea los adaptadores de UNA request
export async function crearContenedor() {
	const supabase = await createClient();

	return {
		auth: new SupabaseAuthGateway(supabase),
		sesion: new SupabaseSessionReader(supabase),
		snippets: new SupabaseSnippetRepository(supabase),
		resumen: new CodebookApiClient(),
	};
}
