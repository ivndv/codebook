// Error de la IA que se puede mostrar tal cual al usuario
export class ErrorResumenIA extends Error {
	constructor(mensaje: string) {
		super(mensaje);
		this.name = "ErrorResumenIA";
	}
}

// Errores esperados del dominio; la presentación decide cómo mostrarlos
export type ErrorDominio =
	| { tipo: "validacion"; mensaje: string }
	| { tipo: "analisis"; mensaje: string }
	| {
			tipo: "persistencia";
			mensaje: string;
			explanation?: string;
			language?: string | null;
	  }
	| {
			tipo: "sesion";
			mensaje: string;
			explanation?: string;
			language?: string | null;
	  }
	| { tipo: "autenticacion"; mensaje: string };
