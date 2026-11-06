// Supabase
import { createClient } from "@supabase/supabase-js";
// Tipos
import type { Database } from "@/lib/database.types";

// Cliente anónimo sin cookies: solo para lecturas públicas (RPC por token)
export function createPublicClient() {
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
		{ auth: { persistSession: false, autoRefreshToken: false } },
	);
}
