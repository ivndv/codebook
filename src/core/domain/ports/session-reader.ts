// Tipos
import type { Usuario } from "@/core/domain/usuario";

// Puerto de sesión: quién está usando la app
export interface SessionReader {
	obtenerUsuario(): Promise<Usuario | null>;
}
