"use client";

// Iconos
import { LoaderCircle, Mail } from "lucide-react";
// React
import {
	useActionState,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
// Tipos
import { ESTADO_INICIAL } from "@/app/auth-types";
// Componentes
import { Turnstile } from "@/components/Turnstile";
import { botonPrimario, campo } from "@/components/ui/estilos";
// Locales
import { solicitarRecuperacion } from "./actions";

// Formulario para pedir el enlace de recuperación
export function RecuperarForm() {
	// Estado
	const [estado, accion, pendiente] = useActionState(
		solicitarRecuperacion,
		ESTADO_INICIAL,
	);
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
		<form action={accion} className="space-y-4">
			<div className="space-y-1.5">
				<label htmlFor="email" className="text-xs text-muted">
					Correo
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autoComplete="email"
					placeholder="tu@correo.com"
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
						Enviando…
					</>
				) : (
					<>
						<Mail size={16} aria-hidden />
						Enviar enlace
					</>
				)}
			</button>
		</form>
	);
}
