import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import { getPaymentBySlug } from "@/lib/payments.functions";
import { CheckCircle2, MessageCircle, QrCode, X, Sparkles, ShieldCheck, Copy, Check, Lock, ChevronDown, LayoutDashboard, AlertTriangle, Info, Wallet, Calendar, Video, Rocket, Clock, Users, ClipboardList } from "lucide-react";
import logoAsset from "@/assets/dev-logo.png.asset.json";

type Installment = {
  id?: string;
  label: string;
  amount: number;
  paid?: boolean;
  paid_at?: string | null;
  due_date?: string | null;
};

type DashPage = {
  id: string;
  label: string;
  checked?: boolean;
  locked?: boolean;
  children?: DashPage[];
};

type DashNote = { title?: string; body: string; tone?: "info" | "warning" };

type SessionSummary = {
  discussed?: string;
  decisions?: string;
  changes?: string;
  approved?: string;
  dev_actions?: string;
  client_actions?: string;
  next_session?: string;
  related?: string;
};

type MeetSession = {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes?: number;
  agenda?: string | null;
  related_section?: string | null;
  meet_link?: string | null;
  status?: string;
  participants?: string[];
  summary?: SessionSummary | null;
  client_acknowledged?: boolean;
};

export const Route = createFileRoute("/pay/$slug")({
  loader: async ({ params }) => {
    const payment = await getPaymentBySlug({ data: { slug: params.slug } });
    if (!payment) throw notFound();
    return { payment };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.payment ? `Pay ${loaderData.payment.title} — Dev Creative Works` : "Payment" },
      { name: "description", content: "Secure payment page from Dev Creative Works." },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
  errorComponent: () => <PayFallback message="Something went wrong loading this payment." />,
  notFoundComponent: () => <PayFallback message="This payment link is invalid or no longer active." />,
  component: PayPage,
});

function PayFallback({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6 text-center">
      <div className="max-w-md">
        <div className="text-5xl mb-3">🔒</div>
        <h1 className="font-display font-bold text-navy text-2xl">Payment unavailable</h1>
        <p className="text-slate-soft mt-2">{message}</p>
      </div>
    </div>
  );
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function PayPage() {
  const { payment } = Route.useLoaderData();
  const installments: Installment[] = Array.isArray(payment.installments) ? (payment.installments as Installment[]) : [];
  const sessions: MeetSession[] = Array.isArray((payment as { sessions?: MeetSession[] }).sessions) ? ((payment as { sessions?: MeetSession[] }).sessions as MeetSession[]) : [];
  const launchAt = (payment as { launch_at?: string | null }).launch_at || null;

  const total = Number(payment.total_amount) || 0;
  const paidAmount = installments.filter((i) => i.paid).reduce((a, b) => a + Number(b.amount || 0), 0);
  const remaining = Math.max(0, total - paidAmount);
  const progressPct = total > 0 ? Math.min(100, Math.round((paidAmount / total) * 100)) : 0;

  const [selected, setSelected] = useState<Installment | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const activeAmount = selected ? Number(selected.amount) : Number(customAmount) || 0;
  const paymentLocked = !!(payment as { payment_locked?: boolean }).payment_locked;
  const notes: DashNote[] = Array.isArray(payment.dashboard_notes) ? (payment.dashboard_notes as DashNote[]) : [];

  // First-visit important notes modal (per slug)
  const noteKey = `dcw-notes-agreed-${payment.slug}`;
  const [showNotes, setShowNotes] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (notes.length === 0) return;
    if (!window.localStorage.getItem(noteKey)) setShowNotes(true);
  }, [noteKey, notes.length]);
  const agreeNotes = () => {
    try { window.localStorage.setItem(noteKey, new Date().toISOString()); } catch { /* ignore */ }
    setShowNotes(false);
  };

  const now = Date.now();
  const upcomingSessions = sessions.filter((s) => new Date(s.scheduled_at).getTime() + (s.duration_minutes || 30) * 60000 > now);
  const completedSessions = sessions.filter((s) => new Date(s.scheduled_at).getTime() + (s.duration_minutes || 30) * 60000 <= now).reverse();

  const [tab, setTab] = useState<"overview" | "dashboard" | "sessions">("overview");
  const tabs = [
    { id: "overview" as const, label: "Payment", icon: <Wallet className="w-5 h-5" /> },
    ...(payment.dashboard_enabled ? [{ id: "dashboard" as const, label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> }] : []),
    { id: "sessions" as const, label: "Sessions", icon: <Video className="w-5 h-5" /> },
  ];

  const brandBlock = (
    <div className="flex items-center gap-3 min-w-0">
      {payment.logo_url ? (
        <img src={payment.logo_url} alt="" className="h-11 w-11 rounded-2xl object-contain bg-white p-1.5 shrink-0" />
      ) : (
        <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-orange" /></div>
      )}
      <div className="min-w-0">
        <div className="font-display font-bold text-white text-sm leading-tight truncate">{payment.title}</div>
        <div className="text-[11px] text-white/60 leading-tight flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Client portal</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fc] lg:flex">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-0 h-screen bg-navy text-white p-5">
        <div className="flex items-center gap-2 pb-5 border-b border-white/10">
          <img src={logoAsset.url} className="h-9 w-9 object-contain" alt="" />
          <span className="font-display font-bold text-sm">Dev Creative Works</span>
        </div>

        <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-3">{brandBlock}</div>

        <nav className="mt-5 space-y-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${tab === t.id ? "bg-white text-navy" : "text-white/70 hover:bg-white/10"}`}
            >
              {tab === t.id && <motion.span layoutId="navpill" className="absolute inset-0 rounded-xl bg-white -z-10" />}
              <span className={tab === t.id ? "text-brand" : ""}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Payment progress</div>
          <div className="font-display text-3xl font-extrabold mt-1">{progressPct}%</div>
          <div className="mt-2 h-1.5 rounded-full bg-white/15 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-brand to-orange" />
          </div>
          <div className="mt-2 text-[11px] text-white/60">{formatINR(paidAmount)} of {formatINR(total)}</div>
        </div>

        <div className="mt-auto pt-5 space-y-2">
          <a href="https://wa.me/917013906671" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-2.5 text-xs font-semibold">
            <MessageCircle className="w-4 h-4" /> WhatsApp support
          </a>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10"
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
          </button>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden sticky top-0 z-30 bg-navy text-white px-4 pt-3 pb-4 rounded-b-3xl">
        <div className="flex items-center justify-between gap-3">
          {brandBlock}
          <a href="https://wa.me/917013906671" className="shrink-0 h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Paid so far</div>
            <div className="font-display text-2xl font-extrabold leading-tight">{formatINR(paidAmount)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Progress</div>
            <div className="font-display text-2xl font-extrabold leading-tight text-orange">{progressPct}%</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/15 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-brand to-orange" />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 pt-5 lg:pt-8 pb-28 lg:pb-12">
        <div className="mx-auto w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {tab === "overview" && (
                <>
                  <div className="hidden lg:flex items-center justify-between">
                    <div>
                      <h1 className="font-display font-bold text-navy text-2xl">Payment overview</h1>
                      <p className="text-sm text-slate-soft">Track total, paid & remaining for this project</p>
                    </div>
                  </div>

                  {payment.description && (
                    <div className="rounded-2xl bg-white border border-border p-4 text-sm text-slate-soft whitespace-pre-line">{payment.description}</div>
                  )}

                  {paymentLocked && (
                    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0"><Lock className="w-5 h-5" /></div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-amber-800 text-sm sm:text-base">Payment is not open yet</div>
                        <div className="text-xs sm:text-sm text-amber-800/90 mt-0.5">Your payment window has been temporarily locked. When it's opened, our team will contact you directly. You can still review the project dashboard.</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatTile label="Total" value={formatINR(total)} tone="navy" />
                    <StatTile label="Paid" value={formatINR(paidAmount)} tone="emerald" />
                    <StatTile label="Remaining" value={formatINR(remaining)} tone="orange" />
                    <StatTile label="Progress" value={`${progressPct}%`} tone="brand" />
                  </div>

                  <LaunchCard launchAt={launchAt} />

                  {installments.length > 0 && (
                    <section className="rounded-3xl bg-white border border-border/70 p-5 sm:p-6 shadow-[0_20px_60px_-40px_rgba(21,101,216,0.5)]">
                      <SectionHeader icon={<ClipboardList className="w-5 h-5 text-brand" />} title="Payment schedule" subtitle={`${installments.filter(i => i.paid).length} of ${installments.length} milestones cleared`} />
                      <ul className="mt-5 space-y-2.5">
                        {installments.map((inst, i) => {
                          const paid = !!inst.paid;
                          return (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`relative flex items-center gap-3 rounded-2xl border p-3.5 sm:p-4 overflow-hidden ${paid ? "bg-emerald-50/60 border-emerald-200" : "bg-white border-border hover:border-brand/40 transition-colors"}`}
                            >
                              <span className={`absolute left-0 top-0 bottom-0 w-1 ${paid ? "bg-emerald-500" : "bg-brand/60"}`} />
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${paid ? "bg-emerald-500 text-white" : "bg-brand/10 text-brand font-bold"}`}>
                                {paid ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-navy text-sm sm:text-base truncate">{inst.label}</div>
                                <div className="text-xs text-slate-soft flex flex-wrap gap-x-2">
                                  <span>{paid ? `Received${inst.paid_at ? ` · ${new Date(inst.paid_at).toLocaleDateString()}` : ""}` : "Pending"}</span>
                                  {inst.due_date && !paid && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {new Date(inst.due_date).toLocaleDateString()}</span>}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-display font-bold text-navy">{formatINR(Number(inst.amount) || 0)}</div>
                                {!paid && !paymentLocked && (
                                  <button onClick={() => { setSelected(inst); setCustomOpen(false); }} className="mt-1 text-[11px] font-semibold text-brand hover:underline">Pay now →</button>
                                )}
                                {!paid && paymentLocked && (
                                  <div className="mt-1 text-[11px] font-semibold text-amber-700 inline-flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</div>
                                )}
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </section>
                  )}

                  {remaining > 0 && paymentLocked && (
                    <div className="rounded-3xl bg-white border border-border p-6 text-center">
                      <Lock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <div className="font-display font-bold text-navy text-base">Payment link is currently locked</div>
                      <div className="text-xs text-slate-soft mt-1">If it's opened, we will reach out to you on WhatsApp.</div>
                      <a href="https://wa.me/917013906671" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2">
                        <MessageCircle className="w-3.5 h-3.5" /> Contact us
                      </a>
                    </div>
                  )}

                  {remaining === 0 && total > 0 && (
                    <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <div className="font-display font-bold text-emerald-700 text-lg">All paid up. Thank you!</div>
                      <div className="text-sm text-emerald-700/80">Your project payment is complete.</div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-soft">
                    <ShieldCheck className="w-3.5 h-3.5" /> UPI · Google Pay · PhonePe · Paytm
                  </div>
                </>
              )}

              {tab === "dashboard" && payment.dashboard_enabled && (
                <ProjectDashboard
                  title={payment.dashboard_title || `${payment.title} Dashboard`}
                  pages={Array.isArray(payment.dashboard_pages) ? (payment.dashboard_pages as DashPage[]) : []}
                  notes={notes}
                />
              )}

              {tab === "sessions" && <SessionsSection upcoming={upcomingSessions} completed={completedSessions} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ===== STICKY PAY BAR (mobile + desktop) ===== */}
      {tab === "overview" && remaining > 0 && !paymentLocked && (
        <div className="fixed bottom-16 lg:bottom-6 left-0 right-0 z-30 px-4 lg:pl-[300px] lg:pr-10 pointer-events-none">
          <div className="mx-auto max-w-4xl flex gap-2 pointer-events-auto">
            <button
              onClick={() => { setSelected(null); setCustomOpen(true); setCustomAmount(String(remaining)); }}
              className="flex-1 rounded-2xl bg-gradient-brand text-white py-3.5 font-semibold shadow-glow"
            >
              Pay remaining · {formatINR(remaining)}
            </button>
            <button
              onClick={() => { setSelected(null); setCustomOpen(true); setCustomAmount(""); }}
              className="rounded-2xl bg-white border border-border text-navy px-4 py-3.5 font-semibold shadow-soft"
            >
              Custom
            </button>
          </div>
        </div>
      )}

      {/* ===== MOBILE BOTTOM TABS ===== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0,1fr))` }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold ${tab === t.id ? "text-brand" : "text-slate-soft"}`}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showNotes && notes.length > 0 && (
          <ImportantNotesModal key="notes" notes={notes} projectTitle={payment.title} onAgree={agreeNotes} />
        )}
        {(selected || customOpen) && activeAmount > 0 && (
          <QRModal
            key="qrmodal"
            amount={activeAmount}
            label={selected?.label || "Custom payment"}
            upiId={payment.upi_id || ""}
            upiName={payment.upi_name || "Dev Creative Works"}
            whatsappNumber={payment.whatsapp_number || "917013906671"}
            projectTitle={payment.title}
            onClose={() => { setSelected(null); setCustomOpen(false); }}
          />
        )}
        {customOpen && !selected && activeAmount <= 0 && (
          <CustomAmountModal
            key="custom"
            max={remaining}
            value={customAmount}
            onChange={setCustomAmount}
            onClose={() => setCustomOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <h2 className="font-display font-bold text-navy text-lg sm:text-xl leading-tight truncate">{title}</h2>
        {subtitle && <div className="text-xs text-slate-soft">{subtitle}</div>}
      </div>
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: string; tone: "navy" | "emerald" | "orange" | "brand" }) {
  const tones: Record<string, string> = {
    navy: "bg-navy/5 text-navy border-navy/10",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    brand: "bg-brand/10 text-brand border-brand/20",
  };
  return (
    <div className={`rounded-2xl border p-3 ${tones[tone]}`}>
      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70">{label}</div>
      <div className="font-display text-base sm:text-lg font-bold mt-0.5 truncate">{value}</div>
    </div>
  );
}

function ImportantNotesModal({ notes, projectTitle, onAgree }: { notes: DashNote[]; projectTitle: string; onAgree: () => void }) {
  return _ImportantNotesModal({ notes, projectTitle, onAgree });
}

function LaunchCard({ launchAt }: { launchAt: string | null }) {
  const date = launchAt ? new Date(launchAt) : null;
  const valid = date && !isNaN(date.getTime());
  const now = new Date();
  const diff = valid ? date!.getTime() - now.getTime() : 0;
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const launched = valid && diff <= 0;
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-white border border-border/70 p-6 sm:p-7 shadow-[0_20px_60px_-30px_rgba(234,88,12,0.35)]"
    >
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange/15 blur-3xl" />
      <div className="relative flex items-center gap-4 sm:gap-5">
        <motion.div
          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange to-brand text-white flex items-center justify-center flex-shrink-0 shadow-soft"
        >
          <Rocket className="w-7 h-7" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-soft font-semibold">Website Launch Date</div>
          {!valid ? (
            <>
              <div className="font-display text-xl sm:text-2xl font-bold text-navy">Coming Soon</div>
              <div className="text-xs sm:text-sm text-slate-soft mt-0.5">Launch date will be shared soon.</div>
            </>
          ) : launched ? (
            <>
              <div className="font-display text-xl sm:text-2xl font-bold text-emerald-600">🎉 Launched!</div>
              <div className="text-xs sm:text-sm text-slate-soft mt-0.5">{date!.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
            </>
          ) : (
            <>
              <div className="font-display text-lg sm:text-2xl font-bold text-navy leading-tight">{date!.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>
              <div className="text-xs sm:text-sm text-slate-soft mt-0.5 inline-flex items-center gap-1.5 flex-wrap"><Clock className="w-3.5 h-3.5" /> {date!.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}<span className="text-orange font-semibold">· in {days}d {hours}h</span></div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function SessionsSection({ upcoming, completed }: { upcoming: MeetSession[]; completed: MeetSession[] }) {
  return (
    <section className="rounded-3xl bg-white border border-border/70 p-6 sm:p-7 shadow-[0_20px_60px_-30px_rgba(21,101,216,0.25)]">
      <SectionHeader icon={<Calendar className="w-5 h-5 text-brand" />} title="Google Meet Sessions" subtitle="Scheduled reviews & call summaries" />
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <div className="text-[11px] uppercase tracking-widest text-slate-soft font-semibold">Upcoming · {upcoming.length}</div>
        </div>
        {upcoming.length === 0 && <EmptySession label="No upcoming sessions yet" />}
        {upcoming.map((s) => <SessionCard key={s.id} s={s} state="upcoming" />)}

        <div className="flex items-center gap-2 pt-3">
          <span className="h-2 w-2 rounded-full bg-slate-soft/50" />
          <div className="text-[11px] uppercase tracking-widest text-slate-soft font-semibold">Completed · {completed.length}</div>
        </div>
        {completed.length === 0 && <EmptySession label="No completed sessions yet" />}
        {completed.map((s) => <SessionCard key={s.id} s={s} state="completed" />)}
      </div>
    </section>
  );
}

function EmptySession({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-white/60 p-5 text-center text-sm text-slate-soft">{label}</div>;
}

function SessionCard({ s, state }: { s: MeetSession; state: "upcoming" | "completed" }) {
  const [open, setOpen] = useState(state === "upcoming");
  const d = new Date(s.scheduled_at);
  const summary = s.summary || {};
  const hasSummary = summary && Object.values(summary).some(Boolean);
  const fields: Array<[keyof SessionSummary, string, string]> = [
    ["discussed", "What we discussed", "💬"],
    ["decisions", "Decisions made", "✅"],
    ["changes", "Changes requested", "✏️"],
    ["approved", "Client approved", "👍"],
    ["dev_actions", "Developer action items", "🛠️"],
    ["client_actions", "Client action items", "📋"],
    ["next_session", "Next session / follow-up", "🔁"],
    ["related", "Related sections", "🔗"],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`rounded-2xl border p-4 ${state === "upcoming" ? "bg-white border-brand/20 shadow-soft" : "bg-muted/40 border-border"}`}
    >
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-start gap-3">
        <div className={`h-11 w-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${state === "upcoming" ? "bg-gradient-brand text-white" : "bg-navy/80 text-white"}`}>
          <span className="text-[10px] uppercase leading-none opacity-80">{d.toLocaleString("en-IN", { month: "short" })}</span>
          <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-navy text-sm sm:text-base">{s.title}</span>
            <StatusPill state={state} hasSummary={hasSummary} acknowledged={!!s.client_acknowledged} />
          </div>
          <div className="text-xs text-slate-soft mt-0.5 inline-flex items-center gap-1.5"><Clock className="w-3 h-3" /> {d.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {s.duration_minutes || 30} min</div>
          {s.related_section && <div className="text-xs text-brand mt-0.5">§ {s.related_section}</div>}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-3 mt-3 border-t border-border space-y-3">
              {s.agenda && (
                <div><div className="text-[11px] uppercase tracking-widest text-slate-soft font-semibold mb-1 inline-flex items-center gap-1"><ClipboardList className="w-3 h-3" /> Agenda</div><div className="text-sm text-navy whitespace-pre-line">{s.agenda}</div></div>
              )}
              {s.participants && s.participants.length > 0 && (
                <div className="text-xs text-slate-soft inline-flex items-center gap-1.5 flex-wrap"><Users className="w-3 h-3" /> {s.participants.join(", ")}</div>
              )}
              {state === "upcoming" && s.meet_link && (
                <a href={s.meet_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-[#00897B] text-white px-5 py-3 text-sm font-semibold hover:bg-[#00695C] transition-colors">
                  <Video className="w-4 h-4" /> Join Google Meet
                </a>
              )}
              {state === "completed" && hasSummary && (
                <div className="rounded-xl bg-white border border-border p-3 space-y-2.5">
                  <div className="text-[11px] uppercase tracking-widest text-brand font-semibold">Session summary</div>
                  {fields.map(([k, label, emoji]) => summary[k] ? (
                    <div key={k}>
                      <div className="text-xs font-semibold text-navy">{emoji} {label}</div>
                      <div className="text-sm text-slate-soft whitespace-pre-line mt-0.5">{summary[k]}</div>
                    </div>
                  ) : null)}
                  {s.client_acknowledged && <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1"><CheckCircle2 className="w-4 h-4" /> Client acknowledged</div>}
                </div>
              )}
              {state === "completed" && !hasSummary && (
                <div className="text-xs text-slate-soft italic">Summary will be shared soon.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusPill({ state, hasSummary, acknowledged }: { state: "upcoming" | "completed"; hasSummary: boolean; acknowledged: boolean }) {
  if (state === "upcoming") return <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Scheduled</span>;
  if (acknowledged) return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Acknowledged</span>;
  if (hasSummary) return <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 text-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Summary added</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-muted text-slate-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Completed</span>;
}

function _ImportantNotesModal({ notes, projectTitle, onAgree }: { notes: DashNote[]; projectTitle: string; onAgree: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-navy/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-glow overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="relative bg-gradient-brand text-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest opacity-80">Please read before proceeding</div>
              <h3 className="font-display font-bold text-lg sm:text-xl truncate">Important Notes</h3>
              <div className="text-xs opacity-80 truncate">{projectTitle}</div>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <ol className="space-y-3">
            {notes.map((n, i) => {
              const warn = n.tone === "warning";
              return (
                <li key={i} className={`rounded-2xl border p-3.5 flex gap-3 ${warn ? "bg-red-50/60 border-red-200" : "bg-muted/40 border-border"}`}>
                  <div className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${warn ? "bg-red-500 text-white" : "bg-brand/10 text-brand"}`}>
                    {warn ? <AlertTriangle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div className="min-w-0">
                    {n.title && <div className={`font-semibold text-sm ${warn ? "text-red-700" : "text-navy"}`}>{n.title}</div>}
                    <div className={`text-sm mt-0.5 whitespace-pre-line ${warn ? "text-red-700/90" : "text-slate-soft"}`}>{n.body}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="p-4 sm:p-5 border-t border-border bg-white">
          <button
            onClick={onAgree}
            className="w-full rounded-2xl bg-gradient-brand text-white py-4 font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> I agree & continue
          </button>
          <div className="text-[11px] text-slate-soft text-center mt-2">By continuing you acknowledge the notes above.</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CustomAmountModal({ max, value, onChange, onClose }: { max: number; value: string; onChange: (v: string) => void; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-glow" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-navy text-lg">Enter amount</h3>
        <p className="text-xs text-slate-soft mt-1">Max {formatINR(max)}</p>
        <div className="mt-4 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-soft font-semibold">₹</span>
          <input autoFocus type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-border bg-muted/40 pl-9 pr-4 py-4 text-xl font-display font-bold text-navy focus:outline-none focus:border-brand focus:bg-white" placeholder="0" />
        </div>
        <button onClick={onClose} disabled={!Number(value)} className="mt-5 w-full rounded-2xl bg-gradient-brand text-white py-3.5 font-semibold shadow-soft disabled:opacity-40">Continue to QR</button>
      </motion.div>
    </motion.div>
  );
}

function QRModal({ amount, label, upiId, upiName, whatsappNumber, projectTitle, onClose }: { amount: number; label: string; upiId: string; upiName: string; whatsappNumber: string; projectTitle: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: amount.toFixed(2),
      cu: "INR",
      tn: `${projectTitle} - ${label}`.slice(0, 80),
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, upiName, amount, label, projectTitle]);

  useEffect(() => {
    if (canvasRef.current && upiId) {
      QRCode.toCanvas(canvasRef.current, upiUrl, { width: 240, margin: 1, color: { dark: "#183b56", light: "#ffffff" } }).catch(() => {});
    }
  }, [upiUrl, upiId]);

  const whatsappMessage = `Hi Dev Creative Works! I've made a payment.%0A%0A*Project:* ${encodeURIComponent(projectTitle)}%0A*For:* ${encodeURIComponent(label)}%0A*Amount:* ₹${amount.toLocaleString("en-IN")}%0A%0APlease confirm receipt. Thank you!`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-glow overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-brand text-white p-6 text-center">
          <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"><X className="w-4 h-4" /></button>
          <div className="text-[11px] uppercase tracking-widest opacity-80">Amount to pay</div>
          <div className="font-display text-4xl font-bold mt-1">{formatINR(amount)}</div>
          <div className="text-xs opacity-80 mt-1">{label}</div>
        </div>

        {!confirmed ? (
          <div className="p-6">
            {upiId ? (
              <>
                <div className="relative mx-auto w-fit">
                  <motion.div
                    animate={{ y: [0, 232, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_12px_rgba(21,101,216,0.6)] rounded-full z-10 pointer-events-none"
                    style={{ top: 4 }}
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-2xl border-2 border-brand/20 p-3 bg-white relative overflow-hidden"
                  >
                    <canvas ref={canvasRef} className="block" />
                    {/* Corner brackets */}
                    {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg", "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg"].map((cls, i) => (
                      <span key={i} className={`absolute ${cls} border-brand w-5 h-5 m-1.5`} />
                    ))}
                  </motion.div>
                </div>
                <p className="text-center text-xs text-slate-soft mt-3 flex items-center justify-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" /> Scan with any UPI app
                </p>
                <a
                  href={upiUrl}
                  className="mt-4 flex sm:hidden w-full rounded-2xl bg-navy text-white py-3.5 font-semibold justify-center shadow-soft"
                >Open UPI app</a>
              </>
            ) : (
              <div className="text-center text-sm text-slate-soft py-8">UPI ID not configured yet. Please contact us on WhatsApp to complete payment.</div>
            )}

            <div className="mt-5 rounded-2xl bg-muted/50 p-3 text-xs text-slate-soft text-center">
              After paying, tap the button below and share the screenshot on WhatsApp.
            </div>

            <button
              onClick={() => setConfirmed(true)}
              className="mt-4 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 font-semibold shadow-soft flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> I've paid
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="mx-auto w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4"
            >
              <CheckCircle2 className="w-11 h-11" />
            </motion.div>
            <h3 className="font-display font-bold text-navy text-xl">Almost there!</h3>
            <p className="text-sm text-slate-soft mt-2">Send us your payment screenshot on WhatsApp so we can confirm and update your progress.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 font-semibold shadow-soft"
            >
              <MessageCircle className="w-5 h-5" /> Send confirmation on WhatsApp
            </a>
            <button onClick={onClose} className="mt-2 w-full text-xs text-slate-soft py-2">Close</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function countPages(pages: DashPage[]): { done: number; total: number } {
  let done = 0, total = 0;
  const walk = (list: DashPage[]) => {
    for (const p of list) {
      total++;
      if (p.checked) done++;
      if (p.children?.length) walk(p.children);
    }
  };
  walk(pages);
  return { done, total };
}

function ProjectDashboard({ title, pages, notes }: { title: string; pages: DashPage[]; notes: DashNote[] }) {
  const { done, total } = countPages(pages);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-8 relative overflow-hidden rounded-3xl bg-white border border-border/70 shadow-[0_20px_60px_-30px_rgba(21,101,216,0.25)]"
    >
      <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white flex-shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-brand">Your Dashboard</div>
            <h2 className="font-display font-bold text-navy text-lg sm:text-xl leading-tight truncate">{title}</h2>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand/5 via-white to-orange/5 border border-border/60 p-5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-soft">Website progress</div>
              <div className="font-display text-3xl font-bold text-navy">{pct}%</div>
            </div>
            <div className="text-right text-xs text-slate-soft">
              <b className="text-navy font-display text-lg">{done}</b> / {total} sections<br />
              <span className="text-[11px]">completed</span>
            </div>
          </div>
          <div className="relative h-3 rounded-full bg-white overflow-hidden border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand via-brand to-orange rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/25 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Pages */}
        {pages.length > 0 && (
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-soft mb-3">Pages & Features</div>
            <ul className="space-y-1.5">
              {pages.map((p, i) => <PageRow key={p.id || i} page={p} depth={0} index={i} />)}
            </ul>
          </div>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <div className="mt-8">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-soft mb-3">Important Notes</div>
            <ol className="space-y-2.5">
              {notes.map((n, i) => {
                const warn = n.tone === "warning";
                return (
                  <li key={i} className={`rounded-2xl border p-4 flex gap-3 ${warn ? "bg-red-50/60 border-red-200" : "bg-muted/40 border-border"}`}>
                    <div className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${warn ? "bg-red-500 text-white" : "bg-brand/10 text-brand"}`}>
                      {warn ? <AlertTriangle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      {n.title && <div className={`font-semibold text-sm ${warn ? "text-red-700" : "text-navy"}`}>{n.title}</div>}
                      <div className={`text-sm mt-0.5 whitespace-pre-line ${warn ? "text-red-700/90" : "text-slate-soft"}`}>{n.body}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div className="relative px-6 sm:px-8 py-3 border-t border-border/60 bg-muted/30 flex items-center gap-2 text-[11px] text-slate-soft">
        <Info className="w-3.5 h-3.5" />
        <span>A <Lock className="inline w-3 h-3 -mt-0.5 text-amber-500" /> lock icon on a yellow row means the page is approved and finalized — no further changes will be made.</span>
      </div>
    </motion.section>
  );
}

function PageRow({ page, depth, index }: { page: DashPage; depth: number; index: number }) {
  const [open, setOpen] = useState(true);
  const hasKids = !!page.children?.length;
  return (
    <li>
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.03 }}
        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${page.locked ? "bg-amber-50 border-amber-300 shadow-[0_0_0_1px_rgba(245,158,11,0.15)]" : page.checked ? "bg-brand/5 border-brand/20" : "bg-white border-border"}`}
        style={{ marginLeft: depth * 20 }}
      >
        {hasKids ? (
          <button onClick={() => setOpen(!open)} className="h-5 w-5 flex items-center justify-center text-slate-soft hover:text-brand flex-shrink-0">
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "" : "-rotate-90"}`} />
          </button>
        ) : <span className="w-5 flex-shrink-0" />}
        <div className={`h-5 w-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${page.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-soft/40 bg-white"}`}>
          {page.checked && <Check className="w-3 h-3" strokeWidth={3} />}
        </div>
        <span className={`text-sm flex-1 min-w-0 truncate ${page.locked ? "text-amber-900 font-medium" : page.checked ? "text-navy font-medium" : "text-slate-soft"} ${page.locked ? "line-through decoration-amber-400" : ""}`}>
          {page.label}
        </span>
        {page.locked && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200 rounded-full px-2 py-0.5 border border-amber-300">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </motion.div>
      {hasKids && open && (
        <ul className="mt-1.5 space-y-1.5">
          {page.children!.map((c, i) => <PageRow key={c.id || i} page={c} depth={depth + 1} index={i} />)}
        </ul>
      )}
    </li>
  );
}