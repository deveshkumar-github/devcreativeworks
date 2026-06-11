import heroAsset from "@/assets/hero-workflow.png.asset.json";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedBg } from "./AnimatedBg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-40 -right-32 w-[400px] h-[400px] rounded-full bg-orange/10 blur-3xl" />
      </div>
      <AnimatedBg variant="grid" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Digital partner for growing businesses
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-navy">
            Build the <span className="text-gradient-brand">Future</span> of Your Business.
          </h1>
          <p className="mt-6 text-lg text-slate-soft max-w-xl leading-relaxed">
            From websites to branding and content, we help businesses establish a strong digital presence that inspires trust and drives growth.
          </p>
          <p className="mt-4 font-display text-lg text-orange italic">
            You Progress. The Nation Follows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand text-white px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all">
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#work" className="inline-flex items-center gap-2 rounded-full border-2 border-navy/10 bg-white text-navy px-7 py-3.5 font-semibold hover:border-navy/30 transition-colors">
              View Our Work
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8">
            <div><div className="font-display text-3xl font-bold text-navy">100+</div><div className="text-xs text-slate-soft uppercase tracking-wider">Projects</div></div>
            <div className="h-10 w-px bg-border" />
            <div><div className="font-display text-3xl font-bold text-navy">5★</div><div className="text-xs text-slate-soft uppercase tracking-wider">Client Rating</div></div>
            <div className="h-10 w-px bg-border" />
            <div><div className="font-display text-3xl font-bold text-navy">24/7</div><div className="text-xs text-slate-soft uppercase tracking-wider">Support</div></div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-brand opacity-10 rounded-3xl blur-2xl" />
          <img src={heroAsset.url} alt="Dev Creative Works digital workflow" className="relative w-full h-auto" />
        </div>
      </div>
    </section>
  );
}