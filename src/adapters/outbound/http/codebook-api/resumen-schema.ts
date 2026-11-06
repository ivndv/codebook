// Zod
import { z } from "zod";

// Respuesta mínima que debe devolver codebook-api
export const resumenSchema = z.object({
	explanation: z.string(),
	language: z.string().nullable().optional(),
});
