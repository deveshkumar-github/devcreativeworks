
-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  live_link text,
  tags text[] DEFAULT '{}',
  thumbnail_url text,
  challenge text,
  solution text,
  result text,
  status text NOT NULL DEFAULT 'draft',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT USING (status = 'published');

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  pricing text,
  icon text,
  thumbnail_url text,
  status text NOT NULL DEFAULT 'active',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active services" ON public.services FOR SELECT USING (status = 'active');

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text,
  quote text NOT NULL,
  rating int DEFAULT 5,
  avatar_url text,
  status text NOT NULL DEFAULT 'active',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active testimonials" ON public.testimonials FOR SELECT USING (status = 'active');

-- CONTACTS (leads)
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  email text,
  phone text,
  project_details text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit a contact" ON public.contacts FOR INSERT WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies for media bucket
CREATE POLICY "public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Seeds
INSERT INTO public.services (title, description, pricing, icon, sort_order) VALUES
('Website Development','Modern, fast, and responsive websites built to convert.','From ₹15,000','Globe',1),
('Branding','Logo design, identity systems, and complete brand guidelines.','From ₹8,000','Sparkles',2),
('Social Media','Instagram posts, creatives, reels and campaign design.','From ₹5,000/mo','Instagram',3),
('Video Editing','Reels, promotional videos, and motion graphics.','From ₹3,000/video','Video',4),
('Marketing Design','Posters, brochures, and digital marketing assets.','From ₹2,000','Palette',5);

INSERT INTO public.projects (title, slug, category, live_link, tags, status, challenge, solution, result, sort_order) VALUES
('ISKCON Kurnool','iskcon-kurnool','Website','https://iskconkurnool.org','{Website,Spiritual,Community}','published',
 'ISKCON Kurnool needed a digital home to share events, teachings and donations with their growing community.',
 'We designed and built a modern, spiritual-themed website with event listings, donation flow, and a clean content structure.',
 'A polished online presence that increased community engagement and made information easy to access for devotees.',1);

INSERT INTO public.testimonials (name, business, quote, rating, sort_order) VALUES
('Ravi Kumar','Founder, KKR Traders','Dev Creative Works rebuilt our brand from scratch. The new website brought us 3x more enquiries in two months.',5,1),
('Priya S.','Director, Sunrise School','Beautiful design, fast turnaround, and they actually understood what we wanted. Highly recommended.',5,2),
('Anil Reddy','Owner, Reddy Mart','From logo to social media, everything looks professional now. Customers notice the difference.',5,3);
