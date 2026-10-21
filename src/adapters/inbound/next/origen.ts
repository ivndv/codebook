// Next
import { headers } from "next/headers";

// Origen absoluto de la app (lo necesitan los redirects de auth)
export async function obtenerOrigen(): Promise<string> {
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const proto = h.get("x-forwarded-proto") ?? "http";

	return `${proto}://${host}`;
}
