// Tipos
import type { ErrorDominio } from "@/core/domain/errors";
import { err, ok, type Result } from "@/core/domain/result";
import type {
	AlcanceBusqueda,
	FechaFiltro,
	OrdenSnippets,
} from "@/core/domain/snippet";

// Límites de los campos editables
export const MAX_EXPLANATION_LENGTH = 2_000;
export const MAX_LANGUAGE_LENGTH = 40;
export const MAX_BUSQUEDA_LENGTH = 100;

const ALCANCES: AlcanceBusqueda[] = ["todo", "codigo", "explicacion"];
const ORDENES: OrdenSnippets[] = ["recientes", "antiguos"];
const FECHAS: FechaFiltro[] = ["todo", "hoy", "7d", "30d"];

// Explicación obligatoria y acotada
export function validarExplicacion(
	valor: string,
): Result<string, ErrorDominio> {
	const explicacion = valor.trim();

	if (!explicacion) {
		return err({ tipo: "validacion", mensaje: "La explicación está vacía." });
	}

	if (explicacion.length > MAX_EXPLANATION_LENGTH) {
		return err({
			tipo: "validacion",
			mensaje: "La explicación es demasiado larga.",
		});
	}

	return ok(explicacion);
}

// Lenguaje: minúsculas, sin espacios extra, vacío → null
export function normalizarLenguaje(
	valor: string | null | undefined,
): string | null {
	const lenguaje = (valor ?? "")
		.trim()
		.toLowerCase()
		.slice(0, MAX_LANGUAGE_LENGTH);

	return lenguaje || null;
}

// Texto de búsqueda acotado
export function validarBusqueda(valor: string | null | undefined): string {
	return (valor ?? "").trim().slice(0, MAX_BUSQUEDA_LENGTH);
}

// Valores desconocidos caen al default
export function normalizarAlcance(
	valor: string | null | undefined,
): AlcanceBusqueda {
	return ALCANCES.includes(valor as AlcanceBusqueda)
		? (valor as AlcanceBusqueda)
		: "todo";
}

export function normalizarOrden(
	valor: string | null | undefined,
): OrdenSnippets {
	return ORDENES.includes(valor as OrdenSnippets)
		? (valor as OrdenSnippets)
		: "recientes";
}

export function normalizarFecha(valor: string | null | undefined): FechaFiltro {
	return FECHAS.includes(valor as FechaFiltro)
		? (valor as FechaFiltro)
		: "todo";
}
