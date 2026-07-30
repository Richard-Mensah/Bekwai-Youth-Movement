# Production Audit — Bekwai Youth Movement

**Date:** 30 July 2026 · **Project:** `npbeiffqenmzdxwmlydz` (eu-west-1) · **Branch:** `fix/registration-drive-readiness`

---

## Scope of this audit — read this first

This is **pass 1**, and it is honest about its own limits. Two things it does not contain:

- **No Lighthouse scores.** This audit ran in a terminal with no browser. Anyone
  quoting you Performance/Accessibility/Best-Practices/SEO numbers without one is
  guessing. Measurable proxies are reported instead (bundle sizes, header
  presence, label association counts, index coverage), and the real Lighthouse
  run is item 1 of the action plan.
- **No completed domain migration.** The new domain was not available at audit
  time. Every reference has been inventoried and centralised so the swap is one
  environment variable — see the Domain Migration Report.

Findings are graded **P0** (fix before real traffic), **P1** (fix this week),
**P2** (worth doing), **P3** (accepted / informational).

---

## Executive Summary

The codebase is in materially better shape than a project at this stage usually
is. Comprehensive RLS on every table, a privilege-guard trigger that defeats
self-promotion, a role-gated admin layout, graceful degradation when Supabase or
email is unconfigured, and unusually good commentary explaining *why* rather than
*what*. Quality metrics bear that out: **0 `console.log`, 3 `any` types, 3
suppression comments across the whole app**, and a clean `tsc --noEmit` and lint.

The gaps are concentrated in three places, and they are the gaps of a project
built fast and correctly rather than one built carelessly:

1. **Operational maturity is absent.** Zero tests, no CI, no CSP. Nothing
   prevents a regression reaching production except attention.
2. **The database was never tuned.** 36 unindexed foreign keys (now fixed) and 47
   policies re-evaluating `auth.uid()` per row (fix written, deliberately not
   applied).
3. **The current configuration is deliberately insecure-for-a-reason.** Email
   confirmation off and auto-verification on are correct for this week's
   enrolment drive and wrong as a steady state. They are reversible and
   documented; the risk is forgetting.

**Production Readiness Score: 78 / 100.** Fit to run the drive on today.
Not yet fit to be left unattended.

| Area | Score | Note |
|---|---|---|
| Architecture & code quality | 88 | Clean, idiomatic, well-reasoned |
| Authentication & authorization | 85 | Strong RLS; temporary open enrolment costs it |
| Database correctness | 85 | Good constraints; cascade behaviour verified |
| Database performance | 72 | FK indexes fixed; RLS initplan outstanding |
| Security posture | 74 | Headers added; no CSP; leaked-password protection off |
| SEO | 82 | Was 55 — sitemap, robots, JSON-LD all added this pass |
| Accessibility | 76 | 14 label failures fixed; no automated audit yet |
| Testing & CI | 15 | Nothing exists |
| Observability | 40 | Error boundaries only; no logging or alerting |
| Domain migration readiness | 90 | Blocked only on the domain name |

---

## Fixed in this pass

| # | Sev | Area | Finding |
|---|---|---|---|
| 1 | P1 | SEO | No `sitemap.xml` — dynamic pages discoverable only by link-crawling |
| 2 | P1 | SEO | No `robots.txt` — crawl budget spent on `/dashboard`, `/print` indexable |
| 3 | P1 | SEO | No Schema.org structured data |
| 4 | P1 | Security | No security response headers at all |
| 5 | P1 | Perf/DB | 36 foreign keys with no covering index |
| 6 | P1 | A11y | 14 form controls with a visible but unassociated label |
| 7 | P2 | Maintainability | Site origin derived in 4 places, 2 disagreeing |
| 8 | P2 | Perf | Image pipeline not emitting AVIF |
| 9 | P0 | Ops | Disk at 0 bytes free — builds failing with `ENOSPC` |

### 1–3. SEO: sitemap, robots, structured data

**Root cause.** The App Router generates these only if `app/sitemap.ts` /
`app/robots.ts` exist. Neither did.

**Fix.** [`app/sitemap.ts`](app/sitemap.ts) emits ~86 URLs: 16 static routes, 30
offices from `constants/offices.ts`, 33 communities and 7 published articles read
live from the database. [`app/robots.ts`](app/robots.ts) disallows `/dashboard`,
`/auth`, `/print`, `/api` and advertises the sitemap.
[`components/StructuredData.tsx`](components/StructuredData.tsx) emits `NGO` and
`WebSite` JSON-LD.

`/print` matters more than it looks: those routes render a named member's ID card
and appointment letter. They had nothing telling a crawler to stay out.

> **A bug caught before it shipped.** The first sitemap queried
> `cabinet_positions.slug` — a column that does not exist. It would have thrown,
> the `catch` would have swallowed it, and **every dynamic entry** — communities
> and articles included — would have silently vanished, leaving a sitemap that
> looked fine. Office slugs live in `constants/offices.ts`, which is what
> `generateStaticParams` already uses.

**Testing.** `curl /robots.txt`, `curl /sitemap.xml`; validate the JSON-LD in
Google's Rich Results Test. Queries were run against the live database as the
`anon` role — 33 communities and 7 articles readable, so the sitemap is populated
rather than silently static.

**Rollback.** Delete the three files.

### 4. No security headers

**Root cause.** `next.config.ts` had no `headers()`.

**Fix.** `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Frame-Options: SAMEORIGIN`, HSTS with a two-year max-age. Chosen because none
of the four can break a working page. `Referrer-Policy` matters specifically
because a member following an outbound link from a dashboard page was handing the
destination the path they were on, IDs included.

**Deliberately excluded: CSP.** See P1 open items.

### 5. 36 unindexed foreign keys

**Root cause.** Postgres indexes primary keys automatically and foreign keys not
at all. Every child side of every relationship was a sequential scan.

The second-order effect is the expensive one: **every `on delete cascade` scans
the child table.** Deleting one member scanned `attendance`, `votes`, `bills`,
`motions`, `approvals`, `endorsements` in turn — measurably slow during testing,
and linearly worse as the drive adds members.

**Fix.** [`0026_foreign_key_indexes.sql`](supabase/migrations/0026_foreign_key_indexes.sql),
**applied**. The list was generated from `pg_constraint` against the live
database, not guessed, and matches the 36 the Supabase advisor independently
reports.

**Rollback.** `drop index` any individually; nothing depends on them. An index
changes how a query is answered, never the answer.

Applied while tables hold single-digit rows — the cheapest this will ever be.
At scale it needs `CONCURRENTLY` and a window.

### 6. Fourteen unlabelled form controls

**Root cause.** A `<label className="block …">` beside a `<select>`/`<textarea>`
with no `id`, so nothing associated them. WCAG 2.2 **1.3.1**, **3.3.2**,
**4.1.2** — a screen reader announces the control with no name, and clicking the
label does not focus it.

Affected the CIN report form, nomination, TAC engagement, project, transparency
and bill/motion forms — **the core civic-participation flows**, i.e. exactly the
forms a member with a screen reader most needs.

**Fix.** `htmlFor`/`id` pairs derived from each control's existing `name`.
`BillForm` needed a hand fix: its field name is computed from `kind`, so the
association is derived the same way rather than hard-coded.

Verified: **0 unassociated pairs remain.** Wrapping `<label>` elements around
checkboxes were correctly identified as valid implicit labelling and left alone.

### 9. Disk exhaustion (operational)

`npm run build` failed with `ENOSPC` — **C: had 0 bytes free** of 238 GB. Cleared
942 MB of regenerable `.next` cache and `tsconfig.tsbuildinfo` to complete the
audit. **This is not fixed** — 926 MB free on a dev machine is still critical,
and it will fail again. See P0 in the action plan.

---

## Domain Migration Report

**Status: prepared, not executed.** Blocked on the domain name.

**Inventory — the entire application surface is one variable.** A full-tree
search for hardcoded hosts found exactly **one** in application code:

| File | Was | Now |
|---|---|---|
| `app/dashboard/admin/members/actions.ts` | `?? "https://bekwai-youth-movement.vercel.app"` | `SITE_URL` from `lib/site.ts` |
| `app/layout.tsx` | own `process.env` read, `?? localhost` | `SITE_URL` |

That divergence was a live latent bug: after a domain move, **every page would
have rendered the new host while member verification emails kept linking to the
old one.**

[`lib/site.ts`](lib/site.ts) is now the single source, and it also honours
`VERCEL_URL`, so preview deployments generate links to themselves — which is what
you want when testing an auth flow on a preview.

Everything else already read `NEXT_PUBLIC_SITE_URL`. Remaining matches were
intentional third parties: `bekwaiyouthmovement.medium.com` (7×, real articles),
`openstreetmap.org`, `ui-avatars.com`, `example.com` in a placeholder string.

### Migration runbook

1. Buy the domain; add it in **Vercel → Domains**; let DNS verify.
2. **Vercel → Environment Variables**: `NEXT_PUBLIC_SITE_URL=https://<new>` for
   Production. Redeploy — this alone fixes `metadataBase`, canonical URLs, OG,
   sitemap, robots and every auth email link.
3. **Supabase → Authentication → URL Configuration**: Site URL `https://<new>`
   (no trailing path); Redirect URLs must include `https://<new>/**` and
   `http://localhost:3000/**`. *Do not remove the vercel.app entry until DNS has
   fully propagated* — auth breaks for anyone still resolving the old host.
4. **Brevo**: verify the new domain as a sender. This is the upgrade that lets
   you stop sending as Gmail and finally use a `@<new>` address.
5. `supabase/README.md` §4b mentions the old host twice — update.
6. Re-submit `sitemap.xml` in Google Search Console under the new property.

**Rollback.** Revert the env var and redeploy; keep both redirect URLs
allow-listed throughout so neither host is ever broken.

---

## Supabase Audit Report

**Schema:** 26 applied migrations, RLS enabled on every table, `on delete cascade`
verified working (deleting an auth user removes the profile; 0 orphan rows
measured).

### Findings

| Sev | Finding | Status |
|---|---|---|
| P1 | 47 policies re-evaluate `auth.uid()` per row | Fix written, **not applied** |
| P1 | Leaked-password protection disabled | Dashboard toggle — yours |
| P2 | 265 `multiple_permissive_policies` warnings | Analysed, not urgent |
| P2 | `nyansapo_admissions_enquiries` — a foreign table | **Needs your decision** |
| P2 | Anonymous `INSERT` on contact/newsletter unbounded | Spam vector |
| P3 | `public_members` is SECURITY DEFINER (advisor **ERROR**) | **Correct as-is** |
| P3 | 6 `SECURITY DEFINER` helpers callable by `anon` | Effectively harmless |
| P3 | 4 unused indexes | Keep |

### P1 — `auth_rls_initplan` (47 policies, 31 tables)

Unwrapped `auth.uid()` is treated as volatile, so a policy is evaluated **once
per row scanned** instead of once per statement. On a 50,000-row `votes` table
that is 50,000 calls to answer one question whose answer cannot change.

Fix is Supabase's documented one — wrap as `(select auth.uid())`, which the
planner hoists to an InitPlan. Semantics are identical.

**Written to [`0027_rls_initplan.sql.REVIEW`](supabase/migrations/0027_rls_initplan.sql.REVIEW)
and deliberately not applied.** Three reasons:

1. **No urgency.** Benefit scales with rows scanned; the largest table holds 13.
2. **The failure mode is silent and severe.** This rewrites the expressions that
   *are* the authorization model. A regex that mangles one policy does not
   throw — it changes who can read what, with nothing on screen to say so.
3. **It needs a real test.** Correct verification is a Supabase branch plus
   per-role visibility assertions on every table — a deliberate exercise, not a
   step in a broad pass.

The file contains the guarded forward block (which raises rather than
half-finishing) and the exact reversing block.

### P3 — Two advisor findings that are *not* bugs

Worth recording, because acting on them would break production:

**`public_members` SECURITY DEFINER — flagged ERROR, correct as written.** The
view deliberately runs with owner privileges so `anon` can read a safe projection
(first name, community, photo) of `profiles` without any RLS grant on the table
itself. Setting `security_invoker = true` would make it return nothing and the
homepage members wall would go blank. The design is sound: non-PII columns only,
filtered to `verified AND is_public`. **Do not "fix" this.**

**Six `SECURITY DEFINER` helpers callable by `anon`.** `is_admin()`,
`my_community()`, `can_manage_content()` and friends take no arguments and report
only on the caller. A member calling `is_admin()` learns whether they are an
admin — which they can already tell by looking at their dashboard. No
information disclosure, so revoking is churn. Revoking is also *risky*: these are
invoked from RLS policy expressions, and getting the grants wrong breaks every
policy that depends on them. If you want them off the public API surface, the
correct move is relocating them to a non-exposed schema and rewriting the
policies — a project, not a toggle.

### P2 — `nyansapo_admissions_enquiries` does not belong to this project

An empty (0 rows, 32 kB) table in `public` with a permissive anon-INSERT policy,
from an unrelated application. Either this Supabase project is shared with
another app, or it is a leftover. **I have not touched it** — it is not mine to
judge and you asked me never to delete production data. Two questions: is another
app writing here, and does its anon-insert policy widen this project's attack
surface? If it is a leftover, drop it in a dated migration.

### P2 — Unbounded anonymous INSERT

`contact_messages` and `newsletter_subscribers` allow `WITH CHECK (true)` for
`anon`. Correct in intent — public forms must accept submissions — but there is
no length bound, so a script can insert unlimited multi-megabyte rows and fill
your database. Suggested, not applied (it is a schema change with a user-visible
failure mode and deserves its own decision):

```sql
alter table contact_messages
  add constraint contact_messages_len_ck
  check (char_length(message) <= 5000 and char_length(name) <= 200);
alter table newsletter_subscribers
  add constraint newsletter_email_len_ck
  check (char_length(email) <= 320);
```

Pair with **Supabase → Authentication → Rate Limits** and, ideally, a captcha.

---

## Security Report

**Strong.** RLS on every table. The `0021` privilege-guard trigger is genuinely
good work — it closes the column-granularity hole RLS cannot express, and I
verified it live: attempting `role = 'super_admin'` as an ordinary member was
silently reverted. The admin layout gates the whole console. The service-role key
is `server-only` and **confirmed absent from all 119 client bundle files**.
Secrets are correctly gitignored; `.env.local` is untracked.

### Open items

| Sev | Finding |
|---|---|
| P1 | No Content-Security-Policy |
| P1 | Leaked-password protection disabled in Supabase |
| P1 | Open enrolment + no email confirmation (temporary, documented) |
| P2 | No rate limiting on public forms or Server Actions |
| P2 | `public` storage bucket permits listing |

**CSP** is the significant one and was excluded on purpose. `app/layout.tsx`
inlines a theme-flash script and Next injects its own bootstrap, so a correct
policy needs per-request nonces threaded through the document via middleware. A
wrong CSP takes the site down. It deserves its own change and its own test pass.

**Leaked-password protection** is a single toggle:
**Authentication → Sign In / Providers → Email → Prevent use of leaked
passwords.** It checks HaveIBeenPwned on signup. For a drive registering hundreds
of people who will reuse a password, this is the highest security-per-click
available — and worth doing *before* the drive, not after.

**A finding fixed earlier this session, recorded here for completeness:** the
member-verification actions had no role check and relied on RLS alone. Because
RLS *filters* rather than *rejects*, a `secretary` clicking Verify got
`ok: true` and no change — a silent authorization failure. Measured: `member` and
`secretary` both returned no error and 0 rows changed. Now guarded by
`assertMemberAdmin()`, with zero-row writes treated as failure.

---

## Performance Report

**Measured** (`next build`):

| Metric | Value | Assessment |
|---|---|---|
| Shared JS (all routes) | **102 kB** | Good — under the 130 kB rule of thumb |
| Largest public route | `/` at 148 kB first load | Acceptable |
| Middleware | 90.4 kB | Runs on every non-static request — watch it |
| Heaviest routes | `/join` 196 kB, `/login` 195 kB | Auth pages ship the community list |

**Fixed:** 36 FK indexes; AVIF ahead of WebP (this site is mostly photography and
Vercel transforms at the edge).

**Outstanding:**

- **P1** `auth_rls_initplan` — above.
- **P2** Middleware at 90 kB runs on nearly every request. It matches everything
  except static assets, so it executes on `/robots.txt` and `/sitemap.xml` too.
  Narrowing the matcher to `/dashboard`, `/auth` and the pages needing session
  refresh would cut edge invocations materially.
- **P2** `/join` at 196 kB ships all 33 communities into the client bundle.
  Acceptable, but it is the page every drive registrant loads first, on a phone,
  on Ghanaian mobile data. Worth measuring before optimising.
- **P2** Only one `loading.tsx` and one `error.tsx`, both at root. Every dashboard
  route is `force-dynamic`, so a slow query shows nothing until it completes.
  Per-segment `loading.tsx` would give the console perceived responsiveness.
- **P3** 265 `multiple_permissive_policies`. Postgres `OR`s permissive policies
  for the same role/action, so both are evaluated. The pattern here is deliberate
  (`*_pub_read` + `*_admin_write` per table) and consolidating means merging
  hand-written policies — high risk, low reward. Leave.

---

## SEO Report

**Was weak in exactly one dimension and strong in the rest.** `metadataBase`,
title templates, OG, Twitter cards, `manifest.ts`, `themeColor` and per-page
`generateMetadata` were all correct. What was missing was everything that tells a
crawler what exists: no sitemap, no robots, no structured data. All three added.

**Remaining:**

- **P2** No `alternates.canonical`. With a domain move imminent this matters: the
  old vercel.app host will remain reachable, and without canonicals you will be
  competing with yourself for the same content.
- **P2** OG image is `logo.jpg` at 1042×1042. Social cards want **1200×630**; a
  square is letterboxed and looks unfinished when shared on WhatsApp — which is
  how this will actually spread in Sefwi Bekwai.
- **P2** `twitter.card` is `summary` (small thumbnail). `summary_large_image`
  earns far more attention for the same effort.
- **P3** Root description says "32 sub-communities"; the database holds **33**
  and `COMMUNITY_COUNT` derives 33 from the constant. Possibly correct (33 rows
  may include Sefwi Bekwai town itself, which is not a *sub*-community) — flagged,
  deliberately not changed, because only you know which framing is right.

---

## Accessibility Report

**Fixed:** 14 unassociated form controls (above) — the highest-severity class of
a11y defect, on the core participation forms.

**Verified good:** every `<img>` has `alt` (the single raw `<img>` is a blob
preview with a legitimate `eslint-disable`, and it is labelled); `next/image`
used in 33 files; no icon-only buttons missing `aria-label`; the shared `Input`
component always renders `<label htmlFor>` and sets `aria-invalid` on error;
`lang="en"` present; `prefers-color-scheme` honoured with a no-flash script.

**Not verified — and I will not claim otherwise:**

| Sev | Item |
|---|---|
| P1 | No automated audit run (axe/Lighthouse) — needs a browser |
| P1 | Colour contrast unmeasured. `text-ink/40` and `text-ink/45` on light backgrounds are very likely below the 4.5:1 required by 1.4.3, and this design system uses low-opacity text heavily |
| P2 | Keyboard-only traversal untested; no visible skip-link to main content |
| P2 | Focus-visible rings present on buttons; not confirmed across all custom controls |
| P2 | Screen-reader pass never done |

Contrast is the one I would prioritise. It is systemic rather than incidental —
opacity-based muted text appears throughout — so it is a design-token decision,
not a per-component fix.

---

## Technical Debt Report

| Sev | Item | Cost of leaving it |
|---|---|---|
| **P0** | **0 tests, no CI** | Nothing stops a regression reaching production but attention. Every fix in this audit was hand-verified; none of it is protected |
| P1 | No observability | `error.tsx` shows a message; nobody is told. A broken registration on drive day is discovered by a member complaining |
| P2 | Placeholder image hosts in `next.config.ts` | `picsum.photos`, `unsplash`, `ui-avatars` still allow-listed. Harmless, but it is remote-image trust you do not need |
| P2 | `nextjs-llm-instructions.md` (17 kB) in repo root | Scaffolding artefact |
| P2 | Duplicate migration numbers: two `0016_`, two `0017_` | Ambiguous apply order; a fresh environment may not reproduce this one |
| P3 | 3 `any`, 3 suppressions | Genuinely low. Not worth chasing |

**On tests:** the highest-value first test is not a unit test. It is one
end-to-end assertion that a member can register, sign in, and submit an
application — the flow this entire session was spent repairing, currently
protected by nothing. The verification scripts already written in this session are
most of that test.

---

## Prioritized Action Plan

### P0 — before real traffic

1. **Free disk space.** 926 MB free of 238 GB. Builds already failed once with
   `ENOSPC`; deploys and `git` operations will fail unpredictably. Not a code fix.
2. **Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel** if not already done, else the
   members console loses login-state and both repair actions in production.

### P1 — this week

3. **Enable leaked-password protection** (one toggle) — before the drive.
4. **Run Lighthouse** on `/`, `/join`, `/leadership/apply` and record real
   numbers. Everything in the Performance and Accessibility sections above is
   inference until you do.
5. **Measure colour contrast** on the muted-text tokens; raise the opacities that
   fail 4.5:1.
6. **Add CSP** with nonces via middleware. Its own change, its own test pass.
7. **Apply `0027_rls_initplan`** on a Supabase branch with per-role assertions,
   then merge.
8. **Add CI**: `tsc --noEmit`, `next lint`, `next build` on every push. An
   afternoon, and it protects everything above permanently.
9. **Revert the drive configuration** once the domain is up — both halves
   together: `verification_status` default back to `pending`, `is_public` back to
   `true`, and re-enable Confirm email. Documented in `supabase/README.md` §4-0-i.

### P2 — this month

10. Domain migration runbook (above) once the domain exists.
11. Canonical URLs; 1200×630 OG image; `summary_large_image`.
12. Narrow the middleware matcher.
13. Length constraints on public-form inserts; rate limiting.
14. Resolve `nyansapo_admissions_enquiries` — **needs your answer first**.
15. Per-segment `loading.tsx` for dashboard routes.
16. First end-to-end test: register → sign in → apply.
17. Renumber the duplicate `0016`/`0017` migrations.

### P3 — backlog

18. Error tracking (Sentry or Vercel's).
19. Storage bucket listing restriction.
20. Drop placeholder image hosts once real assets are in.

---

## Questions only you can answer

1. **What is the new domain?** Everything in the Domain Migration Report is ready
   and waiting on this one string.
2. **`nyansapo_admissions_enquiries`** — another app sharing this project, or a
   leftover to drop?
3. **"32 sub-communities" vs 33 rows** — which is the correct public framing?
4. **Should the 13 existing members stay on the public homepage wall?** They were
   created under the old `is_public = true` default. New members now default to
   off.
