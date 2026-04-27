-- Enable RLS (already enabled in previous migration, but safe to repeat or omit)
-- ALTER TABLE public.short_urls ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view
CREATE POLICY "Allow authenticated users to view short urls"
    ON public.short_urls
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update short urls"
    ON public.short_urls
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete short urls"
    ON public.short_urls
    FOR DELETE
    TO authenticated
    USING (true);
