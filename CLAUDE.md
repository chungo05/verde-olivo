# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint check
```

No test framework is configured. There is no `npm test` command.

## Environment

Copy `.env.template` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

**Stack**: Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Supabase (auth + DB) · Leaflet (maps) · Swiper (carousels)

### Routing & i18n

All user-facing pages live under `app/[locale]/`. The supported locales are `en`, `es`, `ko` (defined in `lib/i18n.ts`). The file named `proxy.ts` at the root **is the Next.js middleware** (exported config with matcher). It handles:

1. Supabase session refresh on every request
2. Unauthenticated redirect for `/[locale]/admin/*` routes
3. i18n: redirects bare paths to locale-prefixed paths and persists the chosen locale in the `NEXT_LOCALE` cookie

Locale detection order: `NEXT_LOCALE` cookie → `accept-language` header → `en` default.

Translations are loaded server-side via `getDictionary(locale)` in layouts/pages, then passed into the client `<I18nProvider>`. Client components access them via `useTranslation()`.

### Auth & Roles

Three Supabase clients depending on context:
- `lib/supabase/client.ts` — browser (`createBrowserClient`)
- `lib/supabase/server.ts` — Server Components and Server Actions (`createServerClient` + `next/headers`)
- `lib/supabase/middleware.ts` — middleware only (kept separate because `next/headers` is unavailable there)

Roles (`admin` | `agent` | `user`) live in the `user_roles` Supabase table. Always read roles via the `get_my_role` Supabase RPC (a `SECURITY DEFINER` function) — never query `user_roles` directly for the current user's role, as RLS can mask the result.

The `<AuthProvider>` exposes `{ user, session, loading, role }` via `useAuth()` for client components.

### Admin Panel Protection (two layers)

1. **Middleware** (`proxy.ts`): redirects unauthenticated users away from `/[locale]/admin/*` to login.
2. **Admin layout** (`app/[locale]/admin/layout.tsx`): server-side double-check — re-fetches user and calls `get_my_role` RPC; redirects if not `admin`. This is the authoritative guard.

The admin panel has its own CSS file (`app/admin.css`) with dark-theme design tokens separate from the public app's `globals.css`.

### Styling

`app/globals.css` uses Tailwind v4's `@theme inline` block to register brand design tokens as CSS custom properties and Tailwind utilities:

| Token | Value | Purpose |
|---|---|---|
| `--color-nordic-dark` | `#19322F` | Primary text, headers |
| `--color-mosque` | `#006655` | CTA buttons, accents |
| `--color-hint-green` | `#D9ECC8` | Featured cards background |
| `--color-background-light` | `#EEF6F6` | App background |

Use these as Tailwind classes (`bg-mosque`, `text-nordic-dark`, etc.) in public-facing components.

`app/admin.css` uses plain CSS custom properties (`--admin-bg`, `--accent-emerald`, etc.) with semantic class names (`.admin-shell`, `.admin-stat-card`, etc.). Do not use Tailwind utilities inside admin components — use the admin CSS classes.

### Maps

Map components must be loaded with `next/dynamic` and `ssr: false`. Never import Leaflet components directly in Server Components.

### Data

Property data currently comes from mock objects in `lib/mock-data.ts`. The Supabase `properties` table exists but real data fetching is only implemented in the admin panel pages.

### Design References

`antigravity/` contains the canonical design references:
- `guidelines.md` — color palette and typography rules (use Inter; the original spec said SF Pro but Inter is what's installed)
- `best-practices.md` — architecture checklist (SSG for property detail pages, SSR for search, filters in URL, skeletons, etc.)
- `resources/` — screen-by-screen reference images and HTML mockups organized by feature

`luxu-real-state/` contains older HTML mockups for additional screens (add/edit property, favorites, schedule visit, user profile).
