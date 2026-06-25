-- ============================================================
-- 0008 Custom Access Token Hook — inject `role` into the JWT
-- Enable in Supabase: Authentication → Hooks → Custom Access Token,
-- and select public.custom_access_token_hook.
-- ============================================================

create or replace function custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
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

-- Allow the auth admin to execute the hook.
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
