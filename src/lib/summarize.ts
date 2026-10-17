// Cliente de la IA: habla con codebook-api (SOLO servidor; la key nunca llega al navegador)

// Máximo de caracteres por snippet (debe coincidir con codebook-api)
export const MAX_CODE_LENGTH = 10_000;

// Respuesta del servicio de IA (mismo contrato que codebook-api)
export interface Summary {
	explanation: string;
	language: string | null;
}

// Reintentos para sobrevivir al "cold boot" del servicio en Serverless
const INTENTOS = 3;
const ESPERA_BASE_MS = 1500;

// Pide el resumen a codebook-api y devuelve { explanation, language }
export async function analizarConIA(code: string): Promise<Summary> {
	const url = `${process.env.CODEBOOK_API_URL}/summarize`;
	const apiKey = process.env.CODEBOOK_API_KEY ?? "";
	let ultimoError: Error = new Error("El servicio de IA no respondió.");

	for (let intento = 1; intento <= INTENTOS; intento++) {
		// 1. Llama a la API
		let res: Response | null = null;
		try {
			res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
				body: JSON.stringify({ code }),
				cache: "no-store",
			});
		} catch (err) {
			// Red caída o servicio dormido → reintenta
			ultimoError = err instanceof Error ? err : new Error(String(err));
		}

		if (res) {
			// 2. Todo bien → devuelve el resumen
			if (res.ok) return (await res.json()) as Summary;

			// 3. 4xx (key inválida, código rechazado) → reintentar no sirve
			if (res.status < 500) {
				throw new Error(`codebook-api respondió ${res.status}`);
			}

			// 4. 5xx → puede estar despertando, reintenta
			ultimoError = new Error(`codebook-api respondió ${res.status}`);
		}

		// 5. Espera creciente antes del siguiente intento
		if (intento < INTENTOS) {
			await new Promise((resolve) =>
				setTimeout(resolve, ESPERA_BASE_MS * intento),
			);
		}
	}

	throw ultimoError;
}
