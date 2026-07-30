# Domain, DNS and Email — bekwaiyouthmovement.org

Measured live on 30 July 2026. Everything below was verified by querying DNS
against `8.8.8.8` and requesting the site, not by reading a dashboard.

---

## Current state

Re-verified 30 July 2026, after the Supabase URLs were added.

| Check | Result | Verdict |
|---|---|---|
| `A` apex → `216.198.79.1` | Vercel anycast IP | ✅ done |
| `CNAME www` → apex | resolves to the Vercel IP | ✅ works |
| `https://www.bekwaiyouthmovement.org` | **HTTP 200** | ✅ **site is live** |
| `https://bekwaiyouthmovement.org` | HTTP 308 → `www` | ⚠️ §1 |
| `resend._domainkey` TXT | DKIM public key present | ✅ done |
| SPF (apex TXT) | one record, cPanel/MailChannels | ✅ present, and **exactly one** |
| **Supabase Site URL** | `https://bekwaiyouthmovement.org` | ✅ **done, no trailing slash** |
| **Supabase redirect allow-list** | all 4 hosts allowed; a non-listed host correctly substituted | ✅ **done and enforced** |
| Authoritative nameservers | `ns1–ns4.srv-console.com` (cPanel) | ✅ Zone Editor is the right place |
| Wildcard `*` record | none | — |
| `_dmarc` TXT | absent | ❌ §4 |
| `send.` MX + TXT | **both present**, `feedback-smtp.eu-west-1.amazonses.com` | ✅ done, propagated |
| **`MX` apex → apex → `216.198.79.1`** | Vercel, **port 25 closed** | 🔴 **§2 — mail to `info@` is dropped** |
| `mail.` → `216.198.79.1` | is a **CNAME to the apex**, which follows it to Vercel | 🔴 §2 — delete, replace with an `A` |

### The mail server, located and confirmed

| | |
|---|---|
| `107.161.174.15` reverse DNS | `s44.srvx.ws` — the cPanel host |
| ports 25 / 587 / 465 / 993 | **all OPEN** → a real mail server |
| `216.198.79.1` port 25 | **closed** → proves mail to `info@` is being dropped now |

So `107.161.174.15` is not a guess any more. It is where mail has to go.

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

**Inspecting the actual zone (30 Jul, 1:39 PM) showed `mail` is a `CNAME`, not an
`A` record:**

```
mail.bekwaiyouthmovement.org.   14400   CNAME   bekwaiyouthmovement.org
```

That is the whole mechanism: `mail` is an alias for the apex, the apex `A` record
now points at Vercel, so `mail` follows it there. It cannot be *edited* into an
`A` record — a name may not hold both a `CNAME` and an `A`, so the alias has to go
first.

There is also a standards reason not to leave it a CNAME: **an `MX` target must
resolve to an address record, never to a CNAME.** Some receiving servers reject
mail outright when the MX points at an alias, so pointing the `MX` at a
still-aliased `mail` would swap one delivery failure for a subtler one.

1. **Delete** the `mail.bekwaiyouthmovement.org.` `CNAME` row.

2. **Add** an `A` record in its place:

   | Field | Value |
   |---|---|
   | Name | `mail.bekwaiyouthmovement.org.` |
   | Type | `A` |
   | TTL | `14400` |
   | Address | `107.161.174.15` |

3. **Edit** the apex `MX` so it points at that host instead of the apex:

   | Field | Value |
   |---|---|
   | Name | `bekwaiyouthmovement.org.` |
   | Type | `MX` |
   | Priority | `0` (leave it) |
   | Destination | `mail.bekwaiyouthmovement.org.` ← change from `bekwaiyouthmovement.org` |

   With a single MX the priority number is irrelevant — it only ranks backups —
   so there is no reason to touch it.

**Leave these alone.** They are in the same zone and all have a job:
`_acme-challenge` (×2) and `_cpanel-dcv-test-record` are TLS and domain-control
validation; `www` CNAME → apex is what makes the site resolve; the apex `A`
(`216.198.79.1`) is Vercel and correct; the apex `TXT` is your only SPF record.

> The `ftp` CNAME also follows the apex to Vercel, so FTP by hostname will not
> work. Harmless — nothing here uses it, and `s44.srvx.ws` still reaches the box.

**Test it** after ~30 minutes: send a mail from Gmail to
`info@bekwaiyouthmovement.org` and confirm it lands in cPanel webmail. Until this
passes, `info@` is a write-only address — fine for *sending* via Resend, useless
for replies, which matters because the welcome email sets `Reply-To`.

---

## 3. Finish the Resend records — this is what is blocking verification

**Diagnosed 30 Jul, 1:17 PM.** Resend shows *Domain added → Checking DNS →
Verifying domain*, stalled at **Checking DNS**, with DKIM already **Verified**.

The cause, confirmed by direct DNS query:

```
resend._domainkey   present (218 chars)   <- Resend: Verified
send.<domain>  MX   MISSING               <- blocking
send.<domain>  TXT  MISSING               <- blocking
```

Resend will not move past *Checking DNS* until **every** record it lists resolves,
not just DKIM. Scroll down past the DKIM table on that page and you will find an
**SPF** section with two rows, both still pending. Those two are the whole holdup.

Nothing is wrong with what you have done — DKIM is correct and verified. Two
records are simply not there yet.

**Do not invent these values — copy them.** Go to
**resend.com → Domains → bekwaiyouthmovement.org** and read the pending rows.
They will look like this, but the region differs per account:

| Name | Type | Priority | Value |
|---|---|---|---|
| `send` | `MX` | `10` | `feedback-smtp.<region>.amazonses.com` |
| `send` | `TXT` | — | `v=spf1 include:amazonses.com ~all` |

### cPanel traps

- **Use Zone Editor → Manage → Add Record, not the "MX Entry" tool.** cPanel's
  dedicated MX tool only edits mail routing for the domain itself and cannot
  create an MX on a subdomain. The `send` MX has to go in through the zone editor
  or it silently will not exist.

- **"The given serial number … does not match the DNS zone's serial number."**
  Hit on this account, 30 Jul 1:26 PM, and it blocked the write completely —
  checked against the authoritative nameserver, the record never entered the zone.
  It is an optimistic-locking check, not a fault in your record: the browser holds
  an older copy of the zone than the server has, so cPanel refuses the write
  rather than clobber whatever changed in between.
  **Fix: reload the page, then re-enter the record.** Pressing Save again without
  reloading fails identically every time.
  Prefer the per-row **Save Record** over **Save All Records**, and reload between
  records — that keeps the serial fresh and confines a failure to one record.

- **This account's Zone Editor uses fully-qualified names with a trailing dot**,
  so `send.bekwaiyouthmovement.org.` is correct as typed — the trailing dot makes
  the name absolute and the origin is not appended again.
  On hosts whose Name field is *relative* you would type only `send`; entering the
  full name there yields
  `send.bekwaiyouthmovement.org.bekwaiyouthmovement.org` and silently never
  verifies. Tell them apart from an existing row: if it reads
  `bekwaiyouthmovement.org.` with the dot, the field is absolute.
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

## 5. Supabase → Authentication → URL Configuration — ✅ DONE

Verified by generating a real recovery link per host and reading back the
`redirect_to` Supabase actually honoured. `generateLink` sends no email, so this
cost nothing:

| Requested redirect | Result |
|---|---|
| `https://bekwaiyouthmovement.org/auth/callback` | allowed ✅ |
| `https://www.bekwaiyouthmovement.org/auth/callback` | allowed ✅ |
| `https://bekwai-youth-movement.vercel.app/auth/callback` | allowed ✅ |
| `http://localhost:3000/auth/callback` | allowed ✅ |
| `https://evil-not-allowed.example.com/auth/callback` | **substituted** with the Site URL ✅ |

Site URL reads back as `https://bekwaiyouthmovement.org` — correct, and with no
trailing slash.

That last row is the one worth noting: it proves the allow-list is being
*enforced* rather than sitting wide open. Nothing more to do in this section.

For reference, the four entries that must stay present:

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

## What is left, in order

✅ Done: A record, site live, DKIM, SPF, **Supabase URL configuration**.

1. **§2 — edit `mail` A record, then the MX destination.** The only thing actually
   broken. DNS is slowest to propagate, so start here.
2. **§1 — make the apex primary in Vercel.** One click.
3. **§3 — Resend `send.` MX + TXT**, then press Verify in Resend.
4. **§4 — DMARC.** One record.
5. **§6 — `RESEND_API_KEY` and `EMAIL_FROM` in Vercel, then redeploy.** Last,
   because the key is worthless until Resend shows the domain verified.

Nothing on this list blocks registration. Members sign up and reach their
dashboard today; email is additive by design, which is exactly why you can take
these in order rather than at speed.

Nothing here is load-bearing for registration. Members can sign up and reach
their dashboard today — email is additive, which is the whole point of the
current design. Take these in order rather than at speed.
