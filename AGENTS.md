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
| **IA** | **codebook-api** (FastAPI) | *Fase 8* — Groq `openai/gpt-oss-20b` |
| **Deploy** | **Vercel** | *Fase 9* |

---

## 4. Estructura del Código

```plaintext
codebook/
├── src/
│   ├── proxy.ts               → Proxy de Next 16 (refresca la sesión de Supabase)
│   ├── app/
│   │   ├── layout.tsx         → layout raíz (html/body, metadata, tema)
│   │   ├── page.tsx           → inicio (sesión + primera página de snippets)
│   │   ├── icon.svg           → favicon
│   │   ├── actions.ts         → Server Actions (analizar+guardar, borrar)
│   │   ├── globals.css        → Tailwind 4 + tokens del tema oscuro
│   │   ├── login/             → entrar / crear cuenta (page · AuthForm · actions · types)
│   │   └── auth/callback/     → route handler que cambia el `code` por sesión
│   ├── components/
│   │   ├── CodebookApp.tsx    → panel: formulario + lista + paginación
│   │   ├── Header.tsx         → barra superior (logo + sesión) · Server Component
│   │   ├── SnippetForm.tsx    → pegar código + analizar (Server Action)
│   │   ├── SnippetResult.tsx  → panel del análisis actual
│   │   ├── SnippetList.tsx    → lista de snippets + estado vacío
│   │   ├── SnippetCard.tsx    → tarjeta de un snippet
│   │   ├── Paginacion.tsx     → flechas + 3 números + salto manual
│   │   ├── LockedSnippets.tsx → lista bloqueada para invitados
│   │   ├── FechaRelativa.tsx  → "hace X" calculado en el cliente
│   │   └── ui/                → Badge, CopyButton (compartidos)
│   └── lib/
│       ├── auth.ts            → obtenerUsuario() (verificado con getClaims)
│       ├── supabase/          → client.ts · server.ts · proxy.ts (@supabase/ssr)
│       ├── snippets-db.ts     → consultas a Postgres (RLS) · paginación (offset + count)
│       ├── database.types.ts  → tipos generados por `bun run db:types`
│       ├── analisis.ts        → estado de la Server Action de analizar
│       ├── fechas.ts          → helpers de fecha (solo cliente: usa Date.now())
│       ├── summarize.ts       → mock de la IA · contrato { explanation, language }
│       ├── snippets.ts        → tipo Snippet + tamaño de página
│       └── usuario.ts         → tipo Usuario
├── supabase/
│   ├── config.toml            → config local (auth, providers, puertos)
│   └── migrations/            → SQL versionado (tabla snippets + RLS)
├── .env / .env.local          → secretos (gitignored) · ver .env.example
├── biome.json                 → configuración de Biome
└── next.config.ts             → configuración de Next.js (cacheComponents)
```

> Previsto: `src/lib/supabase/` (cliente SSR) y `src/app/actions.ts` (Server Actions) en la fase de datos reales.

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

### 6.4 Fases del Proyecto

> El trabajo se hace **fase por fase**, con revisión del usuario entre cada una.

| Fase | Alcance | Estado |
| :--- | :--- | :--- |
| **F0** | Setup (proyecto, Biome, AGENTS, env) | ✅ |
| **F1** | Shell (layout, tema oscuro, header) | ✅ |
| **F2** | Formulario (`SnippetForm`) | ✅ |
| **F3** | Resultado del análisis (mock) | ✅ |
| **F4** | Lista de snippets (mock) | ✅ |
| **F5** | Invitado vs logueado (mock) | ✅ |
| **F6a** | **Auth email + contraseña** (Supabase + `@supabase/ssr`) | ✅ |
| **F6b** | Google OAuth | ✅ |
| **F7** | **Datos reales** (tabla + RLS + paginación) | ✅ |
| **F8** | IA real (`codebook-api`) | ⏳ |
| **F9** | Deploy (Vercel) | ⏳ |

> **Notas de Next 16:** el middleware ahora es **`src/proxy.ts`**; con `cacheComponents` ya **no existe** `export const dynamic` → se usa **`export const instant = false`** en las páginas que dependen de la sesión.

> **⚠️ Gotcha del login local:** `site_url` y `additional_redirect_urls` en `supabase/config.toml` deben usar **el mismo host** con el que abres la app (`http://localhost:3000/**`). Si el `redirectTo` no está permitido, Supabase cae al `site_url` y **no** ejecuta `/auth/callback` → vuelves a la home **sin sesión**.
>
> La lista de snippets se pagina de **5 en 5** con `?pagina=N` (offset + `count`).
>
> **🔄 Tipos:** `src/lib/database.types.ts` es **generado**. Cada vez que cambies el esquema (nueva migración) corre **`bun run db:types`**, o los tipos quedan viejos y engañan. Los clientes de Supabase están tipados con `<Database>`.
>
> **⚠️ `Date.now()` y `getClaims()`:** `obtenerUsuario()` usa `getClaims()`, que lee la hora del sistema. Si se ejecuta durante el prerender, Next 16 lanza *"encountered the unstable value `Date.now()`"*. Por eso las páginas que leen la sesión arrancan con **`await connection()`** (detiene el prerender ahí). Los helpers de fecha con `Date.now()` viven en `src/lib/fechas.ts` (solo cliente).
