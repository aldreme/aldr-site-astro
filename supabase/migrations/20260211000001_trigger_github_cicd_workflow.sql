-- Create triggers for 'products' table
create trigger on_products_change
after insert or update or delete on public.products
for each row
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- Create triggers for 'partners' table
create trigger on_partners_change
after insert or update or delete on public.partners
for each row
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- Note: storage.objects is in the storage schema.

-- Trigger for INSERT and UPDATE (uses NEW)
drop trigger if exists on_product_gallery_upsert on storage.objects;
create trigger on_product_gallery_upsert
after insert or update on storage.objects
for each row
when (NEW.bucket_id = 'product-gallery')
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- Trigger for DELETE (uses OLD)
drop trigger if exists on_product_gallery_delete on storage.objects;
create trigger on_product_gallery_delete
after delete on storage.objects
for each row
when (OLD.bucket_id = 'product-gallery')
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);