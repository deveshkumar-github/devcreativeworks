import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import { getPaymentBySlug } from "@/lib/payments.functions";
import { CheckCircle2, MessageCircle, QrCode, X, Sparkles, ShieldCheck, Copy, Check, Lock, ChevronDown, LayoutDashboard, AlertTriangle, Info, Wallet } from "lucide-react";
import logoAsset from "@/assets/dev-logo.png.asset.json";

type Installment = {
  id?: string;
  label: string;
  amount: number;
  paid?: boolean;
  paid_at?: string | null;
};

type DashPage = {
  id: string;
  label: string;
  checked?: boolean;
  locked?: boolean;
  children?: DashPage[];
};

type DashNote = { title?: string; body: string; tone?: "info" | "warning" };

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8ff] via-white to-[#fff7ed]">
      <header className="mx-auto max-w-3xl px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src={logoAsset.url} className="h-9 w-9 object-contain" alt="" />
          <div className="min-w-0">
            <div className="font-display font-bold text-navy text-sm leading-tight">Dev Creative Works</div>
            <div className="text-[11px] text-slate-soft leading-tight flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure payment</div>
          </div>
        </div>
        <a href="https://wa.me/917013906671" className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" /> Help
        </a>
      </header>

      {/* Top nav tabs */}
      {payment.dashboard_enabled && (
        <nav className="sticky top-0 z-20 mx-auto max-w-3xl px-4 sm:px-6 pt-1 pb-3 bg-gradient-to-b from-white/95 to-white/70 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white border border-border p-1.5 shadow-soft">
            <button onClick={() => scrollTo("pay-section")} className="rounded-xl py-2.5 text-sm font-semibold text-navy hover:bg-brand/5 inline-flex items-center justify-center gap-1.5">
              <Wallet className="w-4 h-4 text-brand" /> Payment
            </button>
            <button onClick={() => scrollTo("dashboard-section")} className="rounded-xl py-2.5 text-sm font-semibold text-navy hover:bg-brand/5 inline-flex items-center justify-center gap-1.5">
              <LayoutDashboard className="w-4 h-4 text-brand" /> Your Dashboard
            </button>
          </div>
        </nav>
      )}

      <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
        {/* Card */}
        <motion.section
          id="pay-section"
          style={{ scrollMarginTop: 88 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-white border border-border/70 shadow-[0_20px_60px_-30px_rgba(21,101,216,0.35)]"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-orange/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {payment.logo_url ? (
                <img src={payment.logo_url} alt="" className="h-14 w-14 rounded-xl object-contain bg-muted p-1.5 border border-border" />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gradient-brand flex items-center justify-center text-white"><Sparkles className="w-6 h-6" /></div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-navy text-xl sm:text-2xl leading-tight">{payment.title}</h1>
                {payment.description && <p className="text-sm text-slate-soft mt-1 whitespace-pre-line">{payment.description}</p>}
              </div>
            </div>

            {paymentLocked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 flex gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-amber-800 text-sm sm:text-base">Payment is not open yet</div>
                  <div className="text-xs sm:text-sm text-amber-800/90 mt-0.5">Your payment window has been temporarily locked. When it's opened, our team will contact you directly. You can still review the project dashboard below.</div>
                </div>
              </motion.div>
            )}

            {/* Progress */}
            <div className="mt-7">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-soft">Total project value</div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-navy">{formatINR(total)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-soft">Paid so far</div>
                  <div className="font-display text-lg font-bold text-emerald-600">{formatINR(paidAmount)}</div>
                </div>
              </div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand via-brand to-orange rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-slate-soft">
                <span>{progressPct}% complete</span>
                <span>Remaining <b className="text-navy">{formatINR(remaining)}</b></span>
              </div>
            </div>

            {/* Installments */}
            {installments.length > 0 && (
              <div className="mt-8">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-soft mb-3">Payment schedule</div>
                <ul className="space-y-2.5">
                  {installments.map((inst, i) => {
                    const paid = !!inst.paid;
                    return (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 sm:p-4 ${paid ? "bg-emerald-50/60 border-emerald-200" : "bg-white border-border"}`}
                      >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${paid ? "bg-emerald-500 text-white" : "bg-brand/10 text-brand font-bold"}`}>
                          {paid ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-navy text-sm sm:text-base truncate">{inst.label}</div>
                          <div className="text-xs text-slate-soft">
                            {paid ? `Received${inst.paid_at ? ` · ${new Date(inst.paid_at).toLocaleDateString()}` : ""}` : "Pending"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-navy">{formatINR(Number(inst.amount) || 0)}</div>
                          {!paid && !paymentLocked && (
                            <button
                              onClick={() => { setSelected(inst); setCustomOpen(false); }}
                              className="mt-1 text-[11px] font-semibold text-brand hover:underline"
                            >Pay now →</button>
                          )}
                          {!paid && paymentLocked && (
                            <div className="mt-1 text-[11px] font-semibold text-amber-700 inline-flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</div>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* CTA */}
            {remaining > 0 && !paymentLocked && (
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { setSelected(null); setCustomOpen(true); setCustomAmount(String(remaining)); }}
                  className="rounded-2xl bg-gradient-brand text-white py-4 font-semibold shadow-soft hover:shadow-glow transition-all"
                >
                  Pay remaining · {formatINR(remaining)}
                </button>
                <button
                  onClick={() => { setSelected(null); setCustomOpen(true); setCustomAmount(""); }}
                  className="rounded-2xl bg-white border border-border text-navy py-4 font-semibold hover:border-brand transition-all"
                >
                  Pay custom amount
                </button>
              </div>
            )}
            {remaining > 0 && paymentLocked && (
              <div className="mt-8 rounded-2xl bg-navy/5 border border-navy/10 p-5 text-center">
                <Lock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="font-display font-bold text-navy text-base">Payment link is currently locked</div>
                <div className="text-xs text-slate-soft mt-1">If it's opened, we will reach out to you on WhatsApp.</div>
                <a href="https://wa.me/917013906671" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Contact us
                </a>
              </div>
            )}
            {remaining === 0 && total > 0 && (
              <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <div className="font-display font-bold text-emerald-700 text-lg">All paid up. Thank you!</div>
                <div className="text-sm text-emerald-700/80">Your project payment is complete.</div>
              </div>
            )}
          </div>

          <div className="relative px-6 sm:px-8 py-4 border-t border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-soft">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> UPI · Google Pay · PhonePe · Paytm</div>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="inline-flex items-center gap-1.5 hover:text-brand"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied link</> : <><Copy className="w-3.5 h-3.5" /> Copy link</>}
            </button>
          </div>
        </motion.section>

        <p className="text-center text-xs text-slate-soft mt-6">
          Questions? <a href="https://wa.me/917013906671" className="text-brand font-semibold">WhatsApp us</a>
        </p>

        {payment.dashboard_enabled && (
          <div id="dashboard-section" style={{ scrollMarginTop: 88 }}>
            <ProjectDashboard
              title={payment.dashboard_title || `${payment.title} Dashboard`}
              pages={Array.isArray(payment.dashboard_pages) ? (payment.dashboard_pages as DashPage[]) : []}
              notes={notes}
            />
          </div>
        )}
      </main>

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

function ImportantNotesModal({ notes, projectTitle, onAgree }: { notes: DashNote[]; projectTitle: string; onAgree: () => void }) {
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
        <span>A <Lock className="inline w-3 h-3 -mt-0.5" /> lock icon means the page is approved and finalized — no further changes will be made.</span>
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
        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${page.locked ? "bg-emerald-50/50 border-emerald-200" : page.checked ? "bg-brand/5 border-brand/20" : "bg-white border-border"}`}
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
        <span className={`text-sm flex-1 min-w-0 truncate ${page.checked ? "text-navy font-medium" : "text-slate-soft"} ${page.locked ? "line-through decoration-emerald-500/50" : ""}`}>
          {page.label}
        </span>
        {page.locked && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
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