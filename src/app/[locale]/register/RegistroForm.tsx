"use client";

// Iconos
import { LoaderCircle, UserPlus } from "lucide-react";
// React
import {
	useActionState,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
// Locales
import { iniciarConGoogle } from "@/app/[locale]/login/actions";
// Tipos
import { ESTADO_INICIAL } from "@/app/auth-types";
// Componentes
import { Turnstile } from "@/components/auth/Turnstile";
import { botonPrimario, botonSecundario, campo } from "@/components/ui/estilos";
import { useLocale } from "@/i18n/LocaleProvider";
// Paraglide
import * as m from "@/paraglide/messages";
import { registrar } from "./actions";

// Formulario de registro con email, contraseña, confirmación y Turnstile
export function RegistroForm() {
	const locale = useLocale();

	// Estado
	const [estado, accion, pendiente] = useActionState(registrar, ESTADO_INICIAL);
	const [token, setToken] = useState("");
	const [resetSignal, setResetSignal] = useState(0);
	const pendientePrevio = useRef(false);
	const onToken = useCallback((valor: string) => setToken(valor), []);

	// Reinicia el captcha cuando el intento termina con error
	useEffect(() => {
		if (pendientePrevio.current && !pendiente && estado.error) {
			setResetSignal((valor) => valor + 1);
		}

		pendientePrevio.current = pendiente;
	}, [pendiente, estado.error]);

	return (
		<div className="space-y-6">
			<form action={accion} className="space-y-4">
				<input type="hidden" name="locale" value={locale} />

				<div className="space-y-1.5">
					<label htmlFor="email" className="text-xs text-muted">
						{m.auth_email({}, { locale })}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						placeholder={m.auth_email_placeholder({}, { locale })}
						className={campo}
					/>
				</div>

				<div className="space-y-1.5">
					<label htmlFor="password" className="text-xs text-muted">
						{m.auth_password({}, { locale })}
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

				<input type="hidden" name="captchaToken" value={token} />
				<Turnstile onToken={onToken} resetSignal={resetSignal} />

				{estado.error && (
					<p
						role="alert"
						className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
					>
						{estado.error}
					</p>
				)}

				{estado.message && (
					<p className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
						{estado.message}
					</p>
				)}

				<button
					type="submit"
					disabled={pendiente || !token}
					className={`${botonPrimario} w-full`}
				>
					{pendiente ? (
						<>
							<LoaderCircle size={16} aria-hidden className="animate-spin" />
							{m.auth_register_submitting({}, { locale })}
						</>
					) : (
						<>
							<UserPlus size={16} aria-hidden />
							{m.auth_register_submit({}, { locale })}
						</>
					)}
				</button>
			</form>

			{/* Separador */}
			<div className="flex items-center gap-3">
				<span className="h-px flex-1 bg-border" />
				<span className="text-[10px] uppercase tracking-wide text-muted">
					{m.auth_or({}, { locale })}
				</span>
				<span className="h-px flex-1 bg-border" />
			</div>

			<form action={iniciarConGoogle}>
				<input type="hidden" name="locale" value={locale} />
				<button type="submit" className={`${botonSecundario} w-full`}>
					{m.auth_google({}, { locale })}
				</button>
			</form>
		</div>
	);
}
