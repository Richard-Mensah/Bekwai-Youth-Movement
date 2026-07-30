-- 0030_oauth_profiles.sql
--
-- Makes the new-user trigger work for members who arrive through Google.
--
-- handle_new_user() was written for the registration form, which posts every
-- field it needs in raw_user_meta_data. An OAuth sign-in populates that object
-- from the provider instead, and the provider decides what is in it: Google
-- currently sends `full_name`, `name`, `avatar_url`, `picture` and `email`, and
-- nothing at all for gender, dob, phone or community.
--
-- Two consequences, one already handled and one not:
--
--  * The four BYM-specific fields land NULL. That is fine and intended — all
--    four columns are nullable, the profile is created, and the app diverts the
--    member to /complete-profile to fill them in. See `lib/auth.ts`
--    (`needsProfile`), which gates on community_id.
--
--  * The name is the part that could quietly break. The old code read
--    `full_name` alone, so a provider that supplies only `name` would create a
--    member called "" — displayed as a blank row in the members directory and an
--    email addressed to "Akwaaba ,". Google does send `full_name` today, but it
--    is the provider's choice and not a contract with us, and the failure is
--    silent when it changes.
--
-- The fallback chain below is ordered by how much we trust each source:
-- `full_name` (Supabase's normalised field) → `name` (raw OIDC claim) → the
-- local part of the email address, which always exists, so the result is never
-- empty. A member can correct it afterwards; a blank name is one nobody notices
-- is missing.
--
-- Everything else in the function is unchanged from 0024, including the
-- per-field exception handling that stops a bad cast aborting the INSERT on
-- auth.users itself.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_gender       gender;
  v_dob          date;
  v_community_id integer;
  v_full_name    text;
begin
  begin
    v_gender := nullif(new.raw_user_meta_data->>'gender', '')::gender;
  exception when others then
    v_gender := null;
  end;

  begin
    v_dob := nullif(new.raw_user_meta_data->>'dob', '')::date;
  exception when others then
    v_dob := null;
  end;

  begin
    v_community_id := nullif(new.raw_user_meta_data->>'community_id', '')::integer;
  exception when others then
    v_community_id := null;
  end;

  -- An id that is not a real community would fail the foreign key.
  if v_community_id is not null
     and not exists (select 1 from communities where id = v_community_id) then
    v_community_id := null;
  end if;

  -- nullif on each: an OAuth provider that sends an empty string is commoner
  -- than one that omits the key, and coalesce alone would accept "".
  v_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    ''
  );

  begin
    insert into public.profiles (id, full_name, email, gender, dob, phone, community_id)
    values (
      new.id,
      v_full_name,
      new.email,
      v_gender,
      v_dob,
      new.raw_user_meta_data->>'phone',
      v_community_id
    );
  exception when others then
    -- A member with no profile row can be repaired; a member who could not
    -- sign up is simply gone. Surfaces in the Postgres logs.
    raise warning '[handle_new_user] profile insert failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;
