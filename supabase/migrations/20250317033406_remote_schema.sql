alter table "public"."customer_request_for_quotes" alter column "quantity_needed" set data type bigint using "quantity_needed"::bigint;

CREATE UNIQUE INDEX customer_request_for_quotes_id_key ON public.customer_request_for_quotes USING btree (id);

alter table "public"."customer_request_for_quotes" add constraint "customer_request_for_quotes_id_key" UNIQUE using index "customer_request_for_quotes_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_cx_rfq_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'auth'
AS $function$BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;$function$
;

create policy "Only authed users can operate"
on "public"."customer_request_for_quotes"
as permissive
for all
to authenticated
using (true)
with check (true);


CREATE TRIGGER cx_rfq_updated_at_trigger BEFORE INSERT OR UPDATE ON public.customer_request_for_quotes FOR EACH ROW EXECUTE FUNCTION update_cx_rfq_updated_at();


