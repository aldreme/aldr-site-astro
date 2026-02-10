create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  category text,
  description text,
  introduction text,
  featured boolean default false,
  price numeric default 0,
  images text[],
  tags text[],
  features text[],
  application_scenarios text[],
  specs jsonb default '{}'::jsonb,
  engineering_drawings jsonb default '{}'::jsonb,
  policies jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster search
create index if not exists products_slug_idx on products (slug);
create index if not exists products_category_idx on products (category);

-- Enable RLS
alter table products enable row level security;

-- Policy: Public read access
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Policy: Admin write access (TODO: refine with actual admin role check later)
-- For now, allow authenticated users to update if they are admins (placeholder)
create policy "Admins can insert products"
  on products for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update products"
  on products for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete products"
  on products for delete
  using ( auth.role() = 'authenticated' );
