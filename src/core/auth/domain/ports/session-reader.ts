// Tipos
import type { Usuario } from "@/core/auth/domain/usuario";

// Puerto de sesión: quién está usando la app
export interface SessionReader {
	obtenerUsuario(): Promise<Usuario | null>;
}
