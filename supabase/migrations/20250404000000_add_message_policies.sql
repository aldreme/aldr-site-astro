-- Migration to add RLS policies to cx_contact_messages
-- This allows authenticated users (admins) to manage contact messages

CREATE POLICY "Allow authenticated users to view contact messages"
ON public.cx_contact_messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update contact messages"
ON public.cx_contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete contact messages"
ON public.cx_contact_messages
FOR DELETE
TO authenticated
USING (true);
