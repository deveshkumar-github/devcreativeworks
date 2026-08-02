import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Field } from "@/components/refer/ReferPage";
import {
  Users, CheckCircle2, Trophy, Clock, Wallet, Copy, Check, LogOut, Share2, ArrowRight, Gift,
} from "lucide-react";

export const Route = createFileRoute("/refer/dashboard")({
  head: () => ({
    meta: [
      { title: "Referral Dashboard — Dev Creative Works" },
      { name: "description", content: "Track your referrals, statuses and rewards in real time with your Dev Creative Works referral dashboard." },
      { property: "og:title", content: "Referral Dashboard — Dev Creative Works" },
      { property: "og:description", content: "Track your referrals, statuses and rewards in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardRoute,
});

type Referrer = { id: string; full_name: string; email: string; phone: string | null; code: string };
type Referral = {
  id: string; full_name: string; business_name: string | null; created_at: string;
  status: string; project_value: number; reward_amount: number; whatsapp: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-slate-100 text-slate-700",
  contacted: "bg-blue-100 text-blue-700",
  proposal_sent: "bg-indigo-100 text-indigo-700",
  in_discussion: "bg-amber-100 text-amber-700",
  project_confirmed: "bg-emerald-100 text-emerald-700",
  reward_paid: "bg-orange/15 text-orange",
  closed: "bg-rose-100 text-rose-700",
};
export const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  in_discussion: "In Discussion",
  project_confirmed: "Project Confirmed",
  reward_paid: "Reward Paid",
  closed: "Closed",
};

function DashboardRoute() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<Referrer | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const load = useCallback(async (uid: string) => {
    const { data: prof } = await supabase.from("referrers").select("*").eq("user_id", uid).maybeSingle();
    setReferrer((prof as Referrer) ?? null);
    if (prof) {
      const { data: rows } = await supabase
        .from("referrals").select("*").eq("referrer_id", prof.id).order("created_at", { ascending: false });
      setReferrals((rows as Referral[]) ?? []);
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      if (!session?.user) { setReferrer(null); setReferrals([]); }
    });
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) { setUserId(data.user.id); await load(data.user.id); }
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  useEffect(() => { if (userId) load(userId); }, [userId, load]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      {!ready ? (
        <div className="py-32 text-center text-slate-soft">Loading…</div>
      ) : !userId ? (
        <AuthPanel />
      ) : !referrer ? (
        <CreateProfile userId={userId} onDone={() => load(userId)} />
      ) : (
        <DashboardView referrer={referrer} referrals={referrals} />
      )}
      <Footer />
    </div>
  );
}

function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signup"
      ? supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/refer/dashboard" } })
      : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mode === "signup" ? "Account created!" : "Welcome back!");
  };

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-blueprint opacity-30" />
      <div className="relative mx-auto max-w-md px-4">
        <div className="rounded-3xl border border-border bg-white p-7 shadow-soft">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white"><Gift className="h-5 w-5" /></div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-navy">
            {mode === "signup" ? "Create your referral account" : "Referrer login"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-soft">
            Get your unique referral link and track every reward in real time.
          </p>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <button disabled={loading} className="mt-1 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="mt-4 w-full text-sm font-semibold text-brand">
            {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
          <Link to="/refer" className="mt-3 block text-center text-xs text-slate-soft hover:text-brand">← Back to Refer & Earn</Link>
        </div>
      </div>
    </div>
  );
}

function makeCode(name: string, phone: string) {
  const alpha = (name.replace(/[^a-zA-Z]/g, "").toUpperCase() + "DCW").slice(0, 4);
  const digits = (phone.replace(/\D/g, "") + Math.floor(1000 + Math.random() * 9000)).slice(-4);
  return `${alpha}${digits}`;
}

function CreateProfile({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!full_name.trim()) { toast.error("Please enter your name"); return; }
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    for (let i = 0; i < 5; i++) {
      const code = makeCode(full_name, phone);
      const { error } = await supabase.from("referrers").insert({
        user_id: userId, full_name, phone, email: userData.user?.email ?? "", code,
      });
      if (!error) { setLoading(false); onDone(); return; }
      if (!error.message.includes("duplicate")) { setLoading(false); toast.error(error.message); return; }
    }
    setLoading(false);
    toast.error("Could not generate a unique code, please try again");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-border bg-white p-7 shadow-soft">
        <h1 className="font-display text-2xl font-extrabold text-navy">Complete your profile</h1>
        <p className="mt-1.5 text-sm text-slate-soft">We'll generate your unique referral code from this.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="Full Name" value={full_name} onChange={setName} />
          <Field label="WhatsApp Number" value={phone} onChange={setPhone} />
          <button disabled={loading} className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Creating…" : "Get my referral link"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardView({ referrer, referrals }: { referrer: Referrer; referrals: Referral[] }) {
  const [copied, setCopied] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/refer/${referrer.code}?utm_source=referral&utm_medium=direct&utm_campaign=client_referral`;

  const total = referrals.length;
  const qualified = referrals.filter((r) => ["contacted", "proposal_sent", "in_discussion", "project_confirmed", "reward_paid"].includes(r.status)).length;
  const won = referrals.filter((r) => ["project_confirmed", "reward_paid"].includes(r.status)).length;
  const pending = referrals.filter((r) => ["submitted", "contacted", "proposal_sent", "in_discussion"].includes(r.status)).length;
  const rewards = referrals.reduce((s, r) => s + Number(r.reward_amount || 0), 0);

  const stats = [
    { label: "Total Referrals", value: total, icon: Users, color: "text-brand bg-brand/10" },
    { label: "Qualified Leads", value: qualified, icon: CheckCircle2, color: "text-indigo-600 bg-indigo-50" },
    { label: "Projects Won", value: won, icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Projects", value: pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Rewards Earned", value: `₹${rewards.toLocaleString("en-IN")}`, icon: Wallet, color: "text-orange bg-orange/10" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-navy p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute inset-0 bg-hex opacity-40" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/30 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Welcome back</p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold">{referrer.full_name}</h1>
            <p className="mt-1 text-sm text-white/70">Your referral code · <span className="font-bold text-orange">{referrer.code}</span></p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold hover:bg-white/10">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
        <div className="relative mt-6 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:flex-row sm:items-center">
          <span className="flex-1 truncate px-2 text-xs text-white/80">{link}</span>
          <div className="flex gap-2">
            <button onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy link"}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Get a modern website & branding from Dev Creative Works: ${link}`)}`}
              target="_blank" rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold">
              <Share2 className="h-3.5 w-3.5" /> Share
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.color}`}><s.icon className="h-4 w-4" /></span>
            <p className="mt-3 font-display text-2xl font-extrabold text-navy">{s.value}</p>
            <p className="text-xs text-slate-soft">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-bold text-navy">Referral History</h2>
          <Link to="/refer" className="inline-flex items-center gap-1 text-xs font-bold text-brand">
            Refer a business <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {referrals.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-soft">No referrals yet — share your link to get started.</p>
        ) : (
          <>
            {/* mobile cards */}
            <div className="grid gap-3 p-4 md:hidden">
              {referrals.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-navy">{r.full_name}</p>
                      <p className="text-xs text-slate-soft">{r.business_name || "—"}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-slate-soft">Date</p><p className="font-semibold text-ink">{new Date(r.created_at).toLocaleDateString("en-IN")}</p></div>
                    <div><p className="text-slate-soft">Value</p><p className="font-semibold text-ink">₹{Number(r.project_value).toLocaleString("en-IN")}</p></div>
                    <div><p className="text-slate-soft">Reward</p><p className="font-semibold text-orange">₹{Number(r.reward_amount).toLocaleString("en-IN")}</p></div>
                  </div>
                </div>
              ))}
            </div>
            {/* desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-slate-soft">
                  <tr>
                    {["Referral", "Business", "Date", "Status", "Project Value", "Reward", "Action"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-5 py-3 font-semibold text-navy">{r.full_name}</td>
                      <td className="px-5 py-3 text-slate-soft">{r.business_name || "—"}</td>
                      <td className="px-5 py-3 text-slate-soft">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3">₹{Number(r.project_value).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 font-semibold text-orange">₹{Number(r.reward_amount).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3">
                        {r.whatsapp ? (
                          <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand">Message</a>
                        ) : <span className="text-xs text-slate-soft">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-soft">
        Rewards are credited after the referred client confirms the project and completes the initial payment.
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
