# Codebook

## Descripción

Aplicación web para guardar fragmentos de código junto a su explicación: pegas un fragmento, un servicio de IA te devuelve un resumen de una línea y lo guardas en tu colección personal para consultarlo cuando quieras. El objetivo es tener una memoria de código propia: cada snippet queda ligado a tu cuenta, aislado del resto de usuarios y disponible desde cualquier navegador.

## Características

- **Explicación con IA**: pega código y obtén un resumen de una línea, con el lenguaje detectado.
- **Modo invitado**: pruébala sin registrarte y sin guardar nada.
- **Colección personal**: con sesión, tus snippets se guardan en tu cuenta y se aíslan con RLS.
- **Búsqueda y paginación**: filtra por código o explicación, por lenguaje y fecha, con navegación numerada.
- **Compartir**: descarga una imagen PNG o genera un enlace público con vista previa.
- **Copiar con un clic**: copia el código o la explicación desde cada tarjeta.
- **Tema oscuro**: interfaz simple y oscura, pensada para leer código.

## Secciones

1. **Inicio** (`/`): formulario de análisis y tu colección paginada.
2. **Generador** (`/generador`): flujo de análisis y guardado para usuarios con sesión.
3. **Resultado**: la explicación del análisis actual, con el lenguaje detectado y el código congelado.
4. **Tus snippets**: colección paginada de 5 en 5, con búsqueda, filtros y acciones.
5. **Acceso**: registro, inicio de sesión con correo o Google, y recuperación de contraseña.
6. **Enlace público** (`/s/[token]`): vista de solo lectura de un snippet compartido.

## Uso

- **Probar sin cuenta**: entra, pega código y mira la explicación (no se guarda).
- **Crear cuenta**: regístrate con correo y contraseña o con tu cuenta de Google.
- **Guardar**: con la sesión iniciada, analiza el código y pulsa «Guardar snippet».
- **Consultar**: la lista muestra tus snippets, lo más nuevo primero.
- **Compartir**: desde cada tarjeta puedes generar un enlace público o descargar una imagen.
- **Copiar y borrar**: cada tarjeta tiene acciones para copiar el código y borrar el snippet.

## Tecnologías Utilizadas

- **Frontend**: Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS 4
- **Backend**: Next.js Server Actions y Route Handlers
- **Base de Datos y Auth**: Supabase (Postgres + Row Level Security + Supabase Auth)
- **Rate Limiting**: Upstash Redis con fallback en memoria
- **Emails**: Resend vía SMTP de Supabase Auth
- **IA**: microservicio `codebook-api` (FastAPI + Groq) con reintentos
- **Validación**: Zod
- **Herramientas**: Bun, Biome, TypeScript
- **Infra & CI/CD**: Vercel, Supabase, Upstash, Dokploy, GitHub Actions

## Despliegue

La aplicación se encuentra desplegada en **Vercel**. Puedes usarla directamente aquí: [codebook-ivndv.vercel.app](https://codebook-ivndv.vercel.app/)

## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
