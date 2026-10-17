// Next
import type { Metadata } from "next";
// Estilos
import "./globals.css";

export const metadata: Metadata = {
	title: "codebook",
	description:
		"Guarda fragmentos de código con su explicación generada por IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="es">
			<body className="min-h-screen bg-bg text-text antialiased">
				{children}
			</body>
		</html>
	);
}
