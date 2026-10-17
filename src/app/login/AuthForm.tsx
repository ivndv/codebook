"use client";

// React
import { useActionState } from "react";
// Locales
import { autenticar, iniciarConGoogle } from "./actions";
import { ESTADO_INICIAL } from "./types";

const claseInput =
	"w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent";

// Entrar/crear cuenta con email… o con Google
export function AuthForm() {
	// Estado
	const [estado, accion, pendiente] = useActionState(
		autenticar,
		ESTADO_INICIAL,
	);

	return (
		<div className="space-y-5">
			{/* Email y contraseña */}
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
						className={claseInput}
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
						className={claseInput}
					/>
				</div>

				{estado.error && (
					<p
						role="alert"
						className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
					>
						{estado.error}
					</p>
				)}

				{estado.message && (
					<p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">
						{estado.message}
					</p>
				)}

				<div className="flex gap-3">
					<button
						type="submit"
						name="intent"
						value="login"
						disabled={pendiente}
						className="flex-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{pendiente ? "…" : "Entrar"}
					</button>
					<button
						type="submit"
						name="intent"
						value="signup"
						disabled={pendiente}
						className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-text disabled:opacity-40"
					>
						Crear cuenta
					</button>
				</div>
			</form>

			{/* Separador: el form de Google va HERMANO, nunca anidado */}
			<div className="flex items-center gap-3">
				<span className="h-px flex-1 bg-border" />
				<span className="text-[10px] uppercase tracking-wide text-muted">
					o
				</span>
				<span className="h-px flex-1 bg-border" />
			</div>

			{/* Google */}
			<form action={iniciarConGoogle}>
				<button
					type="submit"
					className="w-full rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-text"
				>
					Continuar con Google
				</button>
			</form>
		</div>
	);
}
