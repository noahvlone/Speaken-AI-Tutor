-- Create public_profiles table
create table if not exists public_profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public_profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on public_profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public_profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public_profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.public_profiles (id, full_name, avatar_url, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
