// Next
import { headers } from "next/headers";
// Paraglide
import { isLocale, type Locale } from "@/paraglide/runtime";

// Idioma que el proxy dejó en la request; base como respaldo
export async function localeActual(): Promise<Locale> {
	const cabeceras = await headers();
	const valor = cabeceras.get("x-codebook-locale");

	return valor && isLocale(valor) ? valor : "es";
}
