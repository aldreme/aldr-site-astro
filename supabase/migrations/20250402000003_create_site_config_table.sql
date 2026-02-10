create table if not exists site_config (
  key text primary key,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table site_config enable row level security;

-- Policy: Public read access
create policy "Public site_config is viewable by everyone"
  on site_config for select
  using ( true );

-- Policy: Admin write access
create policy "Admins can insert site_config"
  on site_config for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update site_config"
  on site_config for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete site_config"
  on site_config for delete
  using ( auth.role() = 'authenticated' );
