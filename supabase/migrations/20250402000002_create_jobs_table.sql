create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text,
  description text,
  salary text,
  priority integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table jobs enable row level security;

-- Policy: Public read access
create policy "Public jobs are viewable by everyone"
  on jobs for select
  using ( true );

-- Policy: Admin write access
create policy "Admins can insert jobs"
  on jobs for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update jobs"
  on jobs for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete jobs"
  on jobs for delete
  using ( auth.role() = 'authenticated' );
