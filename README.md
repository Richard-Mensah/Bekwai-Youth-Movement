# Bekwai Youth Movement — Digital Governance Platform

A production foundation for the **BYM Youth General Assembly** digital governance
ecosystem — public website, membership/auth, role-based dashboards, and the full
Supabase schema for Sefwi Bekwai and its 31 sub-communities.

> _Volunteering for Change · Sefwi Bekwai · Western North Region · Ghana_

## Stack
- **Next.js 15** (App Router, TypeScript, Server Components)
- **Tailwind CSS** — brand theme derived from the BYM logo
- **Supabase** — Postgres, Auth, Storage, RLS (Backend-as-a-Service)
- **Recharts** — dashboard charts · **Zod** — validation · **lucide-react** — icons

## Getting started
```bash
npm install
npm run dev        # http://localhost:3000
```
The public site renders immediately with placeholder Supabase keys. To enable
authentication and dashboards with live data, follow [`supabase/README.md`](supabase/README.md).

```bash
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm run lint
```

## Structure
```
app/(public)   Public site (home, about, leadership, parliament, cin, sdgs, …)
app/(auth)     login · join (register) · verify-pending
app/dashboard  Role-based dashboards (member, cin, mp, cabinet, elder, admin)
components/     ui/ (primitives) · layout/ (chrome) · features/ (feature UI)
lib/           supabase clients, auth helper, utils, zod validations
constants/     roles, 32 communities, 19 cabinet positions, 7 units, 12 SDGs
supabase/      ordered SQL migrations + seed + setup guide
```

## What's in this iteration (Phase 1)
- Branded, SEO-ready public website + favicon/OpenGraph from the logo
- Membership registration → pending verification → admin-verified → dashboards
- 9-role RBAC, route guards, and RLS-backed schema (designed, ready to apply)
- Data model + dashboard surfaces for the 5 new governance features

See the full roadmap and architecture in the approved plan.

## Roadmap
1. **Foundation** (this) → 2. CIN → 3. Youth Parliament → 4. Cabinet & Projects
→ 5. Transparency Portal → 6. New-feature depth + mobile PWA.

## Important data note
The 31 sub-community names in `constants/communities.ts` and `supabase/seed.sql`
are **placeholders** — replace them with the real BYM community names. Counts,
IDs, and structure are correct.
