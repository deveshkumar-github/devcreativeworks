CREATE TABLE public.referrers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.referrers TO authenticated;
GRANT ALL ON public.referrers TO service_role;
ALTER TABLE public.referrers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrers select own" ON public.referrers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "referrers insert own" ON public.referrers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "referrers update own" ON public.referrers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES public.referrers(id) ON DELETE SET NULL,
  referrer_code text,
  full_name text NOT NULL,
  business_name text,
  email text,
  whatsapp text,
  website text,
  industry text,
  services text[] NOT NULL DEFAULT '{}'::text[],
  budget text,
  requirements text,
  status text NOT NULL DEFAULT 'submitted',
  project_value numeric NOT NULL DEFAULT 0,
  reward_amount numeric NOT NULL DEFAULT 0,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.referrals TO anon;
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a referral" ON public.referrals FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "referrers read own referrals" ON public.referrals FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.referrers r WHERE r.id = referrals.referrer_id AND r.user_id = auth.uid())
);

CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referrer_code);

CREATE TRIGGER set_referrers_updated_at BEFORE UPDATE ON public.referrers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();