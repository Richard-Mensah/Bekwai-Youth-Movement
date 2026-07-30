# Domain, DNS and Email — bekwaiyouthmovement.org

Measured live on 30 July 2026. Everything below was verified by querying DNS
against `8.8.8.8` and requesting the site, not by reading a dashboard.

---

## Current state

| Check | Result | Verdict |
|---|---|---|
| `A` apex → `216.198.79.1` | Vercel anycast IP | ✅ done |
| `CNAME www` → apex | resolves to the Vercel IP | ✅ works |
| `https://www.bekwaiyouthmovement.org` | **HTTP 200** | ✅ **site is live** |
| `https://bekwaiyouthmovement.org` | HTTP 308 → `www` | ⚠️ see §1 |
| `resend._domainkey` TXT | DKIM public key present | ✅ done |
| SPF (apex TXT) | `v=spf1 +a +mx +ip4:107.161.174.15 include:relay.mailchannels.net ~all` | ✅ present, and **exactly one** |
| `_dmarc` TXT | absent | ❌ §4 |
| `send.` MX + TXT | absent | ❌ §3 |
| **`MX` apex → `bekwaiyouthmovement.org`** | → `216.198.79.1` (Vercel) | 🔴 **§2 — mail to `info@` cannot be delivered** |

---

## 1. Pick one canonical host — apex or www

Right now `www` serves the site and the apex redirects to it. That is backwards
from what the app is configured for, and from what reads better on a poster.

`NEXT_PUBLIC_SITE_URL` is `https://bekwaiyouthmovement.org`, so every canonical
tag, sitemap entry, OG URL and auth link points at a URL that answers **308**
rather than 200. It works — browsers follow it — but you are asking every
crawler and every auth redirect to take an extra hop for no reason.

**Recommended: make the apex primary.**

> Vercel → your project → **Settings → Domains**. You should see both
> `bekwaiyouthmovement.org` and `www.bekwaiyouthmovement.org`. Set the **apex**
> as the primary domain, and set `www` to *Redirect to* the apex.

Then `https://bekwaiyouthmovement.org` answers 200 and everything already
configured is correct — no code or env change needed.

**If you would rather keep `www`,** change `NEXT_PUBLIC_SITE_URL` to
`https://www.bekwaiyouthmovement.org` in Vercel *and* `.env.local`, and use the
`www` form everywhere in §5 below. Pick one and be consistent; the cost of
mixing them is duplicate-content SEO and confusing auth redirects.

---

## 2. 🔴 Fix the MX record — `info@` cannot receive mail today

**This is the one thing that is actually broken.**

`MX` for the apex points at `bekwaiyouthmovement.org`, which now resolves to
`216.198.79.1` — Vercel. **Vercel does not run a mail server.** Anything sent to
`info@bekwaiyouthmovement.org` hits a web server on port 25 and fails.

This is the classic consequence of pointing a cPanel-hosted domain at Vercel:
cPanel created a default `MX` aimed at the domain itself, which was correct while
the `A` record pointed at the hosting server, and silently became wrong the moment
the `A` record moved to Vercel.

**Fix — cPanel → Zone Editor for `bekwaiyouthmovement.org`:**

1. **Add an `A` record for the mail host** (so it resolves to the hosting server,
   not Vercel):

   | Field | Value |
   |---|---|
   | Name | `mail` |
   | Type | `A` |
   | TTL | `14400` |
   | Address | `107.161.174.15` |

2. **Edit the existing `MX` record** to point at that host instead of the apex:

   | Field | Value |
   |---|---|
   | Name | `bekwaiyouthmovement.org` (leave as the apex) |
   | Type | `MX` |
   | Priority | `10` |
   | Destination | `mail.bekwaiyouthmovement.org` |

> **Confirm the IP before you trust it.** `107.161.174.15` is inferred from your
> own SPF record, which lists it as an authorised sender — so it is almost
> certainly your hosting server. Verify in cPanel under **Server Information →
> Shared IP Address**, and use that value if it differs.

**Test it** after ~30 minutes: send a mail from Gmail to
`info@bekwaiyouthmovement.org` and confirm it lands in cPanel webmail. Until this
passes, `info@` is a write-only address — fine for *sending* via Resend, useless
for replies, which matters because the welcome email sets `Reply-To`.

---

## 3. Finish the Resend records

DKIM is already in place (`resend._domainkey` resolves). Missing is the `send.`
subdomain pair Resend uses for bounce and complaint handling.

**Do not invent these values — copy them.** Go to
**resend.com → Domains → bekwaiyouthmovement.org** and read the pending rows.
They will look like this, but the region differs per account:

| Name | Type | Priority | Value |
|---|---|---|---|
| `send` | `MX` | `10` | `feedback-smtp.<region>.amazonses.com` |
| `send` | `TXT` | — | `v=spf1 include:amazonses.com ~all` |

### Two cPanel traps

- **cPanel appends the domain for you.** If Resend shows
  `send.bekwaiyouthmovement.org`, type only `send` in the Name field. Typing the
  full name produces `send.bekwaiyouthmovement.org.bekwaiyouthmovement.org`,
  which silently never verifies. Same rule for `resend._domainkey`.
- **🔴 Never add a second SPF record to the apex.** You already have one
  (`v=spf1 +a +mx +ip4:107.161.174.15 include:relay.mailchannels.net ~all`).
  Two SPF `TXT` records on the same name is a **permanent error** — receivers
  fail SPF outright rather than picking one, and your existing cPanel mail would
  start being rejected too. The `v=spf1 include:amazonses.com` above goes on the
  **`send` subdomain**, which is a different name, so it does not conflict.

  If Resend ever asks you to modify the *apex* SPF, merge instead of adding:

  ```
  v=spf1 +a +mx +ip4:107.161.174.15 include:relay.mailchannels.net include:amazonses.com ~all
  ```

Then press **Verify** in Resend and wait for all rows to go green.

---

## 4. Add DMARC (recommended, not required)

There is no `_dmarc` record. Without one, Gmail and Outlook have no policy to
apply and are measurably more willing to treat bulk mail from a young domain as
spam — which matters when you are about to email hundreds of members.

| Field | Value |
|---|---|
| Name | `_dmarc` |
| Type | `TXT` |
| TTL | `14400` |
| Value | `v=DMARC1; p=none; rua=mailto:info@bekwaiyouthmovement.org; fo=1` |

`p=none` only asks for reports; it rejects nothing, so it cannot break delivery.
Move to `p=quarantine` after a few weeks of clean reports. Note the `rua=`
address only works once §2 is fixed.

---

## 5. Supabase → Authentication → URL Configuration

Currently still `https://bekwai-youth-movement.vercel.app/` — old host, and with
a trailing slash that the README already warns about.

**Site URL** — no trailing slash, no path:

```
https://bekwaiyouthmovement.org
```

**Redirect URLs — add, do not replace.** All of these must be present:

```
https://bekwaiyouthmovement.org/**
https://www.bekwaiyouthmovement.org/**
https://bekwai-youth-movement.vercel.app/**
http://localhost:3000/**
```

- Keep the **`www`** entry whichever host you made primary — the redirect in §1
  means either form can start an auth flow.
- **Keep the `vercel.app` entry.** Removing it breaks auth for anyone whose DNS
  has not propagated, and for any reset link already sitting in an inbox. It costs
  nothing to leave.
- **Keep `localhost:3000`** or you cannot develop.
- Optionally add `https://*-bekwai-youth-movement.vercel.app/**` for previews.

> ⚠️ In your screenshot, `http://localhost:3000/**` was **ticked** and a
> **Remove (1)** button was active. Click **Clear selection** first — removing
> localhost is an easy accident to make on that screen.

---

## 6. Environment variables

Set these in **Vercel → Settings → Environment Variables** (Production), then
**redeploy** — Vercel does not apply env changes to an existing deployment.

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://bekwaiyouthmovement.org` | Must match your §1 choice exactly |
| `RESEND_API_KEY` | `re_…` from Resend | **Blank in `.env.local` today, so no email sends** |
| `EMAIL_FROM` | `Bekwai Youth Movement <info@bekwaiyouthmovement.org>` | A *sender*; must be at the verified domain |
| `EMAIL_ADMIN` | a mailbox you actually read | A *recipient*; any address |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase → API | Server-only. Never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_URL` | project URL | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key | |

`.env.local` is your machine only and is gitignored. Vercel is what the live site
reads. Both need the values.

---

## Order to do it in

1. **§2 MX fix** — the only thing actually broken. DNS takes longest to
   propagate, so start it first.
2. **§5 Supabase URLs** — instant, and auth links point at the old host until
   you do.
3. **§1 Vercel primary domain** — instant.
4. **§3 Resend `send.` records**, then press Verify.
5. **§4 DMARC.**
6. **§6 env vars + redeploy**, once Resend shows verified and you have the key.

Nothing here is load-bearing for registration. Members can sign up and reach
their dashboard today — email is additive, which is the whole point of the
current design. Take these in order rather than at speed.
