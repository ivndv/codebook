// Máximo de caracteres por snippet (debe coincidir con codebook-api)
export const MAX_CODE_LENGTH = 10_000;

// Respuesta del servicio de IA: mismo contrato que codebook-api
export interface Summary {
	explanation: string;
	language: string | null;
}

// Detecta el lenguaje con una heurística simple (en F8 lo devuelve la IA)
function detectarLenguaje(code: string): string | null {
	if (/\b(select|insert into|create table|delete from)\b/i.test(code))
		return "sql";
	if (/^\s*(def|class|import|from)\b/m.test(code) || /\bprint\(/.test(code))
		return "python";
	if (/\binterface\s+\w+|:\s*(string|number|boolean)\b/.test(code))
		return "typescript";
	if (/\b(function|const|let)\b|=>/.test(code)) return "javascript";
	return null;
}

// Resumen de una línea del código. TEMPORAL: simula codebook-api hasta la F8.
// Si el código contiene "// error" o "# error" falla, para poder probar ese estado
export async function summarize(code: string): Promise<Summary> {
	await new Promise((resolve) => setTimeout(resolve, 800));

	if (!code.trim()) {
		throw new Error("El código está vacío.");
	}

	if (/(\/\/|#)\s*error/i.test(code)) {
		throw new Error("El servicio de IA falló (simulado).");
	}

	const lineas = code.trim().split("\n").length;
	return {
		explanation: `Fragmento de ${lineas} línea${lineas === 1 ? "" : "s"}: resumen simulado de lo que hace el código.`,
		language: detectarLenguaje(code),
	};
}
