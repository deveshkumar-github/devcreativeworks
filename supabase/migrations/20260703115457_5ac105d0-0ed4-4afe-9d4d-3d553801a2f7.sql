
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS launch_at timestamptz;

CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  title text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  agenda text,
  related_section text,
  meet_link text,
  status text NOT NULL DEFAULT 'scheduled',
  participants jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary jsonb,
  client_acknowledged boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sessions TO anon;
GRANT SELECT ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read sessions of active payments"
ON public.sessions FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.payments p WHERE p.id = sessions.payment_id AND p.status = 'active'));

CREATE TRIGGER sessions_set_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS sessions_payment_id_idx ON public.sessions(payment_id);
CREATE INDEX IF NOT EXISTS sessions_scheduled_at_idx ON public.sessions(scheduled_at);
