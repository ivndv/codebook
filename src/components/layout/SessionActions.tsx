"use client";

// React
import { useEffect, useState } from "react";
// Infraestructura
import { createClient } from "@/adapters/outbound/supabase/client/client";
// Componentes
import { MenuAjustes } from "@/components/layout/MenuAjustes";

// Sesión leída en el navegador: mantiene estáticas las páginas públicas
export function SessionActions() {
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const supabase = createClient();
		let activo = true;

		void supabase.auth.getSession().then(({ data }) => {
			if (activo) setEmail(data.session?.user.email ?? null);
		});

		const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
			if (activo) setEmail(sesion?.user.email ?? null);
		});

		return () => {
			activo = false;
			data.subscription.unsubscribe();
		};
	}, []);

	return <MenuAjustes email={email} />;
}
