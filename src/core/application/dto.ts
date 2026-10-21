// Fases del formulario de análisis
export type FaseAnalisis =
	| "inicial"
	| "analizando"
	| "analizado"
	| "guardando"
	| "error-analisis"
	| "error-guardado";

// Estado que consume el formulario
export interface EstadoAnalisis {
	fase: FaseAnalisis;
	codigoAnalizado: string | null;
	explanation: string | null;
	language: string | null;
	error: string | null;
	exito: string | null;
}

// Estado inicial del formulario
export const ANALISIS_INICIAL: EstadoAnalisis = {
	fase: "inicial",
	codigoAnalizado: null,
	explanation: null,
	language: null,
	error: null,
	exito: null,
};

// Respuesta de la Server Action de análisis
export type ResultadoAnalisisAccion =
	| {
			ok: true;
			code: string;
			explanation: string;
			language: string | null;
	  }
	| { ok: false; error: string };

// Respuesta de la Server Action de guardado
export type ResultadoGuardadoAccion =
	| { ok: true }
	| { ok: false; error: string };
