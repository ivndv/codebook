// Next
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
// Componentes
import { Footer } from "@/components/Footer";
// Estilos
import "./globals.css";

// Fuentes autoalojadas: Next las descarga en build y las sirve desde el propio dominio
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
	display: "swap",
});

export const metadata: Metadata = {
	title: "codebook",
	description:
		"Guarda fragmentos de código con su explicación generada por IA.",
};

export const viewport: Viewport = {
	// Necesario para que env(safe-area-inset-*) no valga 0 en iOS.
	viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body className="flex min-h-screen flex-col bg-bg font-sans text-text antialiased">
				{children}
				<Footer />
			</body>
		</html>
	);
}
