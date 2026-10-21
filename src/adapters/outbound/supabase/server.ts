// Next

// Supabase
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// Tipos
import type { Database } from "@/lib/database.types";

// Cliente de Supabase del servidor (Server Components, Server Actions y Route Handlers).
// Se crea uno nuevo por request: necesita las cookies de ESA request
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// Un Server Component no puede escribir cookies:
						// el proxy (src/proxy.ts) refresca la sesión
					}
				},
			},
		},
	);
}
