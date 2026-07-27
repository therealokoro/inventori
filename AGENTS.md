# AGENTS.md

Repo: https://github.com/therealokoro/inventori

Instructions for any AI agent working in this repository. Read this file in
full before making changes. For a complete description of what this app is
and who it's for, see `PROJECT.md` — read that too if it's your first time
touching this codebase.

## Before Starting Any Task

- Read `package.json`, `nuxt.config.ts`, `app/components/`, `app/components/Ui/` and `app/composables/` — build on
  what's there, don't reinstall or duplicate anything already present, and
  match existing conventions exactly.
- Unless a specific task says otherwise, do not run commands (`bun install`,
  `bun run dev`, migrations, `lint`, `fmt`, `test`) — audit by reading files,
  then write the code correctly the first time. The human runs and verifies.
- If installed skills or connected MCP tools are available and relevant to
  the task (e.g. a skill for a specific file format, an MCP tool for
  querying a connected service), use them rather than working around them
  or reimplementing what they already provide.

## What This Repo Is

A single-store inventory management app for a small shop, with two user
roles: admin (the owner) and staff. Built as a Nuxt 4 SPA (SSR disabled),
offline-first by requirement — see `PROJECT.md` for why this matters and
how it shapes the architecture.

## Tech Stack

- Nuxt 4 (SPA mode, `ssr: false`), Vue 3, TypeScript, Bun
- Tailwind CSS v4 via the native Vite plugin (not the module)
- UI Thing for components - all of which are already installed and live in `app/components/Ui/`
- FormKit for forms - project contains a few custom formkit components in `app/components/FormKit/`
- Zod, with validation schemas derived from the database schema via
  `drizzle-zod` rather than hand-written in parallel
- Drizzle ORM, NuxtHub for hosting/database
- better-auth, hand-rolled with the Drizzle adapter (not a wrapper module) - see `server/utils/server-auth.ts` and `app/composables/useAuth.ts`
- rstore for local-first data/caching (offline-critical entities)
- nuxt-actions for server-side business logic that can assume connectivity
- nuxt-toastflow for notifications, with fully custom rendering — use shadcn-token and ui-thing components if needed
- VueUse for utilities (e.g. `useOnline()` for connectivity state)
- oxlint + oxfmt for linting and formatting
- Vitest for tests

## Conventions

**Database schema** lives in `server/db/schema/` as a directory, one
file per entity. Closely related entities (e.g. sales and their line items)
can share a file. `index.ts` barrel-exports everything as one object.

**IDs**: use plain UUIDs (`crypto.randomUUID()`).

**Validation**: derive Zod schemas from Drizzle tables with `drizzle-zod`.
Don't maintain hand-written parallel schemas.

**Components** are grouped by domain in PascalCase subfolders under
`app/components/`, relying on Nuxt's automatic folder-based prefixing
(`components/Product/Table.vue` → `<ProductTable />`). Don't flatten these
into one folder with manually prefixed filenames.

**Notifications** go through a single `useNotify()` composable wrapping
nuxt-toastflow. Never call the toast library directly from feature code, and
never call it from server/Nitro handlers — it's client-only.

**Data split by connectivity requirement**: entities that must work fully
offline (products, sales, stock movements) go through rstore's local-first
cache and sync. Entities/actions that can reasonably assume connectivity
(staff management, reports, day close-out, supplier management) go through
nuxt-actions.

**Role enforcement is two-tier, always**:

- Client-side route middleware exists for UX (redirecting staff away from
  admin-only pages) but is never sufficient on its own.
- Every server-side write path enforces role checks independently of the
  client. Some actions are admin-only outright; some records (like
  products) are writable by both roles but have specific fields (like cost
  price) that only admins may change — these need field-level checks, not
  just endpoint-level ones. See `PROJECT.md` for the reasoning.

**Sync/conflict resolution** for offline data is intentionally unresolved
for now. Don't invent a scheme — leave a TODO pointing at
`docs/sync-strategy.md` wherever sync logic lives, until that's specified.

## Working Method

- This repo is built incrementally, feature by feature, and later features
  build on conventions established earlier. If something is ambiguous or a
  prior convention seems inconsistent, flag it rather than guessing silently.
- Match existing code style, naming, and structure exactly rather than
  introducing a parallel pattern.
- Use any installed skills and connected MCP tools whenever they're relevant
  to the task at hand, instead of ignoring them or solving the problem from
  scratch.
- Keep explanations of completed work short — a summary of what was built
  and any flagged ambiguities is enough. Don't restate the task back in
  full, narrate routine steps, or pad explanations; token budget matters
  more than exposition here.