create table if not exists partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  website text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table partners enable row level security;

-- Policy: Public read access
create policy "Public partners are viewable by everyone"
  on partners for select
  using ( true );

-- Policy: Admin write access
create policy "Admins can insert partners"
  on partners for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update partners"
  on partners for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete partners"
  on partners for delete
  using ( auth.role() = 'authenticated' );
