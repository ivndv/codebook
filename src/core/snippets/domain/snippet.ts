// Un snippet es independiente del esquema de la base de datos
export interface Snippet {
	id: string;
	code: string;
	explanation: string;
	language: string | null;
	createdAt: string;
}

// Datos necesarios para crear un snippet
export interface NuevoSnippet {
	code: string;
	explanation: string;
	language: string | null;
}

// Resumen que devuelve el servicio de IA
export interface Summary {
	explanation: string;
	language: string | null;
}
