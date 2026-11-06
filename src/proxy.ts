// Next
import { type NextRequest, NextResponse } from "next/server";
// Sesión
import { actualizarSesion } from "@/adapters/outbound/supabase/proxy";
// Paraglide
import { baseLocale, isLocale, type Locale } from "@/paraglide/runtime";

// Cookie donde Paraglide recuerda el idioma elegido
const COOKIE_LOCALE = "PARAGLIDE_LOCALE";

// Primer idioma soportado según Accept-Language
function idiomaDelNavegador(request: NextRequest): Locale | null {
	const cabecera = request.headers.get("accept-language") ?? "";

	for (const parte of cabecera.split(",")) {
		const codigo = (parte.trim().split(";")[0] ?? "").split("-")[0] ?? "";
		if (isLocale(codigo)) return codigo;
	}

	return null;
}

// Prioridad: cookie > navegador > idioma base
function localePreferido(request: NextRequest): Locale {
	const cookie = request.cookies.get(COOKIE_LOCALE)?.value;

	if (cookie && isLocale(cookie)) return cookie;

	return (
		idiomaDelNavegador(request) ?? (isLocale(baseLocale) ? baseLocale : "es")
	);
}

// Rutas que no llevan prefijo de idioma
function sinLocale(pathname: string): boolean {
	return pathname.startsWith("/auth");
}

// Proxy de Next 16: resuelve el idioma y mantiene viva la sesión de Supabase
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// El callback de auth de Supabase no lleva idioma
	if (sinLocale(pathname)) return actualizarSesion(request);

	const segmento = pathname.split("/")[1] ?? "";

	// La URL ya trae el idioma: solo se refresca la sesión
	if (isLocale(segmento)) {
		return actualizarSesion(request, (req) => {
			const headers = new Headers(req.headers);
			headers.set("x-codebook-locale", segmento);

			return NextResponse.next({ request: { headers } });
		});
	}

	// Sin idioma: se redirige a la misma ruta con el idioma preferido
	const url = request.nextUrl.clone();
	url.pathname = `/${localePreferido(request)}${pathname === "/" ? "" : pathname}`;

	return actualizarSesion(request, () => NextResponse.redirect(url));
}

export const config = {
	// Corre en todo excepto estáticos e imágenes
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
