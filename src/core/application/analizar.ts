// Dominio
import { type ErrorDominio, ErrorResumenIA } from "@/core/domain/errors";
// Tipos
import type { SummaryClient } from "@/core/domain/ports/summary-client";
import { err, ok, type Result } from "@/core/domain/result";
import { validarCodigo } from "@/core/domain/validar-codigo";

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
): Promise<Result<ResumenAnalizado, ErrorDominio>> {
	const codigo = validarCodigo(code);

	if (!codigo.ok) return err(codigo.error);

	try {
		const resumen = await deps.resumen.resumir(codigo.valor);

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
