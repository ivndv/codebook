<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Guía para Agentes en Codebook

Guía operativa y técnica para agentes de Inteligencia Artificial que colaboren en el desarrollo del proyecto **codebook**.

---

## 1. Visión General del Proyecto

**codebook** es un *pastebin inteligente*: el usuario pega un fragmento de código, un microservicio en Python (`codebook-api`) le devuelve un **resumen de una línea** generado con IA, y el usuario lo guarda en su colección personal.

* **Propósito:** Practicar el stack completo real — **Next.js + Vercel + Supabase + Railway + Python/FastAPI** — construyendo una app pequeña y terminable.
* **Modos de uso:**
  * **Invitado** → obtiene la explicación, **no se guarda nada** y no toca la base de datos.
  * **Logueado** → además se guarda en **Supabase** y aparece en *"Tus snippets"*.
* **Documentación de diseño:** `../codebook.md` (frontend) y `../codebook-api.md` (API).
* **Repositorio:** `codebook` (frontend) · `codebook-api` (backend IA).

---

## 2. Antes de Tocar Código

* **Next.js 16:** este proyecto usa **Next 16 con breaking changes**. Antes de escribir código, lee la guía correspondiente en `node_modules/next/dist/docs/` (ver el bloque de arriba). No asumas APIs de versiones anteriores.
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
| **Runtime & Gestor** | **Bun** | `bun@1.4.2` (`bun.lock`) |
| **Framework** | **Next.js 16** | App Router + Turbopack (`src/app/`) |
| **UI** | **React 19** | Server Components por defecto |
| **Estilos** | **Tailwind CSS 4** | Tokens de tema en `src/app/globals.css` (`@theme`) |
| **Lenguaje** | **TypeScript** | Modo estricto (`strict: true`) |
| **Linter/Formatter** | **Biome 2** | `biome.json` (tabs + comillas dobles) |
| **Auth + DB** | **Supabase** | *Fase 6* — `@supabase/ssr` + RLS por usuario |
| **Rate limiting** | **Upstash Redis** | Free tier + fallback en memoria |
| **Emails** | **Resend** | SMTP de Supabase Auth en producción |
| **IA** | **codebook-api** (FastAPI) | Groq `openai/gpt-oss-20b` · integrada con reintentos |
| **Deploy** | **Vercel** | Producción: `https://codebook-ivndv.vercel.app` |

---

## 4. Estructura del Código

```plaintext
codebook/
├── src/
│   ├── proxy.ts               → Proxy de Next 16 (refresca la sesión de Supabase)
│   ├── app/                   → Adaptador de entrada (Next)
│   │   ├── layout.tsx         → layout raíz (html/body, metadata, tema)
│   │   ├── page.tsx           → inicio (sesión + primera página de snippets)
│   │   ├── actions.ts         → Server Actions delgadas
│   │   ├── error.tsx          → fallback de errores no controlados
│   │   ├── loading.tsx        → esqueleto mientras carga la página
│   │   ├── globals.css        → Tailwind 4 + tokens del tema oscuro
│   │   ├── login/             → entrar / crear cuenta (page · AuthForm · actions · types)
│   │   └── auth/callback/     → route handler que cambia el `code` por sesión
│   ├── components/            → Adaptador de entrada (UI)
│   │   ├── CodebookApp.tsx
│   │   ├── Header.tsx
│   │   ├── SnippetForm.tsx
│   │   ├── snippet-form-state.ts → reducer del flujo analizar → guardar
│   │   ├── SnippetResult.tsx
│   │   ├── SnippetList.tsx
│   │   ├── SnippetCard.tsx
│   │   ├── Paginacion.tsx
│   │   ├── LockedSnippets.tsx
│   │   ├── FechaRelativa.tsx
│   │   └── ui/                → Badge, CopyButton
│   ├── core/                  → Núcleo hexagonal
│   │   ├── domain/
│   │   │   ├── snippet.ts     → Snippet, NuevoSnippet, límites
│   │   │   ├── usuario.ts
│   │   │   ├── errors.ts      → ErrorDominio
│   │   │   ├── result.ts      → Result<T, E>
│   │   │   ├── validar-codigo.ts → validación compartida del código
│   │   │   └── ports/         → SnippetRepository, SessionReader, SummaryClient, AuthGateway
│   │   └── application/       → Casos de uso
│   │       ├── analizar.ts
│   │       ├── guardar-snippet.ts
│   │       ├── listar-snippets.ts
│   │       ├── borrar-snippet.ts
│   │       ├── autenticar.ts
│   │       └── dto.ts
│   ├── adapters/
│   │   ├── inbound/next/
│   │   │   ├── origen.ts      → origen absoluto para redirects
│   │   │   ├── rate-limit.ts  → identidad + fallback local del rate limit
│   │   │   └── schemas.ts     → validación Zod de entradas
│   │   └── outbound/
│   │       ├── supabase/      → client, server, proxy, repos, auth, sesión
│   │       ├── upstash/       → rate limit distribuido con Redis
│   │       └── http/          → cliente de codebook-api + esquema Zod
│   ├── composition/
│   │   └── container.ts       → composition root por request
│   └── lib/                   → Generado y utilidades puras
│       ├── database.types.ts  → tipos generados por `bun run db:types`
│       └── fechas.ts          → helpers de fecha (solo cliente: usa Date.now())
├── supabase/
│   ├── config.toml            → config local (auth, providers, puertos)
│   └── migrations/            → SQL versionado (tabla snippets + RLS)
├── .env / .env.local          → secretos (gitignored) · ver .env.example
├── biome.json                 → configuración de Biome
└── next.config.ts             → configuración de Next.js (cacheComponents)
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

# Verificación de formato/lint (read-only, igual que en CI)
bun run check

# Corrección automática (escribe archivos)
bun run lint
bun run format
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
* **Etiquetas de sección:** `// Estado`, `// Handlers`, `// Render` solo en archivos largos.
* **Tipado estricto:** prohibido `any`; definir interfaces/types explícitos.
* **Server Components por defecto:** añade `"use client"` solo cuando haga falta interactividad (estado, eventos, APIs del navegador) y **empújalo a las hojas** del árbol.

### 6.3 Flujo de Git

* **PROHIBIDO hacer commits o push sin la aprobación explícita del usuario.**
* **Flujo de ramas:** desarrollo en `develop`; merge a `main` solo tras aprobación.
* **Mensajes de commit:** *Conventional Commits* en minúsculas y español (`feat: ...`, `fix: ...`, `chore: ...`).
