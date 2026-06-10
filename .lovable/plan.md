
# Dev Creative Works — Website + Admin Panel

A modern marketing site for Dev Creative Works with a password-protected admin panel. Anything edited in admin appears live on the public site instantly (real-time sync via Lovable Cloud).

## Brand & Design System

- Colors: primary `#1565d8`, ink `#1e293b`, slate `#5a7184`, deep navy `#183b56`, accent orange `#f97316`
- Fonts: **Sofia Pro** for headings, **Inter** for body (Sofia Pro loaded via web font; Inter via Google Fonts)
- Style: clean, modern, generous whitespace, soft shadows, rounded-xl, subtle blue→orange gradient accents
- Logo + hero illustrations: your uploaded assets (Dev logo, India-map graphic, workflow graphic)

## Public Site (single-page, smooth-scroll sections + route for project case studies)

1. Sticky header with logo + nav (Home, Services, Work, About, Contact) + WhatsApp CTA
2. **Hero** — headline, subheadline, tagline, dual CTAs, hero illustration
3. **About** — Story / Vision / Mission cards
4. **Services** — 5 services, dynamic from DB (Website Dev, Branding, Social Media, Video Editing, Marketing Design)
5. **Featured Projects** — dynamic from DB (seeded with ISKCON Kurnool)
6. **Process** — 5-step horizontal timeline (Discover → Design → Develop → Launch → Grow)
7. **Why Choose Us** — 6 checkmark items
8. **Testimonials** — dynamic from DB
9. **Vision section** — India map illustration + "You Progress. The Nation Follows."
10. **Final CTA** + Contact form (writes to `contacts` table)
11. **Footer** — links + Instagram / LinkedIn / WhatsApp
12. `/projects/:slug` — case study page (Challenge → Solution → Result)

## Admin Panel (`/admin`)

- `/admin/login` — simple password gate (password: `1234`, stored as a check on a serverless function; session kept in localStorage flag)
- `/admin` dashboard with tabs:
  - **Projects** — CRUD: title, slug, category, live link, tags, thumbnail (1280×720), challenge, solution, result, status (Draft/Published)
  - **Services** — CRUD: title, description, pricing, thumbnail, status (Active/Hidden)
  - **Testimonials** — CRUD: name, business, quote, rating
  - **Contacts (Leads)** — view leads, update pipeline (New → In Progress → Won / Lost), **1-click WhatsApp** button (`https://wa.me/<phone>`)
- Image uploads go to Cloud Storage; auto-resized client-side before upload for mobile-fast loading
- All public pages subscribe to Cloud realtime channels → changes appear live without refresh

## Backend (Lovable Cloud)

Tables (all with RLS):
- `projects` — public read where status='published', admin write
- `services` — public read where status='active', admin write
- `testimonials` — public read, admin write
- `contacts` — public insert (contact form), admin read/update
- Storage bucket `media` — public read, admin write

Admin writes happen through a server function that verifies the admin password before performing the action (the `1234` check lives server-side, not in client code that could be bypassed).

## Tech notes (for the technical reader)

- TanStack Start routes for `/`, `/projects/$slug`, `/admin`, `/admin/login`
- TanStack Query + Supabase realtime subscriptions for live updates
- shadcn/ui components themed with the brand tokens
- Contact form → `contacts` insert; admin pipeline status updates trigger UI re-render

## Security note

Password `1234` is weak by design per your request, and the gate is enforced server-side so the public DB stays protected by RLS. You can change the password anytime in admin settings later.

## Out of scope for v1

- Email notifications on new leads (can add later via edge function + Resend)
- Multi-admin accounts / roles
- Blog / CMS articles

Ready to build this end-to-end on your approval.
