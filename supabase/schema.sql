-- Esquema Supabase - Cuerpo de Bomberos de Guática
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run

create extension if not exists pgcrypto;

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'operador' check (role in ('admin', 'operador')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  time time not null,
  capacity integer not null default 20 check (capacity > 0),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.training_enrollments (
  id uuid primary key default gen_random_uuid(),
  training_id uuid not null references public.trainings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (training_id, profile_id)
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text not null default '',
  donated_at date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- HELPERS
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

create or replace function public.profiles_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_touch_updated_at on public.tasks;
create trigger tasks_touch_updated_at
  before update on public.tasks
  for each row execute function public.touch_updated_at();

-- Crea el perfil automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'operador'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.trainings enable row level security;
alter table public.training_enrollments enable row level security;
alter table public.donations enable row level security;

-- profiles
drop policy if exists "profiles_select_auth" on public.profiles;
create policy "profiles_select_auth" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- tasks
drop policy if exists "tasks_select_auth" on public.tasks;
create policy "tasks_select_auth" on public.tasks
  for select to authenticated using (true);

drop policy if exists "tasks_insert_auth" on public.tasks;
create policy "tasks_insert_auth" on public.tasks
  for insert to authenticated with check (public.profiles_is_active());

drop policy if exists "tasks_update_auth" on public.tasks;
create policy "tasks_update_auth" on public.tasks
  for update to authenticated using (public.profiles_is_active()) with check (public.profiles_is_active());

drop policy if exists "tasks_delete_admin" on public.tasks;
create policy "tasks_delete_admin" on public.tasks
  for delete to authenticated using (public.is_admin());

-- trainings
drop policy if exists "trainings_select_auth" on public.trainings;
create policy "trainings_select_auth" on public.trainings
  for select to authenticated using (true);

drop policy if exists "trainings_insert_admin" on public.trainings;
create policy "trainings_insert_admin" on public.trainings
  for insert to authenticated with check (public.is_admin());

drop policy if exists "trainings_update_admin" on public.trainings;
create policy "trainings_update_admin" on public.trainings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "trainings_delete_admin" on public.trainings;
create policy "trainings_delete_admin" on public.trainings
  for delete to authenticated using (public.is_admin());

-- training_enrollments
drop policy if exists "enrollments_select_auth" on public.training_enrollments;
create policy "enrollments_select_auth" on public.training_enrollments
  for select to authenticated using (true);

drop policy if exists "enrollments_insert_self" on public.training_enrollments;
create policy "enrollments_insert_self" on public.training_enrollments
  for insert to authenticated with check (profile_id = auth.uid() and public.profiles_is_active());

drop policy if exists "enrollments_delete_self_or_admin" on public.training_enrollments;
create policy "enrollments_delete_self_or_admin" on public.training_enrollments
  for delete to authenticated using (profile_id = auth.uid() or public.is_admin());

-- donations
drop policy if exists "donations_select_auth" on public.donations;
create policy "donations_select_auth" on public.donations
  for select to authenticated using (true);

drop policy if exists "donations_insert_auth" on public.donations;
create policy "donations_insert_auth" on public.donations
  for insert to authenticated with check (public.profiles_is_active());

drop policy if exists "donations_update_admin" on public.donations;
create policy "donations_update_admin" on public.donations
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "donations_delete_admin" on public.donations;
create policy "donations_delete_admin" on public.donations
  for delete to authenticated using (public.is_admin());

-- Evita que un operador se auto-asigne rol admin o se reactive
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_fields on public.profiles;
create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- ============================================================
-- PRIMER ADMIN
-- Después de crear tu usuario (Authentication > Users > Add user),
-- ejecuta esto reemplazando el correo:
-- ============================================================
-- update public.profiles set role = 'admin' where email = 'tu-correo@dominio.com';
