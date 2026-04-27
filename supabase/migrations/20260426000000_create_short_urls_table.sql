CREATE TABLE public.short_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    expired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: RLS is turned on but not strictly needed unless we want to query this via PostgREST.
-- In our case, the Edge Function acts as the backend and uses the service_role key to bypass RLS.
-- However, we'll enable RLS to be safe and block direct anonymous access.
ALTER TABLE public.short_urls ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (for the edge function when not using service role, though edge function will use service role anyway). We'll restrict to authenticated users for extra safety or just keep it completely closed. 
-- Since edge function is the only way in, keeping no policies means only service_role can access it. Which is perfectly secure.

-- Create an index to quickly lookup by slug
CREATE INDEX idx_short_urls_slug ON public.short_urls(slug);
