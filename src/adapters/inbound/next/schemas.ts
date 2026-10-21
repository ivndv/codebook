// Zod
import { z } from "zod";

// Forma de la entrada de análisis. Las reglas viven en el dominio
export const codigoEntradaSchema = z.string();

// Forma de los datos que envía el cliente al guardar
export const datosGuardadoSchema = z.object({
	code: z.string(),
	explanation: z.string(),
	language: z.string().nullable(),
});

// Id de un snippet
export const idSnippetSchema = z.uuid();
