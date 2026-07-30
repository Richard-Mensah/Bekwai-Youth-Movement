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
- Whether "Confirm email" should be on is a real decision, not a default to
  leave alone. See §4-0 — read it before an enrolment drive.

### 4-0. Before a mass enrolment drive: take email off the critical path

Measured on this project, 30 Jul 2026. Of the first **10 members, only 4 had
ever signed in.** That is the number that matters, and it is not a delivery
problem: by then Brevo was delivering and the link worked end to end — one
member registered at 22:51, confirmed at 22:54 and was signed in by 22:56,
unassisted. Six of the ten had to be confirmed by hand, in one `update` against
`auth.users`, and **still** never signed in.

The lesson: once mail is actually being sent, the loss is not in delivery, it is
in the number of steps. Every applicant must leave the site, find an email on a
phone, and come back. At a market-square registration desk, most will not.

**So for a drive, turn confirmation off and let people straight in.**

**Authentication → Sign In / Providers → "Confirm email" → off** (it sits under
*User Signups*, above the *Auth Providers* list — the panel has its own **Save
changes** button, and the toggle looks flipped before you press it).

> **Status: off since 30 Jul 2026**, for the enrolment drive. Verified by a real
> signup through the anon key: `signUp` returned a live session,
> `email_confirmed_at` was set immediately, `confirmation_sent_at` stayed null —
> no mail sent — and the new session could read its own profile through RLS with
> the community resolved. Turn it back on when the drive is over.

**Do not confuse this with the `Email` provider toggle** further down the same
page, under *Auth Providers*. That one is what makes email/password work at all;
switching it off breaks every registration and every sign-in at once, and there
is no OAuth provider wired into this app to fall back on. Same for *"Allow new
users to sign up"* at the top of the panel — it must stay on.

`signUp` then returns a live session and
[SignupForm](../components/features/auth/SignupForm.tsx) sends the member
directly to their dashboard — registration finishes on the site, in one sitting,
and no email needs to arrive for it to have worked.

Nothing is given away by this, because **email confirmation was never the
control that protects anything here.** Access is gated on
`profiles.verification_status`, which only an administrator can move to
`verified`, plus RLS on every table. An unconfirmed member is a row awaiting
verification either way. What is genuinely lost is the guarantee that a member
owns the address they typed, which costs two things worth knowing:

- A typo'd address gets a member who cannot reset their own password. An admin
  can correct the address in `auth.users`; the member can also be reached on the
  phone number registration already collects.
- Someone could register under an address that is not theirs. It buys them a
  `pending` account with no access, so the ceiling on the abuse is noise in the
  verification queue.

Both are recoverable. Six members who never got in are not. Turn it back on once
the drive is over — it is one toggle, and the confirmation flow below is kept
working for exactly that reason.

**Registration now sends no email at all, but password resets still do**, and
members who chose a password in a hurry at a registration desk will need them.
So the SMTP provider still has to work — it has simply stopped being able to
block a registration. Two things follow:

- Keep custom SMTP configured (§4a). With it off, Supabase's built-in sender
  takes over: capped near 2 emails/hour, and on current projects it delivers
  only to your own team, so member resets fail silently — the same invisible
  failure that cost five members on 29 Jul.
- Raise **Authentication → Rate Limits → "Rate limit for sending emails"**
  anyway. It defaults low, and a drive produces a burst of resets a day or two
  later, not on the day.

### 4-0-ii. Rescuing a member who is stuck

**Dashboard → Administration → Members directory.** Under each address the
console now shows what the login system knows, which `profiles` cannot say:
**Email not confirmed**, or **Never signed in**. Rows that are fine show nothing,
so the handful that are not stand out. A "Never signed in" stat card counts them.

That count is the one to watch during a drive. It is the number of people who
filled in the form and were lost anyway — and it read 6 out of 10 before anyone
noticed, because nothing displayed it.

Two repairs sit on each row:

- **Confirm for them** — marks the address confirmed without the member clicking
  anything. For someone whose email never arrived or expired. It proves nothing
  about the address; it records that an administrator vouched for it, which is
  why there is no "confirm everyone" button.
- **Fix address** — corrects a typo'd email. This moves *both* `auth.users.email`
  (what they sign in with) and `profiles.email` (what the directory and exports
  read), and confirms the new one. Needed more with "Confirm email" off, not
  less: nothing bounces, so a wrong address is silent, and its owner can never
  reset their own password.

Both are audited to `content_audit` — which the SQL-editor `update` that
confirmed six members by hand was not.

Both need `SUPABASE_SERVICE_ROLE_KEY` in the environment, because `auth.users` is
not exposed to RLS and no member session can reach it however the policies are
written. Without the key the directory still works and both controls explain
what is missing. On the deployed site the key must also be set in **Vercel →
Settings → Environment Variables**, followed by a redeploy — `.env.local` is
your machine only.

Two things about that key. It bypasses every RLS policy, so `lib/supabase/admin.ts`
is marked `server-only` (importing it from a Client Component fails the build
rather than publishing the key), and every action using it calls
`assertSecretariat()` — the admin layout's role gate does not cover Server
Actions, since each is its own POST endpoint that no layout runs for.

### 4-0-i. Open enrolment — members verified on arrival (TEMPORARY)

> **Active since 30 Jul 2026.** Applied as `0025_open_enrolment.sql`. **Revert
> once the domain is set up** — the statements are at the bottom of that file and
> repeated below.

New members are `verified` the moment they register, so there is no manual step
between signing up and a working dashboard. With confirmation email already off
(§4-0), registration is now: fill in the form, land on your dashboard. Nothing
waits on anybody.

**What this does not hand over.** `verification_status` is not referenced by a
single RLS *policy* — every one keys off `role` or `is_admin()`, and `role` still
defaults to `member`. Parliament, CIN, Cabinet, voting and the admin console stay
shut exactly as before. What opens is the app-level gate in
`app/dashboard/layout.tsx`: the member dashboard instead of the pending panel.

**Why `is_public` changed too.** The `public_members` view is granted to `anon`
and lists verified, opted-in members on the homepage — first name, community,
photo. `is_public` defaulted to `true`, which was only safe because reaching
`verified` required an administrator to decide. Auto-verification removes that
decision, so left alone this would publish every registrant to the public
homepage the instant they signed up, unreviewed — not acceptable for a movement
registering minors (Gov Doc §6.3; Ghana Data Protection Act 2012). New members
are therefore verified but **not listed**; the **Wall** toggle on each row of the
members directory puts them up when the Secretariat chooses. Nobody already on
the wall came off it.

Verified on a real signup after applying it:

| | |
|---|---|
| session at signup | yes |
| `verification_status` | `verified` |
| `role` | `member` (unchanged) |
| `is_public` | `false` |
| dashboard | full member dashboard |
| on public homepage | no |
| can read other profiles | no |

**To revert:**

```sql
alter table profiles alter column verification_status set default 'pending';
alter table profiles alter column is_public          set default true;
```

That affects new registrations only — members auto-verified during the drive stay
verified. To review them afterwards:

```sql
select id, full_name, email, community_id, created_at
from profiles where created_at >= '2026-07-30' order by created_at;
```

Re-enable **Confirm email** at the same time (§4-0). The two together are the
drive configuration, and leaving one half on is how you end up not knowing which
state you are in.

### 4-0-iii. Clearing the verification queue, and who may

Signing up no longer needs email, but a new member still lands `pending`, and a
drive turns that into a queue of hundreds. The members directory has a **"N
awaiting verification"** panel above the table: everyone ticked by default, untick
whoever should not be approved, verify the rest in one action. It is recorded in
`content_audit` as `bulk_verified`, which the SQL-editor `update` it replaces was
not.

The bulk sweep deliberately sends **no email**, unlike the single-member decision.
Three hundred individual sends would spend the day's quota saying something
better said once — use **Email members** on the same page for that.

Being `pending` is less limiting than it sounds, and this matters for planning a
drive: `lib/dashboard-access.ts` leaves `/dashboard/apply` and
`/dashboard/account` open, so a brand-new member can apply for office and correct
their details immediately. Only the areas conferring standing — role dashboards,
Parliament, CIN, admin — wait on verification. **Nobody is blocked on the day.**

**Verification is `admin` / `super_admin` only, and this is a database fact, not
a UI preference.** Every relevant RLS policy and the 0021 privilege-guard trigger
key off `is_admin()`, which is `role in ('admin','super_admin')`. `secretary` is
*not* in it, although `canManageContent()` admits secretaries to the rest of the
console.

That mismatch used to fail invisibly. Measured 30 Jul, signed in as each role and
updating another member's `verification_status`:

| role | error returned | rows changed |
|---|---|---|
| `member` | none | 0 |
| `secretary` | none | 0 |

RLS filters the row out rather than rejecting the statement, so PostgREST reports
success and nothing happens. A secretary could click Verify and watch the badge
not move, with nothing on screen to explain it. `canVerifyMembers()` /
`assertMemberAdmin()` in `lib/cms.ts` now refuse in the app, where a message can
be shown, and both member actions report a zero-row write as a failure rather
than a success.

If you want secretaries to verify members, promote them to `admin` — do not widen
`is_admin()`, which policies on every table depend on.

### 4a. Email delivery — how it broke once, and how to tell

> **Status: resolved.** Brevo is configured and delivering; a confirmation link
> was verified working end to end on 30 Jul 2026. Keep this section for the
> diagnosis, because the failure is silent and will look like nothing at all if
> it recurs.

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

- **Site URL**: `https://bekwaiyouthmovement.org` — no trailing path. A stray
  `/@` here once corrupted `metadataBase` and every generated link.
- **Redirect URLs** must include **all three**:
  - `https://bekwaiyouthmovement.org/**` — the live domain
  - `https://bekwai-youth-movement.vercel.app/**` — the old host, which stays
    reachable on Vercel. **Keep it.** Removing it breaks auth for anyone whose
    DNS has not caught up, and for any old link already sitting in an inbox.
  - `http://localhost:3000/**` — local development
- `https://*-bekwai-youth-movement.vercel.app/**` as well if you want auth to
  work on preview deployments.

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
