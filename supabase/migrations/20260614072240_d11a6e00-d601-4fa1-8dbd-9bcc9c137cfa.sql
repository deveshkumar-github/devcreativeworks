CREATE TABLE public.client_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  link text,
  status text NOT NULL DEFAULT 'active',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.client_logos TO anon, authenticated;
GRANT ALL ON public.client_logos TO service_role;
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active client logos" ON public.client_logos
  FOR SELECT USING (status = 'active');
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_logos;