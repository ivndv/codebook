// Tipos
import { ANALISIS_INICIAL, type EstadoAnalisis } from "@/core/application/dto";

// Acciones del formulario
export type AccionAnalisis =
	| { tipo: "analizar" }
	| {
			tipo: "analisis-ok";
			codigo: string;
			explanation: string;
			language: string | null;
	  }
	| { tipo: "analisis-error"; mensaje: string }
	| { tipo: "guardar" }
	| { tipo: "guardado-ok" }
	| { tipo: "guardado-error"; mensaje: string }
	| { tipo: "limpiar" };

// Transiciones explícitas del flujo analizar → guardar
export function reducer(
	estado: EstadoAnalisis,
	accion: AccionAnalisis,
): EstadoAnalisis {
	switch (accion.tipo) {
		case "analizar":
			return { ...estado, fase: "analizando", error: null, exito: null };

		case "analisis-ok":
			return {
				fase: "analizado",
				codigoAnalizado: accion.codigo,
				explanation: accion.explanation,
				language: accion.language,
				error: null,
				exito: null,
			};

		case "analisis-error":
			return {
				...ANALISIS_INICIAL,
				fase: "error-analisis",
				error: accion.mensaje,
			};

		case "guardar":
			return { ...estado, fase: "guardando", error: null, exito: null };

		case "guardado-ok":
			return {
				...ANALISIS_INICIAL,
				exito: "Snippet guardado en tu colección.",
			};

		case "guardado-error":
			return { ...estado, fase: "error-guardado", error: accion.mensaje };

		case "limpiar":
			return ANALISIS_INICIAL;

		default:
			return estado;
	}
}
