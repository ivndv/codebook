"use client";

// Iconos
import { LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
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
import { botonPrimario, botonSecundario, campo } from "@/components/ui/estilos";
// Locales
import { iniciarConGoogle, iniciarSesion } from "./actions";

// Formulario de entrada con email, contraseña y Turnstile
export function LoginForm() {
	// Estado
	const [estado, accion, pendiente] = useActionState(
		iniciarSesion,
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
		<div className="space-y-6">
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

				<div className="space-y-1.5">
					<label htmlFor="password" className="text-xs text-muted">
						Contraseña
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minLength={6}
						autoComplete="current-password"
						placeholder="mínimo 6 caracteres"
						className={campo}
					/>
				</div>

				<div className="flex justify-end">
					<Link
						href="/recuperar"
						className="text-xs text-muted transition-colors hover:text-accent-text"
					>
						¿Olvidaste tu contraseña?
					</Link>
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
							Entrando…
						</>
					) : (
						<>
							<LogIn size={16} aria-hidden />
							Entrar
						</>
					)}
				</button>
			</form>

			{/* Separador */}
			<div className="flex items-center gap-3">
				<span className="h-px flex-1 bg-border" />
				<span className="text-[10px] uppercase tracking-wide text-muted">
					o
				</span>
				<span className="h-px flex-1 bg-border" />
			</div>

			<form action={iniciarConGoogle}>
				<button type="submit" className={`${botonSecundario} w-full`}>
					Continuar con Google
				</button>
			</form>
		</div>
	);
}
