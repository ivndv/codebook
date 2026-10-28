<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Guía para Agentes en Codebook

Guía operativa y técnica para agentes de Inteligencia Artificial que colaboren en el desarrollo del proyecto **codebook**.

---

## 1. Visión General del Proyecto

**codebook** es un *pastebin inteligente*: el usuario pega un fragmento de código, el microservicio `codebook-api` devuelve un **resumen de una línea** generado con IA, y el usuario lo guarda en su colección personal.

* **Propósito:** memoria de código propia, con aislamiento por usuario y acceso desde cualquier navegador.
* **Modos de uso:**
  * **Invitado** → obtiene la explicación, **no se guarda nada** y no toca la base de datos.
  * **Autenticado** → además persiste en **Supabase** y aparece en *"Tus snippets"*.
* **Dominio en Producción:** [https://codebook-ivndv.vercel.app](https://codebook-ivndv.vercel.app)
* **Repositorios:** `codebook` (frontend) · `codebook-api` (backend IA)

---

## 2. Antes de Tocar Código

* **Documentación de arquitectura:** lee [`docs/diseno-y-arquitectura.md`](docs/diseno-y-arquitectura.md) antes de cambios estructurales.
* **Next.js 16:** breaking changes. Antes de escribir código, lee la guía correspondiente en `node_modules/next/dist/docs/`. No asumas APIs de versiones anteriores.
* **Convenciones clave de Next 16:**
  * `params` y `searchParams` son **`Promise`** → `await` obligatorio.
  * Tipos globales **`LayoutProps<'/ruta'>`** y **`PageProps<'/ruta'>`** (sin importar).
  * Tailwind 4 vía `@import "tailwindcss"` + `@theme`.
* **Uso del MCP CodeGraph:** antes de búsquedas masivas de texto, usa `codegraph_explore` con `projectPath: "/home/ivan/software-dev/codebook"`.
* **Sincronización del índice:**

  ```bash
  codegraph status /home/ivan/software-dev/codebook
  codegraph sync /home/ivan/software-dev/codebook
  ```

---

## 3. Stack Tecnológico

| Capa | Tecnología | Detalle |
| :--- | :--- | :--- |
| **Runtime & Gestor** | **Bun** | `bun.lock` |
| **Framework** | **Next.js 16** | App Router + Turbopack (`src/app/`) |
| **UI** | **React 19** | Server Components por defecto |
| **Estilos** | **Tailwind CSS 4** | Tokens de tema en `src/app/globals.css` (`@theme`) |
| **Lenguaje** | **TypeScript** | Modo estricto |
| **Linter/Formatter** | **Biome 2** | `biome.json` (tabs + comillas dobles) |
| **Auth + DB** | **Supabase** | `@supabase/ssr` + RLS por usuario |
| **Rate limiting** | **Upstash Redis** | `@upstash/ratelimit` + fallback en memoria |
| **Emails** | **Resend** | SMTP de Supabase Auth en producción |
| **IA** | **codebook-api** (FastAPI + Groq) | `openai/gpt-oss-20b`, integrada con reintentos |
| **Validación** | **Zod 4** | Entradas de Server Actions y del cliente HTTP |
| **Tipos de BD** | **Generados** | `bun run db:types` → `src/lib/database.types.ts` |
| **Deploy** | **Vercel** | Producción: `https://codebook-ivndv.vercel.app` |

---

## 4. Estructura del Código

```plaintext
codebook/
├── src/
│   ├── proxy.ts                  → Proxy de Next 16 (refresca la sesión de Supabase)
│   ├── app/                      → Adaptador de entrada (Next)
│   │   ├── layout.tsx            → layout raíz (html/body, metadata, tema)
│   │   ├── page.tsx              → inicio (sesión + primera página de snippets)
│   │   ├── actions.ts            → Server Actions delgadas
│   │   ├── error.tsx             → fallback de errores no controlados
│   │   ├── generador/            → flujo de análisis y guardado (page + loading)
│   │   ├── login/                → iniciar sesión (page · LoginForm · actions)
│   │   ├── registro/             → crear cuenta (page · RegistroForm · actions)
│   │   ├── recuperar/            → solicitar enlace de recuperación
│   │   ├── restablecer/          → fijar nueva contraseña
│   │   ├── auth/callback/        → route handler que cambia el `code` por sesión
│   │   └── s/[token]/            → vista pública de un snippet + Open Graph
│   ├── components/               → Adaptador de entrada (UI)
│   │   ├── CodebookApp.tsx · Header.tsx · Footer.tsx · MenuSesion.tsx
│   │   ├── SnippetForm.tsx · snippet-form-state.ts · SnippetResult.tsx
│   │   ├── SnippetList.tsx · SnippetCard.tsx · BuscadorSnippets.tsx
│   │   ├── Paginacion.tsx · LockedSnippets.tsx · FechaRelativa.tsx
│   │   ├── DialogoCompartir.tsx · TarjetaCompartir.tsx · Turnstile.tsx
│   │   └── ui/                   → Badge, CopyButton, estilos
│   ├── core/                     → Núcleo hexagonal
│   │   ├── domain/               → snippet, usuario, errors, result, validar-codigo
│   │   │   └── ports/            → SnippetRepository, SessionReader, AuthGateway, SummaryClient
│   │   └── application/          → casos de uso (analizar, guardar, listar, borrar, compartir, auth)
│   ├── adapters/
│   │   ├── inbound/next/         → origen, rate-limit, schemas (Zod)
│   │   └── outbound/
│   │       ├── supabase/         → client, server, proxy, public, repos, auth, sesión
│   │       ├── upstash/          → rate limit distribuido
│   │       └── http/             → cliente de codebook-api + esquema Zod
│   ├── composition/container.ts  → composition root por request
│   └── lib/                      → database.types.ts (generado) y fechas.ts
├── supabase/migrations/          → SQL versionado (tabla snippets + RLS + RPC pública)
├── docs/                         → documentación de arquitectura
├── biome.json · next.config.ts · .env.example
```

> Hexagonal: `core` no conoce Next, Supabase ni `fetch`; `adapters/outbound` implementa los puertos; `app` y `components` son adaptadores de entrada; `composition` une todo por request. `lib` solo contiene lo generado y utilidades puras.

---

## 5. Comandos de Desarrollo y Tooling

Todos los comandos se ejecutan con **Bun**:

```bash
# Desarrollo (Next.js dev en localhost:3000)
bun run dev

# Compilación de producción
bun run build
bun run start

# Verificación de formato/lint (read-only, igual que en CI)
bun run check

# Corrección automática (escribe archivos)
bun run lint
bun run format

# Regenerar tipos desde el esquema de Supabase
bun run db:types
```

---

## 6. Convenciones Obligatorias para Agentes

### 6.1 Regla de Oro en Ejecución de Checks

* **PROHIBIDO ejecutar el linter de forma reactiva tras cada pequeño cambio.** Acumula todos los cambios y corre `bun run check` **una sola vez al final**.

### 6.2 Estilo de Código y Comentarios

* **Lenguaje:** código, comentarios y documentación en **español**.
* **Comentarios:** `//` de **una sola línea**, en español, **sin punto final**. Nada de bloques `/** */` (salvo pragmas). Si el nombre ya lo explica, no se comenta.
* **Imports agrupados:** una etiqueta encima de cada grupo → `// React`, `// Next`, `// Supabase`, `// Acciones`, `// Componentes`, `// Datos`, `// Tipos`, `// Locales`.
* **Pasos numerados:** `// 1. …`, `// 2. …` dentro de la lógica secuencial larga.
* **Tipado estricto:** prohibido `any`; definir interfaces/types explícitos.
* **Server Components por defecto:** añade `"use client"` solo cuando haga falta interactividad y **empújalo a las hojas** del árbol.

### 6.3 Reglas de Negocio Críticas

* **`user_id` nunca se envía desde el cliente:** la base lo asigna con `default auth.uid()`.
* **Toda lectura de snippets pasa por RLS.** No usar `service_role` en el frontend.
* **El enlace público solo lee un snippet** vía RPC `obtener_snippet_publico(token)`; no abre la tabla.
* **El modo invitado no persiste nada.** Si no hay sesión, no se llama al repositorio.

### 6.4 Flujo de Git

* **PROHIBIDO hacer commits o push sin la aprobación explícita del usuario.**
* **Flujo de ramas:** desarrollo en `develop`; merge a `main` solo tras aprobación.
* **Mensajes de commit:** *Conventional Commits* en minúsculas y español (`feat: ...`, `fix: ...`, `chore: ...`).
