-- Raff Maff – schema, indexes and Row Level Security.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Design: the learner's client can only READ its own progress. All progress writes go through
-- server API routes (service role) that validate assessments, so XP / unlocks can't be forged.

create extension if not exists "pgcrypto";

-- ───────── content (seeded from src/lib/content via `npm run db:seed`) ─────────
create table if not exists public.worlds (
  id text primary key,
  position int not null unique,
  title text not null,
  tagline text not null default '',
  built boolean not null default false
);

create table if not exists public.lessons (
  id text primary key,
  world_id text not null references public.worlds(id) on delete cascade,
  position int not null,
  title text not null,
  summary text not null default '',
  is_boss boolean not null default false,
  unique (world_id, position)
);
create index if not exists lessons_world_idx on public.lessons(world_id);

create table if not exists public.exercises (
  id text primary key,                  -- "<lesson>:<template>"
  lesson_id text not null references public.lessons(id) on delete cascade,
  section text not null check (section in ('knowledge','method','representation')),
  template_id text not null,
  skill text not null
);
create index if not exists exercises_lesson_idx on public.exercises(lesson_id);
create index if not exists exercises_skill_idx on public.exercises(skill);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  xp int not null default 0
);

-- ───────── user data ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Läraren',
  xp int not null default 0 check (xp >= 0),
  streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  current_lesson_id text references public.lessons(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  theory_done boolean not null default false,
  sections jsonb not null default '{"knowledge":false,"method":false,"representation":false,"pedagogy":false}',
  best_knowledge numeric not null default 0,
  practice_xp int not null default 0,
  xp_awarded int not null default 0,
  completed_at timestamptz,
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists user_progress_user_idx on public.user_progress(user_id, status);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,               -- lesson id, "<world>-boss", or the lesson a revision pass centred on
  section text not null,                 -- knowledge|method|representation|pedagogy|boss|revision|academy
  nonce text not null,                   -- one-time token id => replay protection
  seed text not null,
  score numeric not null,
  max_score numeric not null,
  passed boolean not null,
  xp int not null default 0,
  mistakes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique (user_id, nonce)
);
create index if not exists attempts_user_time_idx on public.assessment_attempts(user_id, created_at desc);
create index if not exists attempts_user_lesson_idx on public.assessment_attempts(user_id, lesson_id, section);

create table if not exists public.skill_stats (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  lesson_id text not null,
  correct int not null default 0,
  wrong int not null default 0,
  last_practiced timestamptz not null default now(),
  primary key (user_id, skill)
);

create table if not exists public.revision_queue (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  skill text not null,
  reason text not null default '',
  priority int not null default 1,
  due_at timestamptz not null,
  interval_days int not null default 1,
  times_wrong int not null default 0,
  times_right int not null default 0,
  resolved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id, skill)
);
create index if not exists revision_due_idx on public.revision_queue(user_id, resolved, due_at);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ───────── profile auto-creation ─────────
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Läraren'))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ───────── Row Level Security ─────────
alter table public.worlds enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.achievements enable row level security;
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.skill_stats enable row level security;
alter table public.revision_queue enable row level security;
alter table public.user_achievements enable row level security;

-- content: readable by signed-in users, never writable from the client
create policy "content read worlds" on public.worlds for select to authenticated using (true);
create policy "content read lessons" on public.lessons for select to authenticated using (true);
create policy "content read exercises" on public.exercises for select to authenticated using (true);
create policy "content read achievements" on public.achievements for select to authenticated using (true);

-- personal data: each user sees only their own rows
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own progress read" on public.user_progress for select to authenticated using (user_id = auth.uid());
create policy "own attempts read" on public.assessment_attempts for select to authenticated using (user_id = auth.uid());
create policy "own skill stats read" on public.skill_stats for select to authenticated using (user_id = auth.uid());
create policy "own revision read" on public.revision_queue for select to authenticated using (user_id = auth.uid());
create policy "own achievements read" on public.user_achievements for select to authenticated using (user_id = auth.uid());

-- The only profile column a client may change is the display name (xp, streak … are server-owned).
revoke update on public.profiles from authenticated, anon;
grant update (display_name) on public.profiles to authenticated;
-- No insert/update/delete grants on progress tables for client roles: writes come from the service role only.
revoke insert, update, delete on public.user_progress, public.assessment_attempts, public.skill_stats,
  public.revision_queue, public.user_achievements from authenticated, anon;
revoke all on public.worlds, public.lessons, public.exercises, public.achievements from anon;
revoke insert, update, delete on public.worlds, public.lessons, public.exercises, public.achievements from authenticated;
