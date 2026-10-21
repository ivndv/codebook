// Esquemas
import { resumenSchema } from "@/adapters/outbound/http/resumen-schema";
// Tipos
import type { SummaryClient } from "@/core/domain/ports/summary-client";
import type { Summary } from "@/core/domain/snippet";

// Reintentos para sobrevivir al "cold boot" del servicio en Serverless
const INTENTOS = 3;
const ESPERA_BASE_MS = 1500;
const TIMEOUT_MS = 10_000;

// Un 408 o un 429 también son temporales
function esReintentable(status: number): boolean {
	return status >= 500 || status === 408 || status === 429;
}

// Adaptador HTTP de codebook-api (SOLO servidor; la key nunca llega al navegador)
export class CodebookApiClient implements SummaryClient {
	private readonly url = `${process.env.CODEBOOK_API_URL ?? ""}/summarize`;
	private readonly apiKey = process.env.CODEBOOK_API_KEY ?? "";

	async resumir(code: string): Promise<Summary> {
		if (!process.env.CODEBOOK_API_URL) {
			throw new Error("Falta CODEBOOK_API_URL.");
		}

		let ultimoError: Error = new Error("El servicio de IA no respondió.");

		for (let intento = 1; intento <= INTENTOS; intento++) {
			// 1. Llama a la API con timeout por intento
			let res: Response | null = null;
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

			try {
				res = await fetch(this.url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-API-Key": this.apiKey,
					},
					body: JSON.stringify({ code }),
					cache: "no-store",
					signal: controller.signal,
				});
			} catch (error) {
				// Red caída, timeout o servicio dormido → reintenta
				ultimoError = error instanceof Error ? error : new Error(String(error));
			} finally {
				clearTimeout(timeoutId);
			}

			// 2. Espera creciente antes del siguiente intento
			let espera = ESPERA_BASE_MS * intento;

			if (res) {
				// 3. Todo bien → valida y devuelve el resumen
				if (res.ok) {
					const data: unknown = await res.json();
					const parsed = resumenSchema.safeParse(data);

					if (!parsed.success) {
						throw new Error("codebook-api devolvió una respuesta inválida.");
					}

					return {
						explanation: parsed.data.explanation,
						language: parsed.data.language ?? null,
					};
				}

				// 4. 4xx no reintentable (key inválida, código rechazado)
				if (!esReintentable(res.status)) {
					throw new Error(`codebook-api respondió ${res.status}`);
				}

				// 5. 5xx, 408 o 429 → puede estar despertando o limitando
				ultimoError = new Error(`codebook-api respondió ${res.status}`);

				if (res.status === 429) {
					const segundos = Number(res.headers.get("retry-after"));

					if (Number.isFinite(segundos) && segundos > 0) {
						espera = Math.min(segundos * 1000, 10_000);
					}
				}
			}

			if (intento < INTENTOS) {
				await new Promise((resolve) => setTimeout(resolve, espera));
			}
		}

		throw ultimoError;
	}
}
