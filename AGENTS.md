# AGENTS.md — Codebook

Guía operativa y técnica para agentes de Inteligencia Artificial que colaboren en el desarrollo de **codebook**.

## 1. Visión general

**codebook** es un _pastebin inteligente_: el usuario pega un fragmento de código, el microservicio `codebook-api` devuelve un **resumen de una línea** generado con IA y el usuario lo guarda en su colección personal.

- **Propósito:** memoria de código propia, con aislamiento por usuario y acceso desde cualquier navegador.
- **Modos de uso:**
  - **Invitado** → obtiene la explicación; no se guarda nada y no toca la base de datos.
  - **Autenticado** → además persiste en **Supabase** y aparece en _"Tus snippets"_.
- **Dominio en producción:** [https://codebook.liuma.app](https://codebook.liuma.app)
- **Repositorios:** `codebook` (frontend) · `codebook-api` (backend IA)

## 2. Antes de tocar código

- **Documentación de arquitectura:** lee [`docs/diseno-y-arquitectura.md`](docs/diseno-y-arquitectura.md) antes de cambios estructurales.
- **Next.js 16:** breaking changes. Antes de escribir código, lee la guía correspondiente en `node_modules/next/dist/docs/`. No asumas APIs de versiones anteriores.
- **Convenciones clave de Next 16:**
  - `params` y `searchParams` son **`Promise`** → `await` obligatorio.
  - Tipos globales **`LayoutProps<'/ruta'>`** y **`PageProps<'/ruta'>`** (sin importar).
  - `middleware.ts` pasó a llamarse **`src/proxy.ts`** (exporta `proxy`).
  - Las páginas que leen sesión usan `await connection()` y `export const instant = false` para detener el prerender.
  - Tailwind 4 vía `@import "tailwindcss"` + `@theme`.
- **i18n (Paraglide):** las rutas viven bajo `src/app/[locale]/`; los catálogos en `messages/{es,en}.json` y la config en `project.inlang/`. No hardcodees textos visibles: usa `m.clave({}, { locale })`. Genera con `bun run i18n` (ya corre en `dev`/`build`).

**CodeGraph** (índice de símbolos del repo): usa `codegraph_explore` (`query`, `maxFiles`, `projectPath`) antes de un grep masivo o de leer varios archivos; devuelve fuente verbatim, rutas de llamada e impacto.

- `codegraph sync /home/ivan/software-dev/codebook` tras editar, pull o cambiar de rama (incremental, uso normal).
- `codegraph index /home/ivan/software-dev/codebook` solo al crear el índice, tras `codegraph upgrade` o si `status` avisa `built by vX` (rebuild completo).
- `codegraph status /home/ivan/software-dev/codebook` para comprobar el estado.

## 3. Stack tecnológico

| Capa                  | Tecnología                        | Detalle                                                 |
| :-------------------- | :-------------------------------- | :------------------------------------------------------ |
| **Runtime & Gestor**  | **Bun**                           | `bun.lock`                                              |
| **Framework**         | **Next.js 16**                    | App Router + Turbopack (`src/app/[locale]/`)            |
| **UI**                | **React 19**                      | Server Components por defecto                           |
| **Estilos**           | **Tailwind CSS 4**                | Tokens de tema en `src/app/globals.css` (`@theme`)      |
| **Lenguaje**          | **TypeScript**                    | Modo estricto                                           |
| **Linter/Formatter**  | **Biome 2**                       | `biome.json` (tabs + comillas dobles)                   |
| **Auth + DB**         | **Supabase**                      | `@supabase/ssr` + RLS por usuario                       |
| **Rate limiting**     | **Upstash Redis**                 | `@upstash/ratelimit` + fallback en memoria              |
| **Emails**            | **Resend**                        | SMTP de Supabase Auth en producción                     |
| **i18n**              | **Paraglide JS (Inlang)**         | `project.inlang/` + `messages/{es,en}.json` (base `es`) |
| **Imagen de snippet** | **html-to-image**                 | genera el PNG de la tarjeta al compartir                |
| **IA**                | **codebook-api** (FastAPI + Groq) | `openai/gpt-oss-20b`, integrada con reintentos          |
| **Validación**        | **Zod 4**                         | Entradas de Server Actions y del cliente HTTP           |
| **Tipos de BD**       | **Generados**                     | `bun run db:types` → `src/lib/database.types.ts`        |
| **Deploy**            | **Vercel**                        | Producción: `https://codebook.liuma.app`                |

## 4. Estructura del código

```plaintext
codebook/
├── src/
│   ├── proxy.ts                  → Proxy de Next 16 (idioma + refresco de sesión Supabase)
│   ├── app/                      → Adaptador de entrada (Next)
│   │   ├── globals.css           → Tailwind 4 + tokens (@theme)
│   │   ├── auth-types.ts
│   │   ├── actions/              → Server Actions (analyze · save · delete · share · idioma)
│   │   ├── auth/
│   │   │   ├── callback/         → OAuth de Google: canje del `code`
│   │   │   └── confirm/          → confirmación de email: `code` o `token_hash`
│   │   └── [locale]/             → rutas con i18n (es · en)
│   │       ├── layout.tsx        → layout raíz (html/body, fuentes, tema, i18n, footer)
│   │       ├── error.tsx         → fallback de errores no controlados
│   │       ├── (publico)/        → landing estática + header con sesión en cliente
│   │       ├── (auth)/           → login · register · forgot-password · reset-password
│   │       ├── (app)/            → generator (protegida, SSR)
│   │       └── s/[token]/        → vista pública de un snippet + Open Graph
│   ├── components/               → Adaptador de entrada (UI)
│   │   ├── auth/                 → Turnstile
│   │   ├── layout/               → Header · Footer · MenuAjustes · NavPrincipal · ThemeProvider
│   │   ├── snippets/             → CodebookApp · SnippetForm · SnippetList · SnippetCard · …
│   │   └── ui/                   → Badge · CopyButton · estilos
│   ├── core/                     → Núcleo hexagonal (por subdominio)
│   │   ├── auth/
│   │   │   ├── domain/           → usuario + ports (SessionReader, AuthGateway)
│   │   │   └── application/      → casos de uso (registrar, iniciar sesión, recuperación)
│   │   ├── shared/               → errors, result, validar-codigo, idioma
│   │   └── snippets/
│   │       ├── domain/           → snippet, filtros, paginación, límites, ports
│   │       └── application/      → casos de uso (analizar, guardar, listar, borrar, compartir)
│   ├── adapters/
│   │   ├── inbound/next/         → origen, rate-limit, schemas (Zod)
│   │   └── outbound/
│   │       ├── supabase/         → client, proxy, public, repos, auth, sesión
│   │       ├── upstash/          → rate limit distribuido
│   │       └── http/             → cliente de codebook-api + esquema Zod
│   ├── i18n/                     → rutas, servidor (localeActual), LocaleProvider
│   ├── paraglide/                → generado por Paraglide (no editar)
│   ├── composition/container.ts  → composition root por request
│   └── lib/                      → database.types.ts (generado), fechas.ts, filtros-url.ts
├── messages/                     → catálogos es.json / en.json (fuente de i18n)
├── project.inlang/               → configuración de Inlang/Paraglide
├── supabase/migrations/          → SQL versionado (tabla snippets + RLS + RPC pública)
├── docs/                         → documentación de arquitectura
├── biome.json · next.config.ts · .env.example
```

## 5. Arquitectura y flujo de datos

- **Hexagonal:** `core` no conoce Next, Supabase ni `fetch`; `adapters/outbound` implementa los puertos y `app`/`components` son adaptadores de entrada. `core` se organiza por subdominio: `core/snippets/`, `core/auth/` y `core/shared/`.
- **Composición:** `composition/container.ts` une todo por request.
- **Flujo:** UI o Server Action → composition root → caso de uso de `core/<dominio>/application` → adaptador saliente (Supabase, Upstash o cliente HTTP de `codebook-api`).
- **i18n:** `src/proxy.ts` resuelve el idioma (cookie `PARAGLIDE_LOCALE` > `Accept-Language` > base `es`), redirige a `/{locale}` y deja `x-codebook-locale` en la request. En servidor, `localeActual()` lee esa cabecera; las rutas se arman con `ruta(locale, path)`.
- **Renderizado:** las páginas públicas (`(publico)`) son estáticas; el `Header` es cliente y `SessionActions` lee la sesión en el navegador. `(auth)` y `(app)/generator` siguen siendo dinámicas porque comprueban sesión en servidor.
- **Auth:** `/auth/callback` canjea el `code` de OAuth; `/auth/confirm` confirma emails (`code` o `token_hash`). Los `redirectTo` se inyectan desde las Server Actions, no se hardcodean en el adapter.
- **`lib`:** solo contiene lo generado (`database.types.ts`) y utilidades puras (`fechas.ts`, `filtros-url.ts`).
- **`src/paraglide/`:** código generado por Paraglide; no se edita a mano.

## 6. Variables de entorno

`.env*` está en `.gitignore`: los secretos nunca se suben. Copia `.env.example` a `.env.local` (front) y a `.env` (CLI). Aquí solo se documentan los nombres, nunca los valores.

### 6.1 `.env.local` (front)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `CODEBOOK_API_URL`
- `CODEBOOK_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `APP_ENV`

### 6.2 `.env` (raíz, Supabase CLI)

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`

## 7. Comandos

Todos los comandos se ejecutan con **Bun**:

```bash
# Desarrollo (compila i18n y arranca Next en localhost:3000)
bun run dev

# Compilación de producción (compila i18n y compila Next)
bun run build

# Servidor de producción
bun run start

# Compilar los catálogos de Paraglide (dev/build ya lo hacen)
bun run i18n

# Verificación de tipos
bun run typecheck

# Verificación de formato/lint (read-only, igual que en CI)
bun run check

# Corrección automática de lint (escribe archivos)
bun run lint

# Formateo automático (escribe archivos)
bun run format

# Regenerar tipos desde el esquema de Supabase
bun run db:types
```

## 8. Convenciones y reglas críticas

### 8.1 Regla de oro en ejecución de checks

- **PROHIBIDO ejecutar el linter de forma reactiva tras cada pequeño cambio.** Acumula todos los cambios y corre `bun run check` **una sola vez al final**.

### 8.2 Estilo de código y comentarios

- **Lenguaje:** código, comentarios y documentación en **español**.
- **Comentarios:** `//` de **una sola línea**, en español, **sin punto final**. Nada de bloques `/** */` (salvo pragmas). Si el nombre ya lo explica, no se comenta.
- **Imports agrupados:** una etiqueta encima de cada grupo → `// React`, `// Next`, `// Supabase`, `// Infraestructura`, `// Aplicación`, `// Dominio`, `// Componentes`, `// Acciones`, `// Paraglide`, `// Locales`, `// Estilos`, `// Datos`, `// Tipos`.
- **Pasos numerados:** `// 1. …`, `// 2. …` dentro de la lógica secuencial larga.
- **Tipado estricto:** prohibido `any`; definir interfaces/types explícitos.
- **Server Components por defecto:** añade `"use client"` solo cuando haga falta interactividad y **empújalo a las hojas** del árbol.
- **i18n:** todo texto visible sale de `m.clave({}, { locale })`; los catálogos viven en `messages/{es,en}.json`. No edites `src/paraglide/` a mano.

### 8.3 Reglas de negocio críticas

- **`user_id` nunca se envía desde el cliente:** la base lo asigna con `default auth.uid()`.
- **Toda lectura de snippets pasa por RLS.** No usar `service_role` en el frontend.
- **El enlace público solo lee un snippet** vía RPC `obtener_snippet_publico(token)`; no abre la tabla.
- **El modo invitado no persiste nada.** Si no hay sesión, no se llama al repositorio.

## 9. Flujo de Git y despliegue

- **PROHIBIDO hacer commits o push sin la aprobación explícita del usuario.**
- **Flujo de ramas:** desarrollo en `develop`; merge a `main` solo tras aprobación.
- **Mensajes de commit:** _Conventional Commits_ en minúsculas y español (`feat: ...`, `fix: ...`, `chore: ...`).
- **Despliegue:** Vercel.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
