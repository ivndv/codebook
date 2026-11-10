"use client";

// Iconos
import { KeyRound, LoaderCircle } from "lucide-react";
// React
import { useActionState } from "react";
// Tipos
import { ESTADO_INICIAL } from "@/app/auth-types";
// Componentes
import { botonPrimario, campo } from "@/components/ui/estilos";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
// Paraglide
import * as m from "@/paraglide/messages";
import { restablecerPassword } from "./actions";

// Formulario de contraseña nueva (sesión creada por el enlace del correo)
export function RestablecerForm() {
	const locale = useLocale();

	// Estado
	const [estado, accion, pendiente] = useActionState(
		restablecerPassword,
		ESTADO_INICIAL,
	);

	return (
		<form action={accion} className="space-y-4">
			<input type="hidden" name="locale" value={locale} />

			<div className="space-y-1.5">
				<label htmlFor="password" className="text-xs text-muted">
					{m.auth_new_password({}, { locale })}
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					minLength={6}
					autoComplete="new-password"
					placeholder={m.auth_password_placeholder({}, { locale })}
					className={campo}
				/>
			</div>

			<div className="space-y-1.5">
				<label htmlFor="confirmPassword" className="text-xs text-muted">
					{m.auth_password_confirm({}, { locale })}
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					required
					minLength={6}
					autoComplete="new-password"
					placeholder={m.auth_password_confirm_placeholder({}, { locale })}
					className={campo}
				/>
			</div>

			{estado.error && (
				<p
					role="alert"
					className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
				>
					{estado.error}
				</p>
			)}

			<button
				type="submit"
				disabled={pendiente}
				className={`${botonPrimario} w-full`}
			>
				{pendiente ? (
					<>
						<LoaderCircle size={16} aria-hidden className="animate-spin" />
						{m.auth_reset_saving({}, { locale })}
					</>
				) : (
					<>
						<KeyRound size={16} aria-hidden />
						{m.auth_reset_submit({}, { locale })}
					</>
				)}
			</button>
		</form>
	);
}
