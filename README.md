# AKR Hospitals

Patient-facing website for **Dr. AKR's Multispeciality Hospital** (Madhira, Telangana): OPD booking UI, live token drawer, cashless eligibility checker, CareBot, and location/contact.

Built with Vite, React, TypeScript, Tailwind CSS, Framer Motion, and optional Supabase realtime for the OPD queue.

The homepage first fold is motion-led: animated counters, a 4-step care pathway, trust ticker, impact stats, campus capacity bars, and a live OPD queue with progress — denser spacing so the page feels rich on first look.

**Mobile-first:** ~phone layouts prioritize Book OPD above pathway/camp blocks, use 44px+ touch targets, a sticky Casualty/Book bar, and a contact FAB cleared above that bar. Nav casualty CTA dials `1066`.

## Live URLs

| URL | Status |
|-----|--------|
| https://akr-hospitals.vercel.app | **Production** (use this until custom DNS is live) |
| https://akrhospital.in | Attached in Vercel — set DNS `A` → `76.76.21.21` (or Vercel nameservers) |

Hard-refresh on phone after deploys (`pull to refresh` or clear site data) so the new JS/CSS bundle loads.

Production readiness includes TSMC/NMC registration numbers on consultant cards, NABH/ISO certificate seals, DPDP 2023 / telemedicine / BMW statutory modals, OPD triage + Indian mobile validation, `AKR-OPD-XXX` booking references, WhatsApp deep links, casualty primary click-to-call (`+91 87492 73030`), and Schema.org Hospital JSON-LD targeting `https://akrhospital.in`.

## Quick start

```bash
npm install
cp .env.example .env   # optional — site runs in demo mode without Supabase
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | No | Without it, queue falls back to demo numbers |
| `VITE_SUPABASE_ANON_KEY` | No | Must be the **anon** key only |

## Supabase (optional)

1. Create a Supabase project.
2. Apply migrations in `supabase/migrations/` (SQL editor or Supabase CLI).
3. Ensure Realtime is enabled for `opd_sessions`.
4. Seed/update a row per calendar day for the live queue.
5. **RLS:** public clients may `SELECT` only. Staff updates must use the service role / dashboard — do not reopen anon write policies.

## Demo vs production

Booking passes and walk-in tokens in the UI are **demo previews** until a real booking/token API is wired. Confirm appointments and OPD tokens at reception or by phone (`+91 87492 73030` / WhatsApp `+91 9849057185`).

## License

Private project for BSC Consulting / AKR Hospitals.
