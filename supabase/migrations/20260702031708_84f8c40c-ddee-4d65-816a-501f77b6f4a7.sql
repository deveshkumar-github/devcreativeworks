ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS dashboard_title text,
  ADD COLUMN IF NOT EXISTS dashboard_pages jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dashboard_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dashboard_enabled boolean NOT NULL DEFAULT false;