import heroAsset from "@/assets/hero-workflow.png.asset.json";
import { ArrowRight, Sparkles, Star, Play } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBg } from "./AnimatedBg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AnimatedBg variant="mesh" />
      {/* Soft brand orbs */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 w-[460px] h-[460px] rounded-full bg-orange/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT — copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          {/* Live status pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/70 backdrop-blur px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand shadow-sm mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-orange animate-ping opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-orange" />
            </span>
            <Sparkles className="w-3.5 h-3.5" />
            Digital partner · India
          </div>

          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.02] text-navy tracking-tight">
            Build the{" "}
            <span className="relative inline-block">
              <span className="text-gradient-brand">Future</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2 8 Q 50 1 100 6 T 198 5" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            of Your Business.
          </h1>

          <p className="mt-7 text-lg text-slate-soft max-w-xl leading-relaxed">
            From websites to branding and content, we craft digital experiences that inspire trust and drive measurable growth.
          </p>
          <p className="mt-3 font-display text-base text-orange italic">
            You Progress. The Nation Follows.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-navy text-white px-7 py-4 font-semibold shadow-[0_18px_40px_-14px_rgba(21,101,216,0.45)] hover:-translate-y-0.5 transition-all"
            >
              Start Your Project
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange group-hover:rotate-[-45deg] transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 text-navy font-semibold"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full border border-navy/15 bg-white group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-colors">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              View Our Work
            </a>
          </div>

          {/* Trust row — bento */}
          <div className="mt-12 grid grid-cols-3 gap-3 max-w-lg">
            {[
              { v: "100+", l: "Projects", c: "text-navy" },
              { v: "5.0★", l: "Rating", c: "text-orange", highlight: true },
              { v: "24/7", l: "Support", c: "text-navy" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                className={`rounded-2xl px-4 py-3 text-center bg-white/80 backdrop-blur border ${
                  s.highlight ? "border-orange/30 ring-4 ring-orange/5" : "border-border"
                }`}
              >
                <div className={`font-display text-2xl font-extrabold ${s.c}`}>{s.v}</div>
                <div className="text-[10px] font-bold text-slate-soft uppercase tracking-wider mt-0.5">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          {/* Floating accent cards */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-2 z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-white shadow-xl border border-border px-3.5 py-2.5"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand/10 text-brand">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-soft font-bold">Launching</div>
              <div className="text-xs font-bold text-navy">New Project</div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-3 -right-2 z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-white shadow-xl border border-border px-3.5 py-2.5"
          >
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-orange text-orange" />
              ))}
            </div>
            <div className="text-xs font-bold text-navy">5.0 · 100+ clients</div>
          </motion.div>

          <div className="relative rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-brand opacity-10 blur-2xl" />
            <img
              src={heroAsset.url}
              alt="Dev Creative Works digital workflow"
              className="relative w-full h-auto"
            />
          </div>

          {/* Bottom accent bar */}
          <div className="mt-4 h-1.5 w-full rounded-full bg-gradient-to-r from-brand via-brand to-orange" />
        </motion.div>
      </div>
    </section>
  );
}