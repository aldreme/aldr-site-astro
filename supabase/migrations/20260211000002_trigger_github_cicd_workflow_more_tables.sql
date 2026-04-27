-- Create triggers for 'site_config' table
drop trigger if exists on_site_config_change on public.site_config;
create trigger on_site_config_change
after insert or update or delete on public.site_config
for each row
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- Create triggers for 'jobs' table
drop trigger if exists on_jobs_change on public.jobs;
create trigger on_jobs_change
after insert or update or delete on public.jobs
for each row
execute function "supabase_functions"."http_request"(
  'https://cwekxndxzpymauoxixes.supabase.co/functions/v1/trigger_github_cicd_workflow',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
