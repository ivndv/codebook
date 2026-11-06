// Tipos
import type { IdiomaResumen } from "@/core/shared/idioma";
import type { Summary } from "@/core/snippets/domain/snippet";

// Puerto de IA: el caso de uso solo pide un resumen en un idioma
export interface SummaryClient {
	resumir(code: string, idioma: IdiomaResumen): Promise<Summary>;
}
