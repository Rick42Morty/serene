# Serene

A private, calm space for your thoughts — mood journaling with an empathetic AI vibe check.

Log how you feel, pick a few context tags, write a reflective note, and receive a warm one-to-two sentence reflection streamed in real time. Your entries are yours alone — enforced at the database level with row-level security.

## Tech stack

| Layer            | Choice                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, Turbopack, `output: "standalone"`)         |
| UI               | **React 19.2**, **Tailwind CSS v4**, **shadcn/ui** (base-nova preset)  |
| Backend & auth   | **Supabase** — Postgres + GoTrue email/password + RLS                  |
| Auth integration | **`@supabase/ssr`** (PKCE flow, wired through Next.js `proxy.ts`)      |
| AI               | **Vercel AI SDK 6** + **OpenAI `gpt-5.4-mini`**, streamed over fetch   |
| Charts           | **Recharts**                                                           |
| Validation       | **Zod**                                                                |

## Architecture

```
Browser (React)
   │
   ├── server actions & SSR ──▶ Next.js 16 (Node runtime)
   │                                  │
   │                                  ├── @supabase/ssr (cookies + PKCE)
   │                                  │        │
   │                                  │        └──▶ Supabase (Postgres + auth, RLS)
   │                                  │
   │                                  └── /api/vibe-check ──▶ OpenAI gpt-5.4-mini (SSE stream)
   │
   └── Fetches SSE text stream from /api/vibe-check for live reflections
```

Each `entries` row carries its owner's `user_id`. Four RLS policies (select / insert / update / delete) let a user touch only their own rows, so a compromised anon key or a direct REST query still can't leak another user's journal.

## Local development

### Option A — Supabase CLI (recommended for contributors)

Requires [Docker](https://docs.docker.com/get-docker/) and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (`brew install supabase/tap/supabase`).

```bash
# 1. Install JS deps
npm install

# 2. Copy env template
cp .env.example .env.local
# Then edit .env.local and set OPENAI_API_KEY=sk-...

# 3. Start the full local Supabase stack (Postgres, GoTrue, PostgREST, Studio on :54321–:54324)
supabase start

# 4. Apply migrations
supabase db reset   # wipes + re-runs supabase/migrations/*.sql

# 5. Start the Next.js dev server
npm run dev
# → http://localhost:3000
```

Supabase Studio is available at <http://localhost:54323> for browsing rows directly.

### Option B — `docker-compose up` (zero tooling beyond Docker)

```bash
cp .env.example .env
# Edit .env to set OPENAI_API_KEY=sk-...

docker-compose up --build
```

This brings up:

| Service  | Port  | Purpose                         |
| -------- | ----- | ------------------------------- |
| `web`    | 3000  | The Next.js app                 |
| `kong`   | 54321 | Supabase API gateway            |
| `auth`   | —     | GoTrue (email/password auth)    |
| `rest`   | —     | PostgREST (data API)            |
| `db`     | 54322 | Postgres 17 with schema applied |
| `studio` | 54323 | Supabase Studio                 |

After the first `docker-compose up`, visit <http://localhost:3000> and sign up — email confirmation is auto-accepted in local mode.

## Deployment (Railway)

1. Push the repo to GitHub and link it in Railway. Railway detects the `Dockerfile`.
2. Create a [Supabase project](https://supabase.com/dashboard) for production and run `supabase db push` from your machine to apply the migration.
3. In Railway, set the service env vars:

   | Variable                        | Where to find it                                      |
   | ------------------------------- | ----------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Settings → API → Project URL               |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` public key         |
   | `NEXT_PUBLIC_SITE_URL`          | Your Railway-assigned URL (`https://…up.railway.app`) |
   | `OPENAI_API_KEY`                | OpenAI dashboard                                      |
   | `OPENAI_MODEL`                  | `gpt-5.4-mini` (or any model your key has access to)  |

   `NEXT_PUBLIC_*` vars are inlined at build time — Railway automatically passes service env vars into the Docker build, so setting them on the service is enough.

4. In Supabase → Auth → URL Configuration, add `https://<your-railway-domain>/auth/callback` to the allow list.

## Environment variables

See [`.env.example`](./.env.example). The local `NEXT_PUBLIC_*` keys are the stable anon/service keys the Supabase CLI generates for every local instance — safe to commit. Never commit a real `.env` with an OpenAI key or a hosted Supabase service-role key.

## Verification checklist

- [ ] Sign up with a new email — gets redirected to `/dashboard`
- [ ] Log an entry with ≥ 50 chars — AI reflection streams in
- [ ] Reload the entry detail page — AI response persists
- [ ] Edit mood → card recolors; delete → confirm dialog removes the entry
- [ ] `/insights` shows a bar chart after ≥ 1 entry
- [ ] Open a private window → `/dashboard` redirects to `/login`
- [ ] Query `entries` in Studio as another user — RLS blocks it
- [ ] Submit an empty/gibberish note to `/api/vibe-check` — friendly fallback, no OpenAI call
- [ ] Trigger word in note — response ends with the crisis-resources disclaimer
- [ ] Chrome DevTools → iPhone SE (375 × 667): every screen renders without horizontal scroll, tap targets are comfortable, save bar clears the home indicator

## Scripts

| Command         | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start Next.js with Turbopack |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | ESLint                       |

## Safety note

Serene is a reflective journaling tool, not a clinical product. If you're in crisis, please reach out to a trained human — in the US & Canada call or text **988**, in the UK call **111**, or visit <https://findahelpline.com> for international lines.
