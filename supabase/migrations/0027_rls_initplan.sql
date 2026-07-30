-- 0027_rls_initplan.sql — APPLIED 30 Jul 2026.
--
-- Wraps every bare auth.<fn>() call in an RLS policy as (select auth.<fn>()).
-- 47 policies across 31 tables.
--
-- Postgres treats an unwrapped auth.uid() as volatile and re-evaluates the policy
-- once per row scanned. Wrapped in a scalar subquery the planner hoists it into an
-- InitPlan and evaluates it exactly once per statement. Same value, same rows —
-- on a 50,000-row votes table, 1 call instead of 50,000.
--
-- ---------------------------------------------------------------
-- THE REGEX DETAIL THAT MATTERS
-- ---------------------------------------------------------------
-- A first attempt failed its own guard and rolled back, which is the reason that
-- guard is in here. Postgres does not store policy text verbatim; it re-renders
-- it canonically, so an already-wrapped call comes back as
--
--     ( SELECT auth.uid() AS uid)
--
-- with an upper-case SELECT and a leading space. A case-sensitive lookbehind
-- `(?<!select )` therefore reads Postgres's own output as unwrapped: it re-wraps
-- correct policies forever, and the completion check can never pass. Hence `~*`
-- and the 'gi' flags below. Anyone regenerating this must keep them.
--
-- ---------------------------------------------------------------
-- VERIFIED AFTER APPLYING
-- ---------------------------------------------------------------
--   * policy count 112 before, 112 after
--   * 0 policies left containing an unwrapped auth call
--   * per-role visibility fingerprinted across 19 tables and views for anon,
--     member and admin before and after: IDENTICAL
--   * write paths re-tested: signup returns a session; a member reads only their
--     own profile, drafts/submits/reads their own application and sees no other;
--     the 0021 guard still blocks self-promotion; a signed-in admin can still
--     verify another member
--
-- Rollback data lives in public._policy_backup_20260730, taken immediately before
-- this ran: schemaname, tablename, policyname, permissive, roles, cmd, qual,
-- with_check for all 112 policies. Drop that table once you are satisfied.
--
-- To reverse, run the same loop with the transformation inverted:
--   pattern '\(\s*select\s+(auth\.(?:uid|jwt|role)\(\))(\s+as\s+\w+)?\s*\)'
--   replacement '\1'
-- ...or regenerate each policy from the backup table, which is exact.

do $$
declare
  p record;
  new_qual  text;
  new_check text;
  ddl       text;
  pattern   text := '(?<!select )(auth\.(?:uid|jwt|role)\(\))';
  n         int := 0;
  leftover  int := 0;
begin
  for p in
    select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual,'') ~* pattern or coalesce(with_check,'') ~* pattern)
    order by tablename, policyname
  loop
    new_qual  := regexp_replace(p.qual,       pattern, '(select \1)', 'gi');
    new_check := regexp_replace(p.with_check, pattern, '(select \1)', 'gi');

    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);

    ddl := format('create policy %I on %I.%I as %s for %s to %s',
                  p.policyname, p.schemaname, p.tablename,
                  case when p.permissive = 'PERMISSIVE' then 'permissive' else 'restrictive' end,
                  lower(p.cmd),
                  array_to_string(p.roles, ', '));
    if new_qual  is not null then ddl := ddl || format(' using (%s)', new_qual); end if;
    if new_check is not null then ddl := ddl || format(' with check (%s)', new_check); end if;

    execute ddl;
    n := n + 1;
  end loop;

  select count(*) into leftover from pg_policies
  where schemaname='public'
    and (coalesce(qual,'') ~* pattern or coalesce(with_check,'') ~* pattern);

  raise notice 'rewrote % policies, % still unwrapped', n, leftover;

  -- A partial rewrite is the worst outcome: the advisor goes quiet while some
  -- tables stay slow. Fail the whole transaction instead.
  if leftover > 0 then
    raise exception 'policies still contain unwrapped auth calls (%) - rolled back', leftover;
  end if;
end $$;
