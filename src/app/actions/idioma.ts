// Paraglide
import { isLocale, type Locale } from "@/paraglide/runtime";

// Normaliza el idioma que llega del formulario
export function idioma(locale: unknown): Locale {
	return typeof locale === "string" && isLocale(locale) ? locale : "es";
}
