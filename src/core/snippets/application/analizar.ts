// Dominio
import { type ErrorDominio, ErrorResumenIA } from "@/core/shared/errors";
import type { IdiomaResumen } from "@/core/shared/idioma";
import { err, ok, type Result } from "@/core/shared/result";
import { validarCodigo } from "@/core/shared/validar-codigo";
// Tipos
import type { SummaryClient } from "@/core/snippets/domain/ports/summary-client";

// Resultado del análisis listo para congelar en la UI
export interface ResumenAnalizado {
	code: string;
	explanation: string;
	language: string | null;
}

// Dependencias del análisis
export interface DepsAnalisis {
	resumen: SummaryClient;
}

// Valida el código y pide la explicación a la IA. No toca la base
export async function analizar(
	code: string,
	deps: DepsAnalisis,
	idioma: IdiomaResumen,
): Promise<Result<ResumenAnalizado, ErrorDominio>> {
	const codigo = validarCodigo(code);

	if (!codigo.ok) return err(codigo.error);

	try {
		const resumen = await deps.resumen.resumir(codigo.valor, idioma);

		return ok({
			code: codigo.valor,
			...resumen,
		});
	} catch (error) {
		if (error instanceof ErrorResumenIA) {
			return err({ tipo: "analisis", mensaje: error.message });
		}

		console.error("[analizar]", error);
		return err({
			tipo: "analisis",
			mensaje: "No se pudo obtener la explicación. Inténtalo de nuevo.",
		});
	}
}
