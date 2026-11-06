// Prefija una ruta interna con el idioma activo
export function ruta(locale: string, path: string): string {
	if (path === "/") return `/${locale}`;
	return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
