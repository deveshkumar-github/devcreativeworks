import { Check } from "lucide-react";

const items = ["Modern Design", "Mobile First", "Fast Delivery", "Affordable Pricing", "Long-Term Partnership", "Growth Focused"];

export function WhyUs() {
  return (
    <section className="py-24 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange mb-3">Why choose us</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Built for outcomes — not just deliverables.</h2>
            <p className="mt-4 text-white/70 leading-relaxed max-w-md">
              We're a long-term partner that obsesses over your growth — from first concept to ongoing iterations.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-5 py-4">
                <div className="h-8 w-8 rounded-lg bg-orange flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-white" /></div>
                <span className="font-medium">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}