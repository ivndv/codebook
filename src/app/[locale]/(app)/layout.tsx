// Tipos
import type { ReactNode } from "react";
// Componentes
import { Header } from "@/components/layout/Header";

// Layout del área autenticada: header fijo + contenido
export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
