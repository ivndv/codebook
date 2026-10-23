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

// Credenciales de auth: email, contraseña y token de Turnstile
export const credencialesSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	captchaToken: z.string().min(1),
});

// Solicitud de enlace de recuperación
export const recuperacionSchema = z.object({
	email: z.email(),
	captchaToken: z.string().min(1),
});

// Contraseña nueva del flujo de recuperación
export const nuevaPasswordSchema = z.object({
	password: z.string().min(6),
});
