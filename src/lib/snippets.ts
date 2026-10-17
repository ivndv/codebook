// Tipos
import type { Tables } from "@/lib/database.types";

// Un snippet = una fila de public.snippets (tipo generado desde la base de datos)
export type Snippet = Tables<"snippets">;

// Tamaño de página de la lista
export const SNIPPETS_POR_PAGINA = 5;
