# Supabase Setup — BYM Governance Platform

The frontend runs against placeholder keys (public site works; auth disabled).
Follow these steps to connect a real backend.

## 1. Create the project
1. Go to <https://supabase.com> → **New project** (region: `eu-west` or nearest).
2. Copy from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only — keep secret)
3. Paste them into `.env.local` (replace the placeholders).

## 2. Apply the schema
In the Supabase **SQL Editor**, run each migration in order:

```
0001_core.sql
0002_cin.sql
0003_parliament.sql
0004_executive_projects.sql
0005_transparency.sql
0006_governance_features.sql
0007_rls.sql
0008_auth_hook.sql
0009_storage.sql
0010_security_hardening.sql
```

Then run `seed.sql` to load the 32 communities, 7 units, 19 cabinet
positions, 12 SDGs, standing committees, and TAC placeholders.

> **Project `BekwaiYouthMovement` (npbeiffqenmzdxwmlydz) is already set up** —
> all migrations + seed + Realtime (on `votes`) have been applied.

## Make yourself an admin
After signing up at `/join`, promote your account in the SQL Editor:

```sql
update profiles
set role = 'super_admin', verification_status = 'verified'
where email = 'YOUR_EMAIL_HERE';
```

> Using the Supabase CLI instead? Place these in `supabase/migrations/`
> and run `supabase db push`.

## 3. Enable the role claim (optional but recommended)
**Authentication → Hooks → Custom Access Token** → select
`public.custom_access_token_hook`. This injects `user_role` into the JWT so
RLS and the UI can read the member's role from the token.

## 4. Auth settings
- **Authentication → Providers → Email**: enable email/password.
- For local testing you may disable "Confirm email" so new sign-ups can log in
  immediately. Re-enable it for production.

### 4a. Email delivery — read this before an enrolment drive

This is what broke registration on 29 Jul 2026. Five people signed up and none
could verify. Supabase reported no error at all: every `/signup` returned 200
and `confirmation_sent_at` was set. Supabase had handed the mail to the sender
and the **sender** dropped it, silently. Nothing in the app or the auth logs
will tell you this is happening — the only symptom is `email_confirmed_at`
staying null while people insist they never got an email.

The cause was a sandbox sender that only delivered to the account owner's own
address. So one-at-a-time test sign-ups worked perfectly and every real
applicant got nothing.

**Project Settings → Authentication → SMTP Settings.** Current provider is
**Brevo**:

| Field | Value |
|---|---|
| Host | `smtp-relay.brevo.com` |
| Port | `587` |
| Username | the **Login** shown on Brevo's SMTP & API page |
| Password | a Brevo **SMTP key** — not the account password |
| Sender email | an address verified as a sender in Brevo |
| Sender name | `Bekwai Youth Movement` |

Brevo verifies an individual email address as a sender, so it can send from a
`gmail.com` address without owning a domain. That is the reason it is here
rather than Resend, which requires a DNS-verified domain and cannot ever send
as Gmail. Free tier is ~300 emails/day.

Set the sender **name** even when the sender address is personal: recipients
read the name in their inbox list, so the mail still arrives as the movement.

Two things that are easy to miss:

- **Do not switch custom SMTP off.** It falls back to Supabase's built-in
  sender, which is capped near 2 emails/hour and is not for production — worse
  than a misconfigured provider, and it fails the same silent way.
- **Authentication → Rate Limits → "Rate limit for sending emails"** defaults
  low. Raise it before a drive or the back half of your applicants are refused.

### 4b. URL configuration

**Authentication → URL Configuration**:

- **Site URL**: `https://bekwai-youth-movement.vercel.app` — no trailing path.
  A stray `/@` here once corrupted `metadataBase` and every generated link.
- **Redirect URLs** must include `https://bekwai-youth-movement.vercel.app/**`
  and `http://localhost:3000/**`.

The allow-list is not optional. Every auth email points at
`/auth/callback`, which is the only route that redeems the `?code=` in the link
into a session; if that URL is not allowed, Supabase quietly substitutes the
Site URL, the code is never redeemed, and the member is confirmed but still
signed out.

### 4b-ii. Email templates — use token_hash, not ConfirmationURL

**Authentication → Email Templates.** The bodies to paste live in
`supabase/email-templates/` (`confirm-signup.html`, `reset-password.html`) so
they are reviewable in git; the dashboard holds the live copy.

Supabase's default templates use `{{ .ConfirmationURL }}`, which routes the
member through Supabase's own `/verify` and then hands our app a PKCE `?code=`.
Redeeming that code needs the `code_verifier` cookie from **the browser the
member signed up in** — and Gmail opens links in its own in-app browser, where
that cookie does not exist. The observable result is a member who is confirmed
but lands signed out and has to type their password. That was measured on a real
sign-up: `GET /verify` succeeded, no PKCE token exchange followed, and the
session came from `grant_type=password` 41 seconds later.

`{{ .TokenHash }}` carries its own proof, so
[app/auth/callback/route.ts](../app/auth/callback/route.ts) verifies it
server-side with `verifyOtp` and writes the session into its own cookie jar. No
cookie from the original browser is involved, so the link works from any
browser, app or device.

### 4c. The app's own email (separate system)

Auth email is Supabase's. Notifications the *app* sends — new applications,
contact messages, member verification — go through `lib/email.ts` via Resend
and are **switched off**: `RESEND_API_KEY` is unset, so `emailEnabled()` is
false and every caller degrades gracefully (applications still submit,
broadcasts save as drafts). Resend needs a DNS-verified domain, so this stays
off until BYM has one. `EMAIL_FROM` must remain that verified domain — it is a
sender, and a `gmail.com` value there is rejected outright. `EMAIL_ADMIN` is
only a recipient and can be any address.

## 5. Verify
- Register at `/join` → a row appears in `profiles` with
  `verification_status = 'pending'`.
- In the dashboard, an admin verifies the member (set `verification_status`
  to `verified` and assign a `role`) → the member's dashboard unlocks.

## Security notes
- All tables have RLS enabled. Reference data is world-readable; personal data
  is restricted to the owner and admins (Gov Doc §6.3, Ghana Data Protection
  Act 2012).
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
