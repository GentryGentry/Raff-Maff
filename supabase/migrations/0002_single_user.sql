-- Raff Maff is a single-user app: access is protected by one access code (APP_PASSCODE) checked by the server,
-- and the server talks to this database with the service-role key. There are no Supabase Auth users.
-- Run AFTER 0001_init.sql. Safe to run on a fresh project.

-- The fixed profile id no longer has to exist in auth.users.
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.user_progress drop constraint if exists user_progress_user_id_fkey;
alter table public.assessment_attempts drop constraint if exists assessment_attempts_user_id_fkey;
alter table public.skill_stats drop constraint if exists skill_stats_user_id_fkey;
alter table public.revision_queue drop constraint if exists revision_queue_user_id_fkey;
alter table public.user_achievements drop constraint if exists user_achievements_user_id_fkey;

-- No automatic profile creation on sign-up.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Nobody but the server (service role, which bypasses RLS) may touch personal data. Even with a leaked anon key
-- the browser can read and write nothing.
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "own progress read" on public.user_progress;
drop policy if exists "own attempts read" on public.assessment_attempts;
drop policy if exists "own skill stats read" on public.skill_stats;
drop policy if exists "own revision read" on public.revision_queue;
drop policy if exists "own achievements read" on public.user_achievements;
revoke all on public.profiles, public.user_progress, public.assessment_attempts, public.skill_stats,
  public.revision_queue, public.user_achievements from anon, authenticated;
-- RLS stays enabled with no policies = deny-all for anon/authenticated.
