"use client";

// Iconos
import {
	Check,
	Eraser,
	LoaderCircle,
	Lock,
	LogIn,
	RotateCcw,
	Sparkles,
} from "lucide-react";
// Next
import Link from "next/link";
// React
import { type FormEvent, useId, useReducer, useRef, useState } from "react";
// Acciones
import { analizar } from "@/app/actions/analyze";
import { guardarSnippet } from "@/app/actions/save";
// Componentes
import { SnippetResult } from "@/components/snippets/SnippetResult";
import { reducer } from "@/components/snippets/snippet-form-state";
// Estilos
import {
	botonPrimario,
	botonSecundarioCompacto,
	botonSutilCompacto,
} from "@/components/ui/estilos";
// Datos
import { ANALISIS_INICIAL } from "@/core/snippets/application/dto";
import { MAX_CODE_LENGTH } from "@/core/snippets/domain/limites";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import { ruta } from "@/i18n/rutas";
import * as m from "@/paraglide/messages";

// Pegar código, analizarlo y guardarlo. El invitado solo analiza
export function SnippetForm({ logueado }: { logueado: boolean }) {
	const locale = useLocale();

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
			const resultado = await analizar(locale, codigo);

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
				mensaje: m.err_analyze({}, { locale }),
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
			const resultado = await guardarSnippet(locale, {
				code: estado.codigoAnalizado,
				explanation: estado.explanation,
				language: estado.language,
			});

			if (!resultado.ok) {
				dispatch({ tipo: "guardado-error", mensaje: resultado.error });
				return;
			}

			setCode("");
			dispatch({
				tipo: "guardado-ok",
				mensaje: m.gen_saved({}, { locale }),
			});
		} catch (error) {
			console.error("[guardar]", error);
			dispatch({
				tipo: "guardado-error",
				mensaje: m.err_save({}, { locale }),
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
				{congelado
					? m.gen_label_analyzed({}, { locale })
					: m.gen_label_to_analyze({}, { locale })}
			</label>

			<textarea
				id={textareaId}
				name="code"
				value={code}
				onChange={(event) => cambiarCodigo(event.target.value)}
				readOnly={congelado}
				aria-readonly={congelado}
				placeholder={m.gen_placeholder({}, { locale })}
				spellCheck={false}
				className="min-h-[200px] w-full resize-y rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm leading-relaxed outline-none transition-colors placeholder:text-muted/60 focus:border-accent read-only:cursor-not-allowed read-only:opacity-70"
			/>

			{/* Contador + botones */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<span
					className={`text-xs tabular-nums ${excedeLimite ? "text-red-400" : "text-muted"}`}
				>
					{code.length.toLocaleString(locale)} /{" "}
					{MAX_CODE_LENGTH.toLocaleString(locale)}
				</span>

				<div className="flex flex-wrap items-center gap-2">
					{estado.fase === "inicial" && (
						<button
							type="submit"
							disabled={!puedeAnalizar}
							className={botonPrimario}
						>
							<Sparkles size={16} aria-hidden />
							{m.gen_analyze({}, { locale })}
						</button>
					)}

					{analizando && (
						<button type="button" disabled aria-busy className={botonPrimario}>
							<LoaderCircle size={16} aria-hidden className="animate-spin" />
							{m.gen_analyzing({}, { locale })}
						</button>
					)}

					{mostrarReintentar && (
						<button
							type="button"
							onClick={reintentar}
							className={botonSecundarioCompacto}
						>
							<RotateCcw size={14} aria-hidden />
							{m.common_retry({}, { locale })}
						</button>
					)}

					{mostrarLimpiar && (
						<button
							type="button"
							onClick={limpiar}
							className={botonSutilCompacto}
						>
							<Eraser size={14} aria-hidden />
							{m.common_clear({}, { locale })}
						</button>
					)}
				</div>
			</div>

			{excedeLimite && (
				<p className="text-xs text-red-400">
					{m.gen_limit_exceeded(
						{ max: MAX_CODE_LENGTH.toLocaleString(locale) },
						{ locale },
					)}
				</p>
			)}

			{congelado && mostrarLimpiar && (
				<p className="flex items-center gap-1.5 text-xs text-muted">
					<Lock size={14} aria-hidden />
					{m.gen_frozen_hint({}, { locale })}
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
					codigo={estado.codigoAnalizado}
					onSave={logueado ? () => void guardar() : undefined}
					guardando={guardando}
				/>
			)}

			{!logueado && estado.fase === "analizado" && (
				<p className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
					<Lock size={14} aria-hidden />
					<Link
						href={ruta(locale, "/login")}
						className="inline-flex items-center gap-1 text-accent-text hover:underline"
					>
						<LogIn size={14} aria-hidden />
						{m.gen_login_link({}, { locale })}
					</Link>
					<span>{m.gen_login_suffix({}, { locale })}</span>
				</p>
			)}
		</form>
	);
}
