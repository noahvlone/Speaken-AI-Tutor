-- Create pronunciation_errors table
create table if not exists pronunciation_errors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  phoneme text not null,
  error_count integer default 1,
  last_occurred_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, phoneme)
);

-- Enable RLS
alter table pronunciation_errors enable row level security;

-- Policies
create policy "Users can view their own errors"
  on pronunciation_errors for select
  using ( auth.uid() = user_id );

create policy "Users can insert/update their own errors"
  on pronunciation_errors for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own errors"
  on pronunciation_errors for update
  using ( auth.uid() = user_id );
