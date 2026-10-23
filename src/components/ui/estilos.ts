// Clases de interfaz compartidas por varios componentes

// Botones
export const botonPrimario =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40";

export const botonSecundario =
	"inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-40";

export const botonSutil =
	"inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-text disabled:cursor-not-allowed disabled:opacity-40";

// Campos de formulario
export const campo =
	"w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

// Contenedor tipo tarjeta
export const tarjeta = "rounded-xl border border-border bg-surface shadow-card";
