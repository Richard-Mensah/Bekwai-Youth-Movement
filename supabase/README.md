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
```

Then run `seed.sql` to load the 32 communities, 7 units, 19 cabinet
positions, 12 SDGs, standing committees, and TAC placeholders.

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
