-- ============================================================
-- 0010 Security hardening (Supabase advisor remediation)
-- ============================================================

-- Views should enforce the querying user's RLS, not the creator's.
alter view public.representation_gaps set (security_invoker = on);
alter view public.tenure_status set (security_invoker = on);
alter view public.gender_compliance set (security_invoker = on);

-- Pin the auth hook's search_path.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  claims    jsonb;
  user_role text;
begin
  select role::text into user_role
  from public.profiles
  where id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(user_role, 'member')));

  return jsonb_set(event, '{claims}', claims);
end;
$$;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- Trigger + unused helper need not be API-callable.
-- NOTE: is_admin() and my_community() intentionally remain executable — RLS
-- policies invoke them as the querying role, so revoking would break policies.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.auth_role() from anon, authenticated, public;

-- Live Parliament voting (VotePanel subscribes to changes on votes).
alter publication supabase_realtime add table votes;
