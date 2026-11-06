// Next
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
// Componentes
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
// Paraglide
import { isLocale, locales } from "@/paraglide/runtime";
// Estilos
import "../globals.css";

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

// Ambos idiomas se prerenderizan
export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	const { locale } = await params;

	// Un idioma desconocido no tiene catálogo ni rutas
	if (!isLocale(locale)) notFound();

	return (
		<html
			lang={locale}
			className={`${inter.variable} ${jetbrainsMono.variable}`}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col bg-bg font-sans text-text antialiased">
				<ThemeProvider>
					<LocaleProvider locale={locale}>
						{children}
						<Footer locale={locale} />
					</LocaleProvider>
				</ThemeProvider>
				{/* Cloudflare Web Analytics */}
				<Script
					src="https://static.cloudflareinsights.com/beacon.min.js"
					strategy="afterInteractive"
					data-cf-beacon='{"token":"7c11b558e902440698d22570b3ef0910"}'
				/>
			</body>
		</html>
	);
}
