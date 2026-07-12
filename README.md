# Neyora — Smart AI Tailoring Assistant

AI-powered tailoring platform for tailors, boutique owners, fashion designers, and fashion students.

This repo is being built in rounds.

- **Round 1** — full project scaffold + the complete animated landing page, pixel-matched to the provided design reference (matte-black theme, neon-green `#00FF88` accents, cursor glow, floating particles, glass cards).
- **Round 2** — Login / Signup / Forgot Password wired to Supabase Auth, a protected dashboard shell (sidebar + topbar), the dashboard home page with live stat cards, and the Supabase SQL schema (`profiles`, `customers`, `measurements`, `orders`) with row-level security.
- **Round 3** — Customer Management + Measurement Module: list/search/add/edit/delete customers, per-customer measurement history with a full add-measurement form (Bust, Waist, Hip, Shoulder, Arm Round, Sleeve Length, Neck, Dress Length, Height), and a global Measurement Module page across all customers.
- **Round 4** — Pattern Rule Engine, AI Pattern Generator, Fabric Calculator, and Cutting Layout. Real Gemini API integration for garment-specific stitching tips (gracefully falls back to a static cutting guide if no key is set).
- **Round 5** — Stitching Guide, Dress Library, and Design Library: step-by-step stitching instructions with time/difficulty per garment, ten dress blocks with original SVG silhouettes, and a full style reference (necklines, sleeves, collars, pockets, borders).
- **Round 6** — AI Dress Detection (upload a photo, Gemini identifies dress type/sleeve/neckline + suggests a fabric, linked back into your Dress Library) and a real multi-turn AI Chat Assistant for stitching/fabric questions.
- **Round 7** — Orders (with status pipeline), Inventory (fabric/thread/accessories with low-stock alerts), Reports (revenue, expenses, profit, best-selling dress types), and the Invoice Generator with a built-in Profit Calculator.
- **Round 8** — Referral Shopping (real Amazon.in links, ready for your affiliate tag), Voice Input (speak measurements into the form using the browser's Web Speech API), and a Multilingual UI foundation (English/Tamil/Hindi/Telugu/Malayalam/Kannada) covering the sidebar and topbar, with a persisted language switcher.
- **Round 9** — Settings (profile, business info, preferred language) and a role-gated Admin Panel (manage the shared dress type catalogue, curate stitching tutorials, view platform-wide revenue, manage user roles). **This completes every module in the original spec.**
- **Round 10** (this round, optional) — a standalone FastAPI backend (`/backend`) mirroring the Pattern Rule Engine in Python and adding server-generated PDF invoices. Not required to run the app — see `backend/README.md` for when you'd actually want it.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase/Gemini keys when you have them
npm run dev
```

Open http://localhost:3000.

### Connecting Supabase (makes auth + dashboard live)

1. Create a free project at supabase.com.
2. Copy your **Project URL** and **anon public key** into `.env.local`.
3. Open the SQL editor in your Supabase project and run, in order: `supabase/schema.sql`, `supabase/migrations/002_patterns.sql`, `supabase/migrations/003_inventory_invoices.sql`, `supabase/migrations/004_admin.sql`.
4. In Supabase → Authentication → URL Configuration, add `${NEXT_PUBLIC_APP_URL}/auth/callback` as a redirect URL.
5. Restart `npm run dev` — signup/login now create real sessions, and `/dashboard` shows live counts instead of the empty state.

### Trying the Admin Panel

New accounts default to the `owner` role. To try `/admin`, promote your own account once, in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

### Enabling AI stitching tips (optional)

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY` in `.env.local`. Without it, Pattern Studio still works fully (Pattern Rule Engine + Fabric Calculator + Cutting Layout are all deterministic, no AI needed) — you just won't see the "AI Stitching Tips" panel populated.

### Enabling Google Sign-In

The code is ready (`Continue with Google` on both `/login` and `/signup`), but Google OAuth needs a one-time setup in two places before it'll work — this can't be done from code alone:

1. **Google Cloud Console** (console.cloud.google.com) → create a project (or use an existing one) → **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type: **Web application**.
   - Authorized redirect URI: copy the exact callback URL Supabase shows you in the next step (it looks like `https://<your-project-ref>.supabase.co/auth/v1/callback`).
   - Save, then copy the **Client ID** and **Client Secret** it gives you.
2. **Supabase Dashboard** → **Authentication → Providers → Google** → toggle it on → paste in the Client ID and Client Secret from step 1 → Save.
3. Make sure `http://localhost:3000/auth/callback` is still in **Authentication → URL Configuration → Redirect URLs** (from the earlier setup step) — Google Sign-In reuses the same callback route as email confirmation.

That's it — no new environment variables needed in `.env.local`, Supabase holds the Google credentials on its side. Restart `npm run dev` and the button will work.

## What's included


**Marketing site (Round 1)**
- Framer Motion animations: staggered reveals, floating particles, magnetic buttons, scroll-triggered sections
- Custom GPU-accelerated neon cursor glow (`components/landing/CursorGlow.tsx`)
- Full landing page: Navbar, Hero, Features, Traditional-vs-Neyora comparison, How It Works timeline, Solutions, Pricing, FAQ + Contact/Newsletter, Footer

**Auth (Round 2)**
- `/login`, `/signup`, `/forgot-password` — real forms using React 19 `useActionState` + server actions (`lib/actions/auth.ts`)
- Zod validation with per-field error messages (`lib/validations/auth.ts`)
- `/auth/callback` completes email-confirmation / password-reset links
- `middleware.ts` refreshes the Supabase session every request and redirects signed-out users away from `/dashboard` and `/admin`

**Dashboard (Round 2)**
- `app/dashboard/layout.tsx` — server-rendered, redirects to `/login` if unauthenticated, loads the signed-in user's name/business
- Sidebar covering every module in the spec (Customers, Measurements, Pattern Generator, Fabric Calculator, Dress Detection, AI Chat, Orders, Inventory, Reports, Invoices, Settings, Admin) — mobile slide-in via Zustand (`store/ui-store.ts`)
- Topbar with search, notifications, profile menu, sign-out
- Live stat cards (Total Customers, Total Orders, Pending Orders, Revenue) with animated count-up, Today's Deliveries panel, quick actions — reads from `lib/data/dashboard.ts`, gracefully empty until Supabase is connected

**Customers + Measurements (Round 3)**
- `/dashboard/customers` — searchable list, add/edit/delete, contact + notes
- Per-customer measurement history with a full add-measurement form (all 9 spec fields) and real Voice Input (added in Round 8)
- `/dashboard/measurements` — global Measurement Module view across every customer

**Pattern Studio (Round 4)**
- `lib/pattern-engine/rules.ts` + `generate.ts` — the **Pattern Rule Engine**: per-dress-type drafting rules (ease, lining/lace/elastic/interfacing needs, fabric scaling, wastage) stored as data, not hardcoded per garment. Adding a new dress type is one new table/object row, not new code.
- `/dashboard/patterns/new` — cascading form (customer → measurement set → dress type) that runs the engine and saves the result
- `/dashboard/patterns/[id]` — to-scale SVG pattern diagram (front/back/sleeve with seam allowance + dart), fabric requirement breakdown, cutting layout (folding instructions, numbered cutting sequence, fabric-saving tips), AI stitching tips, and a Print/Save-as-PDF button (browser print, with a dedicated print stylesheet)
- `/dashboard/fabric-calculator` — instant standalone estimate, no customer record required
- `lib/gemini/client.ts` — real Gemini `generateContent` REST call for stitching tips; returns `null` on any failure so the UI always has a solid deterministic fallback

**Stitching Guide + Libraries (Round 5)**
- `/dashboard/dress-library` — all 10 garments from the spec, each with an original SVG silhouette, description, "best for" notes, and related neck/sleeve styles
- `/dashboard/design-library` — necklines, sleeves, collars, pockets, and borders, each with an original schematic SVG icon and a short explainer (`components/library/StyleIcon.tsx`)
- `/dashboard/stitching-guide` — per-dress step-by-step instructions generated from the same Pattern Rule Engine rules (a garment that needs lining automatically gets an "Attach Lining" step, etc.), with difficulty level and estimated total time
- Each step links to a live YouTube search for that dress + step, rather than a fixed embedded video — real, current results instead of a hardcoded link that can go stale or be wrong

**AI Dress Detection + AI Chat Assistant (Round 6)**
- `/dashboard/dress-detection` — upload or drag-and-drop a photo; Gemini's vision input (`generateGeminiVision` in `lib/gemini/client.ts`) identifies dress type, sleeve style, neckline, and suggests a fabric, then links back to the matching Dress Library entry and a one-click "Generate This Pattern"
- `/dashboard/ai-chat` — real multi-turn chat (`generateGeminiChat`) grounded with a tailoring-specific system prompt, quick-start suggestions matching the spec's examples ("How do I stitch a princess-cut blouse?", "How much fabric for a 40-inch Anarkali?")
- Both features fail *honestly* without `GEMINI_API_KEY` — a clear inline message telling you to add one, never fabricated results

**Orders, Inventory, Reports, Invoices (Round 7)**
- `/dashboard/orders` — full pipeline (Pending → In Progress → Completed → Delivered, or Cancelled) with status tabs, inline status changes, and links to a linked pattern or a one-click "Generate Invoice"
- `/dashboard/inventory` — fabric, thread, accessories, needles, zips, and buttons with category filters, inline +/− stock adjustment, and a low-stock banner driven by a per-item reorder level
- `/dashboard/reports` — total revenue/expenses/profit, order and customer counts, a 6-month revenue bar chart, and a best-selling dress types leaderboard — all real Supabase queries, rendered with a small dependency-free SVG `BarChart` component (no chart library version-compatibility risk)
- `/dashboard/invoices` — generate an invoice from any order (amount pulled in automatically), a printable customer-facing invoice (Print/Save-as-PDF), and an internal-only **Profit Calculator** (fabric + labor + accessories cost vs. total → profit and margin) that's hidden from the printed page via the `no-print` class

**Referral Shopping, Voice Input, Multilingual UI (Round 8)**
- `/dashboard/referrals` — real Amazon.in search links (fabrics, threads, machines, accessories); set `AMAZON_AFFILIATE_TAG` in `.env.local` once you've joined Amazon Associates and every link starts earning — until then it tells you so honestly instead of pretending to be monetized
- **Voice Input** on the Measurement form — click the mic, say something like *"bust 38 waist 34 sleeve length 20"*, and the matching fields auto-fill (`lib/voice/parse-measurements.ts` + the browser's native Web Speech API, no external service). Falls back to a clear "needs Chrome or Edge" message on unsupported browsers, never fakes a result
- **Multilingual UI** — a real `t()` translation system (`lib/i18n/`) covering the sidebar and topbar in all 6 languages from the spec, with a language switcher in the topbar that persists your choice. Translations are AI-provided for common UI vocabulary — worth a native-speaker pass before shipping to real customers, same as any first-draft copy. Extending coverage to more pages is just adding keys to `lib/i18n/translations.ts`

**Settings + Admin Panel (Round 9)**
- `/dashboard/settings` — update your name, business name, phone, and preferred language (saving it here updates both the database and the live UI language instantly)
- `/admin` — role-gated (checks `profiles.role === 'admin'`, with a clear "how to become admin" message otherwise, not a silent redirect):
  - **Overview** — platform-wide tailor count, customers, orders, and revenue across every account, via an admin-only RLS policy backed by a `SECURITY DEFINER is_admin()` function (no recursive-policy footgun, no service-role key needed)
  - **Dress Types** — add/delete entries in the shared catalogue every tailor's Pattern Generator and Fabric Calculator read from
  - **Tutorials** — curate a specific YouTube video for a dress + stitching step; the Stitching Guide page shows your pick first, and only falls back to a live search when nothing's been curated
  - **Users** — view every account and change roles (owner/staff/admin)

**Shared**
- Reusable `GlowButton` and `GlassCard` primitives
- `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server components/actions)

**Optional Python Backend (Round 10)**
- `/backend` — a separate FastAPI service. `POST /patterns/generate` and `POST /fabric/calculate` mirror the frontend's Pattern Rule Engine exactly; `POST /pdf/invoice` returns a real, branded PDF built with ReportLab (an alternative to the browser Print/Save-as-PDF flow already built into the frontend)
- Entirely optional — see `backend/README.md` for setup and for an honest breakdown of when you'd actually reach for it versus just using the built-in TypeScript engine

## Project structure

```
neyora/
├── app/
│   ├── (auth)/                    # login, signup, forgot-password
│   ├── auth/callback/route.ts     # email confirm / reset-link handler
│   ├── admin/                      # role-gated admin panel (overview, dress-types, tutorials, users)
│   ├── dashboard/
│   │   ├── layout.tsx              # protected shell (sidebar + topbar)
│   │   ├── page.tsx                 # dashboard home (stat cards, deliveries)
│   │   ├── customers/               # list, new, [id], [id]/edit
│   │   ├── measurements/            # global measurement module
│   │   ├── patterns/                # Pattern Studio: list, new, [id]
│   │   ├── fabric-calculator/
│   │   ├── dress-library/           # list, [slug]
│   │   ├── design-library/
│   │   ├── stitching-guide/         # list, [slug]
│   │   ├── dress-detection/         # AI image upload
│   │   ├── ai-chat/                  # AI chat assistant
│   │   ├── orders/                   # list, new, [id]
│   │   ├── inventory/                # list, new, [id]/edit
│   │   ├── referrals/                # referral shopping
│   │   ├── reports/
│   │   ├── invoices/                 # list, new, [id] (printable)
│   │   └── settings/
│   ├── layout.tsx                    # fonts, metadata, cursor glow mount
│   ├── page.tsx                       # landing page composition
│   └── globals.css                     # theme tokens, glass/grid/noise/print utilities
├── components/
│   ├── landing/, auth/, dashboard/, ui/, customers/, measurements/,
│   │   patterns/, library/, ai/, orders/, inventory/, reports/,
│   │   invoices/, admin/, settings/, i18n/
├── lib/
│   ├── actions/     # server actions, one file per domain
│   ├── data/         # read queries, one file per domain
│   ├── validations/  # Zod schemas
│   ├── content/       # static dress/design library + stitching guide + referral content
│   ├── pattern-engine/ # the Pattern Rule Engine (rules.ts, generate.ts)
│   ├── gemini/          # Gemini API client (text, vision, chat)
│   ├── voice/             # Web Speech API transcript parser
│   ├── i18n/               # translation dictionary + hook
│   └── supabase/            # client.ts, server.ts, middleware.ts
├── store/ui-store.ts    # Zustand: mobile sidebar, language (persisted)
├── supabase/
│   ├── schema.sql                       # run first
│   └── migrations/
│       ├── 002_patterns.sql
│       ├── 003_inventory_invoices.sql
│       └── 004_admin.sql
├── backend/               # optional standalone FastAPI service — see backend/README.md
├── middleware.ts
├── .env.example
├── tailwind.config.ts
└── package.json
```

## Theme tokens

| Token       | Value                     |
|-------------|---------------------------|
| Background  | `#050505`                 |
| Card        | `#111111`                 |
| Border      | `rgba(0,255,136,.18)`     |
| Primary     | `#00FF88`                 |
| Glow        | `rgba(0,255,136,.45)`     |

## Roadmap

1. ~~**Auth** — Login, Signup, Forgot Password wired to Supabase Auth~~ ✅ Round 2
2. ~~**Dashboard shell** — sidebar/topbar app layout, live stat cards~~ ✅ Round 2
3. ~~**Customer Management + Measurement Module** — CRUD screens, forms, measurement history~~ ✅ Round 3
4. ~~**AI Pattern Generator + Fabric Calculator + Cutting Layout** — Pattern Rule Engine, Gemini integration~~ ✅ Round 4
5. ~~**Stitching Guide + Dress/Design Library**~~ ✅ Round 5
6. ~~**AI Dress Detection + AI Chat Assistant** (Gemini)~~ ✅ Round 6
7. ~~**Orders, Inventory, Reports, Invoice Generator (PDF)**~~ ✅ Round 7
8. ~~**Referral Shopping, Voice Input, Multilingual UI**~~ ✅ Round 8
9. ~~**Settings + Admin Panel**~~ ✅ Round 9 — **every module in the spec is now built**
10. ~~**FastAPI backend** (pattern engine, PDF generation) as a separate service~~ ✅ Round 10 (optional — the app is fully self-contained on Next.js + Supabase without it)

**The project is complete.** All 10 rounds are done.

Every module from the original spec is built. If you want changes, additions, or a fix once you've run it locally, just ask.

## Deployment

- Frontend: Vercel (free tier)
- Database/Auth/Storage: Supabase (free tier)
- Backend (optional, `/backend`): Render or Railway (free tier)
#   N e y o r a  
 