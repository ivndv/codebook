// Tipos
import type { Summary } from "@/core/domain/snippet";

// Puerto de IA: el caso de uso solo pide un resumen
export interface SummaryClient {
	resumir(code: string): Promise<Summary>;
}
