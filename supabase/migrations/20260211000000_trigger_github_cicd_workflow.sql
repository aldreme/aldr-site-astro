-- Create a function to trigger the GitHub workflow via Edge Function
create or replace function trigger_github_cicd_workflow()
returns trigger
language plpgsql
security definer
as $$
declare
  response_status int;
  response_body text;
begin
  -- Call the Edge Function using supabase_functions.http_request
  -- NOTE: You might need to enable the 'supabase_functions' extension if not already enabled.
  -- usually it is enabled by default in Supabase.
  -- Ideally we use pg_net but user requested supabase_functions.http_request
  
  -- We need to construct the URL. Since this runs inside the database, we can't easily get the project project_ref without a config table.
  -- REQUIREMENT: Replace PROJECT_REF with your actual project reference (e.g. cwekxndxzpymauoxixes)
  -- or use the internal DNS if available, but for Edge Functions usually it's public URL.
  
  select
    status,
    content::text
  into
    response_status,
    response_body
  from
    supabase_functions.http_request(
      'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger-github-cicd-workflow',
      'POST',
      '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('supabase.anon_key') || '"}',
      '{}', -- empty body
      1000 -- timeout in ms
    );

  -- Log failure if needed (optional)
  if response_status >= 400 then
    raise warning 'Failed to trigger GitHub workflow: % %', response_status, response_body;
  end if;

  return null;
end;
$$;

-- Create triggers for 'products' table
create trigger on_products_change
after insert or update or delete on public.products
for each statement
execute function trigger_github_cicd_workflow();

-- Create triggers for 'partners' table
create trigger on_partners_change
after insert or update or delete on public.partners
for each statement
execute function trigger_github_cicd_workflow();

-- Create triggers for 'storage.objects' table (for 'product-gallery' bucket)
-- Note: storage.objects is in the storage schema.
-- Create triggers for 'storage.objects' table (for 'product-gallery' bucket)
-- Note: storage.objects is in the storage schema.

-- Trigger for INSERT and UPDATE (uses NEW)
create trigger on_product_gallery_upsert
after insert or update on storage.objects
for each row
when (NEW.bucket_id = 'product-gallery')
execute function trigger_github_cicd_workflow();

-- Trigger for DELETE (uses OLD)
create trigger on_product_gallery_delete
after delete on storage.objects
for each row
when (OLD.bucket_id = 'product-gallery')
execute function trigger_github_cicd_workflow();
