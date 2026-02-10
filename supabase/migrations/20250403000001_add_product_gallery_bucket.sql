-- Insert product-gallery bucket
insert into storage.buckets (id, name, public)
values ('product-gallery', 'product-gallery', true)
on conflict (id) do nothing;

-- Policy: Public read access for product-gallery bucket
create policy "Public Access Product Gallery"
  on storage.objects for select
  using ( bucket_id = 'product-gallery' );

-- Policy: Authenticated users can upload/update/delete
create policy "Auth Upload Product Gallery"
  on storage.objects for insert
  with check ( bucket_id = 'product-gallery' and auth.role() = 'authenticated' );

create policy "Auth Update Product Gallery"
  on storage.objects for update
  using ( bucket_id = 'product-gallery' and auth.role() = 'authenticated' );

create policy "Auth Delete Product Gallery"
  on storage.objects for delete
  using ( bucket_id = 'product-gallery' and auth.role() = 'authenticated' );
