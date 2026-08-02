import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Gift, Sparkles, ArrowRight, Check, ChevronDown, Globe, Palette, ShoppingBag, Smartphone,
  Rocket, Brush, Camera, Video, Zap, Search, Send, Users, Handshake, PhoneCall, Trophy,
  ShieldCheck, Gauge, MonitorSmartphone, LifeBuoy, Star, Copy, LayoutDashboard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

const SERVICES = [
  { icon: Globe, label: "Professional Website Development" },
  { icon: Palette, label: "UI/UX Design" },
  { icon: ShoppingBag, label: "E-commerce Websites" },
  { icon: Smartphone, label: "Mobile-Friendly Web Apps" },
  { icon: Rocket, label: "Startup MVP Development" },
  { icon: Brush, label: "Branding & Logo Design" },
  { icon: Camera, label: "Social Media Creatives" },
  { icon: Video, label: "Video Editing & Motion Graphics" },
  { icon: Zap, label: "Website Speed Optimization" },
  { icon: Search, label: "SEO & Google Business Setup" },
];

const STEPS = [
  { icon: Send, title: "Share Your Referral", text: "Send your unique referral link or invite code to friends, startups, schools, temples, shops or businesses." },
  { icon: Users, title: "They Submit Their Details", text: "The business fills out a quick inquiry form." },
  { icon: PhoneCall, title: "We Contact Them", text: "Our team understands their requirements and provides a tailored proposal." },
  { icon: Handshake, title: "Project Starts", text: "Once the client confirms and completes the initial payment, the referral is successful." },
  { icon: Trophy, title: "You Get Rewarded 🎉", text: "Receive your referral reward directly after project confirmation." },
];

const AUDIENCE = ["Startups","Local Businesses","Educational Institutions","Temples & Trusts","Hospitals & Clinics","Restaurants & Cafés","Fashion Brands","Real Estate Companies","Coaches & Consultants","NGOs","Event Organizers","Manufacturers","E-commerce Sellers"];

const WHY = [
  { icon: Sparkles, title: "Modern Design", text: "Premium, clean and user-friendly websites." },
  { icon: Gauge, title: "Fast Delivery", text: "Efficient project execution without compromising quality." },
  { icon: MonitorSmartphone, title: "Mobile Optimized", text: "Looks perfect across every device." },
  { icon: Search, title: "SEO Ready", text: "Built with search engine best practices." },
  { icon: ShieldCheck, title: "Secure & Reliable", text: "Modern technologies with secure infrastructure." },
  { icon: LifeBuoy, title: "Dedicated Support", text: "Continued assistance even after project delivery." },
];

const REWARDS = [
  { tier: "1–5 Referrals", amount: "₹1,000", unit: "per successful referral", accent: "from-brand to-brand", icon: Gift },
  { tier: "Complete 5 Referrals", amount: "Up to ₹1,500", unit: "bonus gift reward", accent: "from-orange to-orange", icon: Star },
  { tier: "Complete 10 Referrals", amount: "Up to ₹4,000", unit: "+ gift cards, coupons & more", accent: "from-navy to-brand", icon: Trophy },
];

const FAQS = [
  { q: "When do I receive my reward?", a: "After the referred client confirms the project and completes the initial payment." },
  { q: "Is there any limit?", a: "No. You can refer unlimited businesses." },
  { q: "Can I track my referrals?", a: "Yes. Your dashboard shows real-time referral progress." },
  { q: "Is joining free?", a: "Absolutely. Anyone can participate." },
  { q: "Can I refer multiple businesses?", a: "Yes. The more successful referrals, the more rewards you can earn." },
];

const TERMS = [
  "Referral must be submitted through your unique referral link.",
  "Duplicate referrals are not eligible.",
  "Rewards are processed only after project confirmation and payment verification.",
  "Dev Creative Works reserves the right to verify all referrals.",
  "Fraudulent referrals will be disqualified.",
  "Reward structures may change without prior notice.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function ReferPage({ code }: { code?: string }) {
  const [copied, setCopied] = useState(false);
  const shareLink = code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/refer/${code}?utm_source=referral&utm_medium=direct&utm_campaign=client_referral`
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-blueprint opacity-30" />
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-brand/40 blur-3xl animate-drift-x" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-orange/30 blur-3xl animate-drift-x" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur"
          >
            <Gift className="w-4 h-4 text-orange" /> Refer & Earn Program
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05]"
          >
            Refer a Business.<br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange via-orange to-white bg-clip-text text-transparent">Earn Rewards.</span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
          >
            Know someone who needs a website, branding, UI/UX design or digital marketing? Refer them to
            Dev Creative Works and earn exciting rewards for every successful project.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a href="#refer-form" className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-bold shadow-glow">
              Refer Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#rewards" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold backdrop-blur hover:bg-white/10 transition-colors">
              View Rewards
            </a>
            <Link to="/refer/dashboard" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white/80 hover:text-orange transition-colors">
              <LayoutDashboard className="w-4 h-4" /> My Dashboard
            </Link>
          </motion.div>

          {code && (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-white/60">You were invited with code</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-orange">{code}</p>
              <button
                onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/25"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Link copied" : "Copy referral link"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WHY REFER US */}
      <Section id="why" eyebrow="Why Refer Us?" title="You're introducing businesses to a trusted digital partner">
        <p className="mx-auto max-w-3xl text-center text-slate-soft">
          When you recommend Dev Creative Works, you're introducing businesses to a partner that delivers modern,
          high-performing solutions. We help businesses grow through:
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-gradient-brand group-hover:text-white">
                <s.icon className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden bg-muted/40 py-20">
        <div className="absolute inset-0 bg-diagonal opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading eyebrow="How It Works" title="Five simple steps to your reward" />
          <div className="mt-12 grid gap-5 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-white p-5 shadow-soft"
              >
                <span className="absolute -top-3 left-5 rounded-full bg-gradient-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                  Step {i + 1}
                </span>
                <s.icon className="mt-3 h-7 w-7 text-orange" />
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-soft">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REWARDS */}
      <section id="rewards" className="relative overflow-hidden bg-navy py-20 text-white scroll-mt-24">
        <div className="absolute inset-0 bg-hex opacity-40" />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange">🎁 Referral Rewards</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold">Earn more with every referral</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REWARDS.map((r, i) => (
              <motion.div
                key={r.tier} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur transition-transform hover:-translate-y-2"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/10 animate-shine-sweep" />
                <r.icon className="h-9 w-9 text-orange" />
                <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-white/60">{r.tier}</p>
                <p className={`mt-2 font-display text-4xl font-extrabold bg-gradient-to-r ${r.accent} bg-clip-text text-transparent`}>
                  {r.amount}
                </p>
                <p className="mt-1 text-sm text-white/70">{r.unit}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/50">
            Note: Rewards are credited after the referred client confirms the project and completes the initial payment.
          </p>
        </div>
      </section>

      {/* WHO CAN YOU REFER */}
      <Section id="audience" eyebrow="Who Can You Refer?" title="Anyone looking for digital services">
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {AUDIENCE.map((a, i) => (
            <motion.span
              key={a} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gradient-brand hover:text-white"
            >
              {a}
            </motion.span>
          ))}
        </div>
      </Section>

      {/* WHY BUSINESSES CHOOSE */}
      <section className="relative overflow-hidden bg-muted/40 py-20">
        <div className="absolute inset-0 bg-blueprint opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading eyebrow="Why Businesses Choose Dev Creative Works" title="Built to perform, designed to impress" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <motion.div
                key={w.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-soft">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-navy">{w.title}</h3>
                <p className="mt-1.5 text-sm text-slate-soft">{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <ReferralForm code={code} />

      {/* FAQ + TERMS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-10 lg:grid-cols-2">
        <div>
          <Heading align="left" eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => <Faq key={f.q} {...f} />)}
          </div>
        </div>
        <div>
          <Heading align="left" eyebrow="Terms & Conditions" title="The fine print" />
          <ul className="mt-8 space-y-3">
            {TERMS.map((t) => (
              <li key={t} className="flex gap-3 rounded-xl border border-border bg-white p-4 text-sm text-slate-soft shadow-soft">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-brand py-20 text-white">
        <div className="absolute inset-0 bg-hex opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold">Start Referring Today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Help businesses build their digital presence while earning rewards for every successful referral.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/refer/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-navy shadow-soft hover:bg-white/90">
              Get My Referral Link <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#refer-form" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold hover:bg-white/10">
              Refer a Business
            </a>
          </div>
          <p className="mt-12 font-display text-lg italic text-white/85">
            "Great businesses grow through great connections. Share opportunities. Create impact. Earn rewards."
          </p>
          <p className="mt-4 text-sm font-bold">Dev Creative Works</p>
          <p className="text-xs text-white/70">Engineering Digital Success Through Creativity & Technology.</p>
        </div>
      </section>

      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-navy">{title}</h2>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24">
      <Heading eyebrow={eyebrow} title={title} />
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="font-semibold text-navy">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-brand transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="border-t border-border px-4 py-3 text-sm text-slate-soft">{a}</p>}
    </div>
  );
}

const INDUSTRIES = ["Startup","Retail / Shop","Education","Temple / Trust","Healthcare","Restaurant / Café","Fashion","Real Estate","Coaching / Consulting","NGO","Events","Manufacturing","E-commerce","Other"];
const BUDGETS = ["Under ₹15,000","₹15,000 – ₹30,000","₹30,000 – ₹60,000","₹60,000 – ₹1,00,000","Above ₹1,00,000","Not sure yet"];

function ReferralForm({ code }: { code?: string }) {
  const [form, setForm] = useState({
    full_name: "", business_name: "", email: "", whatsapp: "", website: "",
    industry: "", budget: "", requirements: "",
  });
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [referrerId, setReferrerId] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    let active = true;
    (async () => {
      const { data } = await supabase.from("referrers").select("id").eq("code", code).maybeSingle();
      if (active) setReferrerId(data?.id ?? null);
    })();
    return () => { active = false; };
  }, [code]);

  const toggle = (s: string) => setServices((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.whatsapp.trim()) {
      toast.error("Name and WhatsApp number are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("referrals").insert({
      ...form,
      services,
      referrer_code: code ?? null,
      referrer_id: referrerId,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
    toast.success("Referral submitted! Our team will reach out soon.");
  };

  return (
    <section id="refer-form" className="relative overflow-hidden py-20 scroll-mt-24">
      <div className="absolute inset-0 bg-diagonal opacity-40" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Heading eyebrow="Referral Form" title="Submit Your Referral" />
        {done ? (
          <div className="mt-10 rounded-3xl border border-brand/30 bg-white p-10 text-center shadow-glow">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-white">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-navy">Referral received 🎉</h3>
            <p className="mt-2 text-sm text-slate-soft">
              We'll contact the business shortly. Track progress anytime from your referral dashboard.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/refer/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white">
                Go to dashboard
              </Link>
              <button onClick={() => { setDone(false); setForm({ full_name: "", business_name: "", email: "", whatsapp: "", website: "", industry: "", budget: "", requirements: "" }); setServices([]); }}
                className="rounded-full border border-border px-6 py-3 text-sm font-bold text-navy">
                Refer another business
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-4 rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Business Name" value={form.business_name} onChange={(v) => setForm({ ...form, business_name: v })} />
              <Field label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="WhatsApp Number *" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
              <Field label="Business Website (Optional)" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
              <div>
                <Label>Industry</Label>
                <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={inputCls}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Services Interested In</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <button type="button" key={s.label} onClick={() => toggle(s.label)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${services.includes(s.label) ? "border-brand bg-gradient-brand text-white" : "border-border text-slate-soft hover:border-brand/40"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Estimated Budget</Label>
              <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputCls}>
                <option value="">Select budget</option>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <Label>Additional Requirements</Label>
              <textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className={inputCls} />
            </div>
            <button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-bold text-white shadow-soft hover:shadow-glow disabled:opacity-60">
              {loading ? "Submitting…" : <>Submit Referral <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export const inputCls = "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{children}</label>;
}

export function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}
