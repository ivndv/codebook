"use client";

// React
import { useActionState, useId, useState } from "react";
// Acciones
import { analizarYGuardar } from "@/app/actions";
// Componentes
import { SnippetResult } from "@/components/SnippetResult";
// Datos
import { ANALISIS_INICIAL } from "@/lib/analisis";
import { MAX_CODE_LENGTH } from "@/lib/summarize";

// Pegar código y analizarlo. Si hay sesión, la Server Action además lo guarda
// en Postgres; el invitado solo ve la explicación
export function SnippetForm() {
	// Estado
	const textareaId = useId();
	const [code, setCode] = useState("");
	const [estado, accion, pendiente] = useActionState(
		analizarYGuardar,
		ANALISIS_INICIAL,
	);

	const vacio = code.trim().length === 0;
	const excedeLimite = code.length > MAX_CODE_LENGTH;
	const puedeEnviar = !vacio && !excedeLimite && !pendiente;

	return (
		<form action={accion} className="space-y-4">
			<label htmlFor={textareaId} className="sr-only">
				Código a analizar
			</label>

			<textarea
				id={textareaId}
				name="code"
				value={code}
				onChange={(event) => setCode(event.target.value)}
				placeholder="Pega tu código aquí…"
				spellCheck={false}
				className="min-h-[200px] w-full resize-y rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
			/>

			{/* Contador + botón */}
			<div className="flex items-center justify-between gap-4">
				<span
					className={`text-xs tabular-nums ${excedeLimite ? "text-red-400" : "text-muted"}`}
				>
					{code.length.toLocaleString("es")} /{" "}
					{MAX_CODE_LENGTH.toLocaleString("es")}
				</span>

				<button
					type="submit"
					disabled={!puedeEnviar}
					aria-busy={pendiente}
					className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
				>
					{pendiente ? "Analizando…" : "✨ Analizar y Guardar"}
				</button>
			</div>

			{excedeLimite && (
				<p className="text-xs text-red-400">
					El código supera el máximo de {MAX_CODE_LENGTH.toLocaleString("es")}{" "}
					caracteres.
				</p>
			)}

			{estado.error && (
				<p
					role="alert"
					className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
				>
					{estado.error}
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

			{estado.explanation && !estado.guardado && (
				<p className="text-xs text-muted">
					ⓘ Este snippet no se guardó. Inicia sesión para guardarlo.
				</p>
			)}
		</form>
	);
}
