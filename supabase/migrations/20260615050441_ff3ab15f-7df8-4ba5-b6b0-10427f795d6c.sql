-- Remove contacts from Realtime so PII isn't broadcast
ALTER PUBLICATION supabase_realtime DROP TABLE public.contacts;

-- Remove duplicate overlapping public SELECT policy on storage.objects for the media bucket
DROP POLICY IF EXISTS "public read media" ON storage.objects;