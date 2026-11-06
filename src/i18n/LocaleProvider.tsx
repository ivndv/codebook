"use client";

// React
import { createContext, type ReactNode, useContext } from "react";
// Paraglide
import type { Locale } from "@/paraglide/runtime";

// Idioma resuelto por la ruta; lo consumen los componentes cliente
const LocaleContext = createContext<Locale>("es");

export function LocaleProvider({
	locale,
	children,
}: {
	locale: Locale;
	children: ReactNode;
}) {
	return (
		<LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
	);
}

// Idioma activo para construir enlaces y traducir mensajes en cliente
export function useLocale(): Locale {
	return useContext(LocaleContext);
}
