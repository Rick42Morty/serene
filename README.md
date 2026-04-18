# Serene

A private, calm space for your thoughts — mood journaling with an empathetic AI vibe check.

Log how you feel, pick a few context tags, write a reflective note, and receive a warm one-to-two sentence reflection streamed in real time. The **Insights** page shows your weekly mood distribution and top tags — hit **Reflect with AI** to get a gentle, streamed summary and advice based on your stats. Every entry is scoped to its author via Postgres row-level security, so a compromised API key can't leak another user's journal.

## Tech stack

| Layer            | Choice                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, Turbopack, `output: "standalone"`)        |
| UI               | **React 19.2**, **Tailwind CSS v4**, **shadcn/ui** (base-nova preset) |
| Backend & auth   | **Supabase** — Postgres + GoTrue email/password, RLS-enforced         |
| Auth integration | **`@supabase/ssr`** (PKCE flow, wired through Next.js `proxy.ts`)     |
| AI               | **Vercel AI SDK 6** + **OpenAI `gpt-5.4-mini`**, streamed over fetch  |
| Charts           | **Recharts**                                                          |
| Validation       | **Zod**                                                               |

## Architecture

```
Browser (React 19)
   │
   ├─▶ Next.js 16 server actions & SSR
   │        │
   │        ├─▶ @supabase/ssr ─▶ Supabase (Postgres + GoTrue, RLS-enforced)
   │        │
   │        ├─▶ /api/vibe-check ─▶ OpenAI gpt-5.4-mini (SSE stream)
   │        │
   │        └─▶ /api/insights-reflect ─▶ OpenAI gpt-5.4-mini (SSE stream)
   │
   └───── reads SSE from /api/vibe-check & /api/insights-reflect for live reflections
```

Single table — `public.entries` — stores mood, tags, note, and AI response per row. Four RLS policies (select / insert / update / delete) check `auth.uid() = user_id`, so direct REST queries with a stolen API key still return nothing.

## Run locally

Requires [Docker](https://docs.docker.com/get-docker/). One command brings up Postgres, GoTrue, PostgREST, Kong (API gateway), and the Next.js app.

```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=sk-...

docker compose up           # first run, or when nothing has changed
docker compose up --build   # after editing source, Dockerfile, or package.json
```

The first form reuses the cached `web` image; the second rebuilds it so code changes take effect.

Visit <http://localhost:3000> and sign up — email confirmation is auto-accepted locally.

| Service | Host port | Purpose                                                                                   |
| ------- | --------- | ----------------------------------------------------------------------------------------- |
| `web`   | 3000      | Next.js app                                                                               |
| `kong`  | 54321     | Supabase API gateway (matches `NEXT_PUBLIC_SUPABASE_URL`)                                 |
| `db`    | 54322     | Postgres 17 — `psql postgres://postgres:postgres@localhost:54322/postgres` to poke around |

Stop with `docker compose down`. Migrations in `supabase/migrations/*.sql` only run on a fresh volume, so use `docker compose down -v` before `up` after editing them.

### Faster frontend loop (optional)

Run only Supabase in Docker and the Next.js app on the host:

```bash
docker compose up db auth rest kong   # backend only
npm install
npm run dev                           # hot-reload on :3000
```

Next.js picks up the same `.env`.

## Deploy

### 1. Provision a Supabase project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard) and apply the migration in **one** of two ways:

- **SQL Editor (no tooling).** Open **SQL Editor → New query**, paste the contents of [`supabase/migrations/20260416000000_init.sql`](./supabase/migrations/20260416000000_init.sql), and run it. Verify: **Table Editor** should now list `public.entries` with RLS enabled.
- **Supabase CLI.**
  ```bash
  supabase link --project-ref <your-ref>
  supabase db push
  ```

Then in **Auth → URL Configuration**, add `https://<your-domain>/auth/callback` to the redirect allow list.

### 2. Deploy the app

The repo ships a production `Dockerfile`, so any container host works. Railway example: push to GitHub, link the repo in Railway, set the env vars below — it picks up the `Dockerfile` automatically.

| Variable                        | Where to find it                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → **Publishable key** (`sb_publishable_…`) |
| `NEXT_PUBLIC_SITE_URL`          | Your deployed URL (e.g. `https://…up.railway.app`)                                |
| `OPENAI_API_KEY`                | OpenAI dashboard                                                                  |
| `OPENAI_MODEL`                  | `gpt-5.4-mini` (or any model your key has access to)                              |

`NEXT_PUBLIC_*` vars are inlined into the client bundle at build time — Railway passes service env vars into the Docker build automatically, so setting them on the service is enough. On other hosts (Fly, Render, etc.), pass them via `--build-arg` or your host's equivalent.

## Scripts

| Command         | What it does                   |
| --------------- | ------------------------------ |
| `npm run dev`   | Next.js dev server (Turbopack) |
| `npm run build` | Production build               |
| `npm run start` | Serve the production build     |
| `npm run lint`  | ESLint                         |

## Safety note

Serene is a reflective journaling tool, not a clinical product. If you're in crisis, please reach out to a trained human — in the US & Canada call or text **988**, in the UK call **111**, or visit <https://findahelpline.com> for international lines.
