// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import { err, ok, type Result } from "@/core/domain/result";
import { MAX_CODE_LENGTH } from "@/core/domain/snippet";

// Valida y normaliza el código que llega de la UI
export function validarCodigo(code: string): Result<string, ErrorDominio> {
	const limpio = code.trim();

	if (!limpio) {
		return err({ tipo: "validacion", mensaje: "El código está vacío." });
	}

	if (limpio.length > MAX_CODE_LENGTH) {
		return err({
			tipo: "validacion",
			mensaje: `El código supera los ${MAX_CODE_LENGTH.toLocaleString("es")} caracteres.`,
		});
	}

	return ok(limpio);
}
