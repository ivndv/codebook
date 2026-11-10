// Tipos
import type { ReactNode } from "react";
// Componentes
import { Header } from "@/components/layout/Header";

// Layout de autenticación: header fijo + formulario
export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
