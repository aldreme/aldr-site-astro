-- Insert buckets into storage.buckets
insert into storage.buckets (id, name, public)
values 
  ('products', 'products', true),
  ('partners', 'partners', true),
  ('general', 'general', true)
on conflict (id) do nothing;

-- Policy: Public read access for products bucket
create policy "Public Access Products"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy: Public read access for partners bucket
create policy "Public Access Partners"
  on storage.objects for select
  using ( bucket_id = 'partners' );

-- Policy: Public read access for general bucket
create policy "Public Access General"
  on storage.objects for select
  using ( bucket_id = 'general' );

-- Policy: Authenticated users can upload/update/delete
create policy "Auth Upload Products"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

create policy "Auth Update Products"
  on storage.objects for update
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );

create policy "Auth Delete Products"
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Partners
create policy "Auth Upload Partners"
  on storage.objects for insert
  with check ( bucket_id = 'partners' and auth.role() = 'authenticated' );

create policy "Auth Update Partners"
  on storage.objects for update
  using ( bucket_id = 'partners' and auth.role() = 'authenticated' );

create policy "Auth Delete Partners"
  on storage.objects for delete
  using ( bucket_id = 'partners' and auth.role() = 'authenticated' );

-- General
create policy "Auth Upload General"
  on storage.objects for insert
  with check ( bucket_id = 'general' and auth.role() = 'authenticated' );

create policy "Auth Update General"
  on storage.objects for update
  using ( bucket_id = 'general' and auth.role() = 'authenticated' );

create policy "Auth Delete General"
  on storage.objects for delete
  using ( bucket_id = 'general' and auth.role() = 'authenticated' );
