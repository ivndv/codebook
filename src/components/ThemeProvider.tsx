"use client";

// Next Themes
import { ThemeProvider as NextThemesProvider } from "next-themes";
// React
import type { ReactNode } from "react";

// Tema claro/oscuro/sistema sobre el atributo data-theme del html
export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemesProvider
			attribute="data-theme"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
