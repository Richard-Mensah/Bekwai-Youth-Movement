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

#### The live design: the Send Email Hook

**Auth email is composed and sent by this app**, over BYM's own mail server, via
[`app/api/auth/send-email/route.ts`](../app/api/auth/send-email/route.ts).

Supabase's Send Email Hook replaces its built-in sending: with the hook enabled,
Supabase stops sending auth mail and POSTs the token to us instead. Precedence,
from the docs:

| Email Provider | Auth Hook | Result |
|---|---|---|
| Enabled | Enabled | **Auth Hook sends (SMTP not used)** |
| Enabled | Disabled | SMTP sends (custom if configured, else built-in) |
| Disabled | either | Email signups disabled |

So the SMTP panel below is not redundant — it is the fallback *behind* the hook,
and disabling the hook is a one-toggle recovery that needs no deploy.

**Setting it up:**

1. Deploy first, so `/api/auth/send-email` exists.
2. **Authentication → Hooks → Send Email Hook** → HTTPS →
   `https://bekwaiyouthmovement.org/api/auth/send-email` → generate a secret.
3. Put that secret in **Vercel** as `SEND_EMAIL_HOOK_SECRET`, whole, including the
   `v1,whsec_` prefix. Redeploy.
4. Enable the hook.

Order matters: enabling the hook before the secret is deployed means every
request is rejected with 401 and **no auth email is sent at all**.

The hook is authenticated by HMAC signature (Standard Webhooks), verified in
[`lib/webhook-signature.ts`](../lib/webhook-signature.ts) against the raw request
body. Without that check the endpoint would be a spam relay sending from a
domain we spent DNS records earning.

Message bodies live in [`lib/auth-emails.ts`](../lib/auth-emails.ts), ported from
`supabase/email-templates/` and still built around `token_hash` — see §4b-ii for
why that matters. The dashboard's own Email Templates are **not used** while the
hook is on.

#### Why this could not be done with nodemailer alone

A distinction that costs a day if it is missed. **Two separate senders, and only
one of them is ours to write:**

| Email | Sent by | Configured in |
|---|---|---|
| Confirm signup, password reset, email change | **Supabase's own server** | Supabase dashboard → SMTP Settings |
| Welcome, contact alerts, verification notices, broadcasts | **Our Next.js code** (`lib/email.ts`) | `SMTP_*` env vars |

`nodemailer` in `lib/email.ts` handles the second row and **cannot touch the
first**. Supabase generates and dispatches confirmation and reset mail inside its
own infrastructure; our code is never invoked and has nothing to intercept. The
only lever on that traffic is the SMTP panel below.

So "use our own mail server, not a third party" is achievable for **both** — but
it takes two separate configurations, not one.

**With "Confirm email" ON and no custom SMTP set, registration is broken.**
Supabase falls back to its built-in sender, which is capped near 2–4 emails/hour
and on current projects delivers only to the project team's own address. Measured
on this project 30 Jul 2026, 2:06 PM: signup returned no session and
`confirmation_sent_at` was set — Supabase had handed the mail off and it went
nowhere a member could read. Identical to the 29 Jul failure.

#### Option A — point Supabase at BYM's own mail server (no third party)

**Project Settings → Authentication → SMTP Settings:**

| Field | Value |
|---|---|
| Host | `s44.srvx.ws` — **not** `mail.bekwaiyouthmovement.org` until DOMAIN.md §2 is done; that name still resolves to Vercel |
| Port | `465` |
| Username | `info@bekwaiyouthmovement.org` |
| Password | that mailbox's password (cPanel → Email Accounts) |
| Sender email | `info@bekwaiyouthmovement.org` |
| Sender name | `Bekwai Youth Movement` |

The mailbox must exist in cPanel first, and sending works before the MX fix —
that fix is only needed to *receive* replies.

Two things to know before choosing this:

- **No DKIM.** Checked 30 Jul: no `default._domainkey`, `mail._domainkey` or
  `cpanel._domainkey` is published, so mail from this server is unsigned. SPF
  still passes (the apex record authorises `107.161.174.15` and MailChannels), so
  DMARC will pass on SPF alignment alone — but Gmail treats a signed message more
  kindly. Fix with **cPanel → Email Deliverability → Manage → DKIM**, which
  generates and publishes the record for you.
- **Shared-host sending limits.** These are typically a few hundred messages per
  hour or per day and are not published anywhere you will find in a hurry. Ask
  SecureHostify what the cap is *before* a drive of 300 members, not during.

#### Option B — point Supabase at Resend

`bekwaiyouthmovement.org` is DNS-verified in Resend (DKIM + the `send.` SPF/MX
pair, region `eu-west-1`), which makes this the better *deliverability* choice:
DKIM-signed, dedicated sending reputation, per-message logs, and a quota you can
actually read. The trade is a third party in the path.

`bekwaiyouthmovement.org` is now DNS-verified in Resend (DKIM + the `send.`
SPF/MX pair, region `eu-west-1`). That makes Resend the better choice than Brevo
for **both** systems, which collapses a long-standing source of confusion in this
project: auth email and app email finally travel the same path, from the same
verified sender, with one place to look when something does not arrive.

**Project Settings → Authentication → SMTP Settings:**

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` — the literal word, not an email address |
| Password | your Resend **API key** (`re_…`), the same one in `RESEND_API_KEY` |
| Sender email | `info@bekwaiyouthmovement.org` |
| Sender name | `Bekwai Youth Movement` |

Three things people get wrong here:

- **Username is literally `resend`.** Not the sender address, not the account
  email. Resend's SMTP bridge authenticates the API key as the password.
- **Do not switch custom SMTP off** to "test" it. Supabase falls back to its
  built-in sender, which is capped near 2 emails/hour and on current projects
  only delivers to your own team — so it looks like it works for you and silently
  fails for everyone else. That is the exact shape of the 29 Jul failure.
- **The sender address must be at the verified domain.** A `gmail.com` sender is
  rejected outright by Resend however the mailbox is owned.

Once set, Supabase sends password resets and (if re-enabled) confirmations
directly through Resend, and they appear in the Resend dashboard's **Logs**
alongside the app's own mail — which is the first time in this project that a
missing auth email has been diagnosable rather than invisible.

Note this is independent of `RESEND_API_KEY` in the app environment. Supabase
holds its own copy of the key in the SMTP panel; setting one does not set the
other, and rotating the key means updating both.

#### Previous provider — Brevo

Kept for reference; still valid if you prefer it, and still the right answer for
a project with no domain.

**Project Settings → Authentication → SMTP Settings:**

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

### 4b-i. Google sign-in

Enabled so a member can join without inventing a password. Two mistyped fields
disappear with it: the email address (which is where a confirmation goes to die)
and a password chosen in a hurry and forgotten by the next visit. Google supplies
a verified address; the member supplies nothing.

**Nothing about this lives in the code repository.** There is no environment
variable to set — the client secret is held by Supabase, which is the point.
`SUPABASE_SERVICE_ROLE_KEY` remains the only server-side secret the app holds.

#### Step 1 — Google Cloud Console

1. <https://console.cloud.google.com> → create a project (any name; BYM works).
2. **APIs & Services → OAuth consent screen**
   - User type **External**, then **Create**.
   - App name `Bekwai Youth Movement`, support email `info@bekwaiyouthmovement.org`.
   - **Authorised domains**: `bekwaiyouthmovement.org` **and** `supabase.co` —
     the second is the one people forget, and Google rejects the credential
     later without explaining which domain was missing.
   - Publish the app (**Publishing status → Publish**). Left in *Testing*, only
     addresses added by hand can sign in, which fails silently for everyone else
     with "access blocked".
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type **Web application**.
   - **Authorised JavaScript origins**: `https://bekwaiyouthmovement.org`
   - **Authorised redirect URI** — exactly one, and it is Supabase's, not ours:

     ```
     https://npbeiffqenmzdxwmlydz.supabase.co/auth/v1/callback
     ```

     This is the single most common mistake. The instinct is to enter
     `https://bekwaiyouthmovement.org/auth/callback`, because that is where the
     member ends up. Google never redirects there. Google returns to *Supabase*,
     Supabase mints the session and only then bounces to our `/auth/callback`.
     Get this wrong and Google shows `redirect_uri_mismatch` before the member
     sees anything of ours at all.
4. Copy the **Client ID** and **Client secret**.

#### Step 2 — Supabase

**Authentication → Sign In / Providers → Google** → enable, paste both values,
**Save**. Leave "Skip nonce check" off.

#### Step 3 — nothing

No deploy, no environment variable, no code change. The button on `/login` and
`/join` is already shipped; it starts working the moment the provider is enabled,
and it shows Supabase's own error if it is not.

#### What Google does not know

A Google account proves an email address and offers a name. It cannot say which
of the 33 communities somebody belongs to — and community is what decides who
represents them, populates the community wall, and scopes every per-community
report. So an OAuth member is created with `community_id` NULL and diverted to
`/complete-profile` for four fields before the dashboard opens.

The gate is `needsProfile` in `lib/auth.ts`, and it is deliberately narrow:

- **Community only.** Phone, gender and date of birth are asked for on the same
  form but do not stand between a member and their dashboard.
- **Ordinary members only.** Staff roles are conferred by an administrator, and
  the `super_admin` account predates the community field being collected — it has
  no community to this day. Gating every role would have met the one account that
  can repair things with a form it must complete before reaching the console.

Migration `0030_oauth_profiles.sql` makes the new-user trigger tolerate what a
provider actually sends: the name falls back `full_name` → `name` → the local
part of the email, so a member is never created called "".

#### Redirect URLs

Google sign-in reuses `/auth/callback` unchanged — the same route the emailed
links use, because OAuth returns the same `?code=` that PKCE does. The allow-list
in 4b above already covers it. If you add a domain later, add it there or Google
sign-in breaks with it.

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
