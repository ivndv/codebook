// Supabase
import { createServerClient } from "@supabase/ssr";
// Next
import { type NextRequest, NextResponse } from "next/server";
// Tipos
import type { Database } from "@/lib/database.types";

// Refresca la sesión de Supabase en cada request y propaga las cookies nuevas.
// Lo invoca src/proxy.ts (el antiguo middleware de Next)
export async function actualizarSesion(request: NextRequest) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet, headers) {
					// 1. Pasa las cookies nuevas al render de ESTE request
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					response = NextResponse.next({ request });

					// 2. Y al navegador
					for (const { name, value, options } of cookiesToSet) {
						response.cookies.set(name, value, options);
					}

					// 3. Headers anti-caché: evitan que un CDN sirva la sesión de otro usuario
					for (const [key, value] of Object.entries(headers ?? {})) {
						response.headers.set(key, value);
					}
				},
			},
		},
	);

	// getClaims() valida el token y refresca la sesión si ya expiró
	await supabase.auth.getClaims();

	return response;
}
