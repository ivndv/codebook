// Tipos
import type { ReactNode } from "react";
// Componentes
import { Header } from "@/components/layout/Header";

// Layout de páginas públicas: header fijo + contenido
export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
