// Infraestructura
import { obtenerOrigen } from "@/adapters/inbound/next/origen";
import { CodebookApiClient } from "@/adapters/outbound/http/codebook-api-client";
import { SupabaseAuthGateway } from "@/adapters/outbound/supabase/auth-gateway";
import { createClient } from "@/adapters/outbound/supabase/server";
import { SupabaseSessionReader } from "@/adapters/outbound/supabase/session-reader";
import { SupabaseSnippetRepository } from "@/adapters/outbound/supabase/snippet-repository";

// Composition root: crea los adaptadores de UNA request
export async function crearContenedor() {
	const supabase = await createClient();
	const origen = await obtenerOrigen();

	return {
		auth: new SupabaseAuthGateway(supabase, origen),
		sesion: new SupabaseSessionReader(supabase),
		snippets: new SupabaseSnippetRepository(supabase),
		resumen: new CodebookApiClient(),
	};
}
