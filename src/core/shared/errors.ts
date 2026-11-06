// El captcha no se pudo verificar (bot o token vencido)
export class ErrorCaptcha extends Error {
	constructor(
		mensaje = "No pudimos verificar que no eres un bot. Inténtalo de nuevo.",
	) {
		super(mensaje);
		this.name = "ErrorCaptcha";
	}
}

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
