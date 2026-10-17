// Next
import type { NextRequest } from "next/server";
// Sesión
import { actualizarSesion } from "@/lib/supabase/proxy";

// Proxy de Next 16 (antes "middleware"): mantiene viva la sesión de Supabase
export async function proxy(request: NextRequest) {
	return actualizarSesion(request);
}

export const config = {
	// Corre en todo excepto estáticos e imágenes
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
