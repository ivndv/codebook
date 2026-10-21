# Codebook

## Descripción

Aplicación web para guardar fragmentos de código junto a su explicación: pegas un fragmento, un servicio de IA te devuelve un resumen de una línea y lo guardas en tu colección personal para consultarlo cuando quieras.

El objetivo es tener una **memoria de código propia**: cada snippet queda ligado a tu cuenta, aislado del resto de usuarios y disponible desde cualquier navegador.

## Características

- **Explicación con IA**: pega código y obtén un resumen de una línea, con el lenguaje detectado.
- **Colección personal**: tus snippets se guardan en tu cuenta, no en el navegador.
- **Modo invitado**: úsala sin registrarte para probar el resumen (no se guarda nada).
- **Aislamiento con RLS**: cada usuario solo puede ver y borrar sus propios snippets.
- **Rate limiting**: límites por usuario/IP y globales para proteger la cuota de IA, con Redis y fallback local.
- **Paginación numerada**: navega por tu colección con flechas, números y salto directo.
- **Copiar con un clic**: copia el código o la explicación desde cada tarjeta.
- **Tema oscuro**: interfaz simple y oscura, pensada para leer código.

## Secciones

1. **Formulario**: pega el fragmento y pulsa «Analizar»; con sesión, después «Guardar snippet».
2. **Resultado**: la explicación del análisis actual, con el lenguaje detectado y el código congelado.
3. **Tus snippets**: tu colección paginada de 5 en 5, con copiar y borrar.
4. **Acceso**: registro e inicio de sesión con correo o con Google.
5. **Modo invitado**: la lista queda bloqueada hasta que inicies sesión.

## Uso

- **Probar sin cuenta**: entra, pega código y mira la explicación (no se guarda).
- **Crear cuenta**: regístrate con correo y contraseña o con tu cuenta de Google.
- **Guardar**: con la sesión iniciada, analiza el código y pulsa «Guardar snippet».
- **Consultar**: la lista muestra tus snippets, lo más nuevo primero.
- **Copiar y borrar**: cada tarjeta tiene acciones para copiar el código y borrar el snippet.

## Tecnologías Utilizadas

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js Server Actions y Route Handlers
- **Base de datos y Auth**: Supabase (Postgres + Row Level Security + Supabase Auth)
- **Rate limiting**: Upstash Redis + `@upstash/ratelimit` con fallback en memoria
- **Emails**: Resend vía SMTP de Supabase Auth
- **IA**: microservicio en Python (FastAPI + Groq) integrado con reintentos
- **Validación**: Zod
- **Iconos**: Lucide
- **Tipos**: generados desde el esquema (`supabase gen types`)
- **Herramientas**: Bun, Biome, TypeScript
- **Infra & CI/CD**: Vercel + Supabase + Upstash + Railway

## Instalación

1. **Clonar el Repositorio**: descarga el código en tu máquina usando Git.

```bash
git clone https://github.com/ivndv/codebook.git
```

2. **Instalar Dependencias**: abre una terminal en la carpeta del proyecto y ejecuta:

```bash
bun install
```

3. **Levantar Supabase local** (necesita Docker):

```bash
bunx supabase start
```

4. **Variables de Entorno**: copia `.env.example` a `.env.local` y rellena los valores (los imprime `bunx supabase status`):

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key

CODEBOOK_API_URL=http://localhost:8000
CODEBOOK_API_KEY=tu_api_key

UPSTASH_REDIS_REST_URL=tu_url_de_upstash
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash
```

5. **Iniciar el Proyecto**:

```bash
bun run dev
```

## Despliegue

Producción: [codebook-ivndv.vercel.app](https://codebook-ivndv.vercel.app)

### Emails

En local, Supabase usa Mailpit (`http://localhost:54324`). En producción, Supabase Auth envía los correos por Resend:


## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
