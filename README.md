# AKR Hospitals

Patient-facing website for **Dr. AKR's Multispeciality Hospital** (Madhira, Telangana): OPD appointment requests, optional live OPD queue, cashless eligibility checker, CareBot, and location/contact.

Built with Vite, React, TypeScript, Tailwind CSS, Framer Motion, and optional Supabase (appointment requests + realtime OPD queue).

**Mobile-first:** phone layouts put the appointment form above the pathway/camp blocks, use 44px+ touch targets, a sticky Casualty/Book bar, and a contact FAB cleared above that bar. Casualty CTAs dial the hospital casualty line (`+91 87492 73030`); 108 (govt. ambulance) is the secondary option.

**Content rule:** only facts confirmed by the hospital go on the site. Unconfirmed items are left out and tracked as `TODO(hospital)` in `src/data/`.

## Live URLs

| URL | Status |
|-----|--------|
| https://akr-hospitals.vercel.app | **Production** — canonical URL, sitemap and JSON-LD point here for now |
| https://akrhospital.in | Attached in Vercel — set DNS `A` → `76.76.21.21` (or Vercel nameservers) |

When `akrhospital.in` resolves to Vercel, replace `https://akr-hospitals.vercel.app` with `https://akrhospital.in` in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Quick start

```bash
npm install
cp .env.example .env   # optional — without Supabase, requests fall back to WhatsApp/call
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
| `npm run check` | Assert-based self-checks (camp expiry, booking reference, mobile validation) |

## Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | No | Without it, the form shows "Couldn't submit online" with WhatsApp/call, and the live queue is hidden |
| `VITE_SUPABASE_ANON_KEY` | No | The **anon / publishable** key only — never the service_role / secret key |

## How appointments work

1. The patient fills the form (name, mobile, reason, department, optional doctor, preferred day/time).
2. The request is inserted into `appointment_requests` (insert-only for the public; rate-limited per mobile and globally).
3. The patient sees **Request received** + a reference like `AKR-7KQ2MX`, with an optional WhatsApp copy.
4. Reception opens Supabase → Table Editor → `appointment_requests`, filters `status = new`, calls the patient, then sets `status` to `confirmed`, `cancelled` or `no_answer`.

If Supabase is missing or the insert fails, the patient is told so and offered a prefilled WhatsApp message or a call — nothing is silently lost.

## Live OPD queue (optional)

The queue is shown **only** when reception publishes today's row; otherwise the site never shows token numbers.

- Each OPD morning, in Table Editor → `opd_sessions`, insert a row with `session_date` = today.
- Update `current_token_served` as tokens are called; set `is_paused` during breaks.
- Patients enter the number from their reception slip to see how many are ahead (no time estimates).

## Supabase setup (free tier, ~10 minutes)

1. Sign up at [supabase.com](https://supabase.com) → **New project**. Region: **Mumbai (ap-south-1)**. Save the database password somewhere safe.
2. **SQL Editor** → run each file in `supabase/migrations/` **in filename order** (paste → Run).
3. **Database → Publications → `supabase_realtime`**: confirm `opd_sessions` is listed (the first migration adds it).
4. **Project Settings → API**: copy the **Project URL** and the **anon / publishable** key.
5. **Vercel → Project → Settings → Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production (and Preview if wanted), then **Redeploy**.
6. Test: submit a request on the live site → it appears in `appointment_requests`.
7. Optional: **Database → Webhooks** on `appointment_requests` INSERT → n8n / email / Telegram so reception is alerted instantly instead of checking the table.

**RLS:** public clients may `SELECT` `opd_sessions` and `INSERT` `appointment_requests` — nothing else. Staff use the dashboard (service role). Do not add anon read/update policies.

## Analytics & security

- Vercel Web Analytics script is included (`/_vercel/insights/script.js`); enable it in Vercel → Project → **Analytics**.
- Security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) live in `vercel.json`. If you add a new third-party script, image host or iframe, update the CSP there.

## License

Private project for BSC Consulting / AKR Hospitals.
