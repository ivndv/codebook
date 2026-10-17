// Lo que devuelve la Server Action de analizar
export interface AnalisisState {
	error: string | null;
	explanation: string | null;
	language: string | null;
	guardado: boolean;
}

// Estado inicial del formulario
export const ANALISIS_INICIAL: AnalisisState = {
	error: null,
	explanation: null,
	language: null,
	guardado: false,
};
