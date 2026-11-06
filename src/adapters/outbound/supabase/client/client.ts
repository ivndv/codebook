// Supabase
import { createBrowserClient } from "@supabase/ssr";
// Tipos
import type { Database } from "@/lib/database.types";

// Cliente de Supabase para el navegador (Client Components)
export function createClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
	);
}
