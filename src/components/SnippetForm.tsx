"use client";

// Iconos
import {
	Check,
	Eraser,
	LoaderCircle,
	Lock,
	LogIn,
	RotateCcw,
	Save,
	Sparkles,
} from "lucide-react";
// Next
import Link from "next/link";
// React
import { type FormEvent, useId, useReducer, useRef, useState } from "react";
// Acciones
import { analizar, guardarSnippet } from "@/app/actions";
// Componentes
import { SnippetResult } from "@/components/SnippetResult";
import { reducer } from "@/components/snippet-form-state";
// Estilos
import {
	botonPrimario,
	botonSecundario,
	botonSutil,
} from "@/components/ui/estilos";
// Datos
import { ANALISIS_INICIAL } from "@/core/application/dto";
import { MAX_CODE_LENGTH } from "@/core/domain/snippet";

// Pegar código, analizarlo y guardarlo. El invitado solo analiza
export function SnippetForm({ logueado }: { logueado: boolean }) {
	// Estado
	const textareaId = useId();
	const [code, setCode] = useState("");
	const [estado, dispatch] = useReducer(reducer, ANALISIS_INICIAL);
	const peticionRef = useRef(false);

	const vacio = code.trim().length === 0;
	const excedeLimite = code.length > MAX_CODE_LENGTH;
	const analizando = estado.fase === "analizando";
	const guardando = estado.fase === "guardando";
	const ocupado = analizando || guardando;
	const congelado =
		analizando ||
		estado.fase === "analizado" ||
		guardando ||
		estado.fase === "error-guardado";

	const puedeAnalizar = !vacio && !excedeLimite && !ocupado;
	const mostrarGuardar =
		logueado &&
		(estado.fase === "analizado" || estado.fase === "error-guardado");
	const mostrarReintentar =
		estado.fase === "analizado" ||
		estado.fase === "error-analisis" ||
		estado.fase === "error-guardado";
	const mostrarLimpiar =
		estado.fase === "analizado" || estado.fase === "error-guardado";

	// Handlers
	async function ejecutarAnalisis(codigo: string) {
		if (peticionRef.current) return;

		peticionRef.current = true;
		dispatch({ tipo: "analizar" });

		try {
			const resultado = await analizar(codigo);

			if (!resultado.ok) {
				dispatch({ tipo: "analisis-error", mensaje: resultado.error });
				return;
			}

			setCode(resultado.code);
			dispatch({
				tipo: "analisis-ok",
				codigo: resultado.code,
				explanation: resultado.explanation,
				language: resultado.language,
			});
		} catch (error) {
			console.error("[analizar]", error);
			dispatch({
				tipo: "analisis-error",
				mensaje: "No se pudo analizar el código. Inténtalo de nuevo.",
			});
		} finally {
			peticionRef.current = false;
		}
	}

	function manejarEnvio(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!puedeAnalizar || estado.fase !== "inicial") return;

		void ejecutarAnalisis(code);
	}

	function reintentar() {
		const codigo =
			estado.fase === "analizado" || estado.fase === "error-guardado"
				? (estado.codigoAnalizado ?? code)
				: code;

		void ejecutarAnalisis(codigo);
	}

	async function guardar() {
		if (
			!logueado ||
			!estado.codigoAnalizado ||
			!estado.explanation ||
			guardando ||
			peticionRef.current
		) {
			return;
		}

		peticionRef.current = true;
		dispatch({ tipo: "guardar" });

		try {
			const resultado = await guardarSnippet({
				code: estado.codigoAnalizado,
				explanation: estado.explanation,
				language: estado.language,
			});

			if (!resultado.ok) {
				dispatch({ tipo: "guardado-error", mensaje: resultado.error });
				return;
			}

			setCode("");
			dispatch({ tipo: "guardado-ok" });
		} catch (error) {
			console.error("[guardar]", error);
			dispatch({
				tipo: "guardado-error",
				mensaje: "No se pudo guardar el snippet. Inténtalo de nuevo.",
			});
		} finally {
			peticionRef.current = false;
		}
	}

	function limpiar() {
		setCode("");
		dispatch({ tipo: "limpiar" });
	}

	function cambiarCodigo(valor: string) {
		setCode(valor);

		// Al editar después de un error o de un guardado, el mensaje deja de aplicar
		if (estado.fase === "error-analisis" || estado.exito) {
			dispatch({ tipo: "limpiar" });
		}
	}

	// Render
	return (
		<form onSubmit={manejarEnvio} className="space-y-4">
			<label htmlFor={textareaId} className="sr-only">
				{congelado ? "Código analizado" : "Código a analizar"}
			</label>

			<textarea
				id={textareaId}
				name="code"
				value={code}
				onChange={(event) => cambiarCodigo(event.target.value)}
				readOnly={congelado}
				aria-readonly={congelado}
				placeholder="Pega tu código aquí…"
				spellCheck={false}
				className="min-h-[200px] w-full resize-y rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm leading-relaxed outline-none transition-colors placeholder:text-muted/60 focus:border-accent read-only:cursor-not-allowed read-only:opacity-70"
			/>

			{/* Contador + botones */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<span
					className={`text-xs tabular-nums ${excedeLimite ? "text-red-400" : "text-muted"}`}
				>
					{code.length.toLocaleString("es")} /{" "}
					{MAX_CODE_LENGTH.toLocaleString("es")}
				</span>

				<div className="flex flex-wrap items-center gap-2">
					{estado.fase === "inicial" && (
						<button
							type="submit"
							disabled={!puedeAnalizar}
							className={botonPrimario}
						>
							<Sparkles size={16} aria-hidden />
							Analizar
						</button>
					)}

					{analizando && (
						<button type="button" disabled aria-busy className={botonPrimario}>
							<LoaderCircle size={16} aria-hidden className="animate-spin" />
							Analizando…
						</button>
					)}

					{guardando && (
						<button type="button" disabled aria-busy className={botonPrimario}>
							<LoaderCircle size={16} aria-hidden className="animate-spin" />
							Guardando…
						</button>
					)}

					{mostrarGuardar && (
						<button
							type="button"
							onClick={() => void guardar()}
							className={botonPrimario}
						>
							<Save size={16} aria-hidden />
							Guardar snippet
						</button>
					)}

					{mostrarReintentar && (
						<button
							type="button"
							onClick={reintentar}
							className={botonSecundario}
						>
							<RotateCcw size={16} aria-hidden />
							Reintentar
						</button>
					)}

					{mostrarLimpiar && (
						<button type="button" onClick={limpiar} className={botonSutil}>
							<Eraser size={16} aria-hidden />
							Limpiar
						</button>
					)}
				</div>
			</div>

			{excedeLimite && (
				<p className="text-xs text-red-400">
					El código supera el máximo de {MAX_CODE_LENGTH.toLocaleString("es")}{" "}
					caracteres.
				</p>
			)}

			{congelado && mostrarLimpiar && (
				<p className="flex items-center gap-1.5 text-xs text-muted">
					<Lock size={14} aria-hidden />
					Código congelado. Pulsa «Limpiar» para editarlo.
				</p>
			)}

			{estado.error && (
				<p
					role="alert"
					className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
				>
					{estado.error}
				</p>
			)}

			{estado.exito && (
				<p className="flex items-center gap-1.5 text-xs text-muted">
					<Check size={14} aria-hidden />
					{estado.exito}
				</p>
			)}

			{/* Resultado del análisis */}
			{estado.explanation && (
				<SnippetResult
					summary={{
						explanation: estado.explanation,
						language: estado.language,
					}}
				/>
			)}

			{!logueado && estado.fase === "analizado" && (
				<p className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
					<Lock size={14} aria-hidden />
					<Link
						href="/login"
						className="inline-flex items-center gap-1 text-accent-text hover:underline"
					>
						<LogIn size={14} aria-hidden />
						Inicia sesión
					</Link>
					<span>para guardar este snippet.</span>
				</p>
			)}
		</form>
	);
}
