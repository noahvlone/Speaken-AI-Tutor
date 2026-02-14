-- 1. Create public_profiles table
create table if not exists public_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS
alter table public_profiles enable row level security;

-- 3. Create policies
do $$
begin
    if not exists (select 1 from pg_policies where policyname = 'Public profiles are viewable by everyone.' and tablename = 'public_profiles') then
        create policy "Public profiles are viewable by everyone."
          on public_profiles for select
          using ( true );
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Users can insert their own profile.' and tablename = 'public_profiles') then
        create policy "Users can insert their own profile."
          on public_profiles for insert
          with check ( auth.uid() = id );
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Users can update own profile.' and tablename = 'public_profiles') then
        create policy "Users can update own profile."
          on public_profiles for update
          using ( auth.uid() = id );
    end if;
end
$$;

-- 4. Create handler function for new user sync
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.public_profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- 5. Create trigger
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;
