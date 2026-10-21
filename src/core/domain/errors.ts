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
