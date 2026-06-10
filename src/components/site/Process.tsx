import { Search, PenTool, Code2, Rocket, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover", body: "Understanding your business, audience and goals." },
  { icon: PenTool, title: "Design", body: "Creating strategy, visuals and the brand experience." },
  { icon: Code2, title: "Develop", body: "Building high-performance, scalable solutions." },
  { icon: Rocket, title: "Launch", body: "Going live with confidence and clarity." },
  { icon: TrendingUp, title: "Grow", body: "Continuous support, iteration and optimization." },
];

export function Process() {
  return (
    <section id="process" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Our process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">A simple, proven journey from idea to growth.</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-white rounded-2xl p-6 border border-border/60 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center"><s.icon className="w-5 h-5 text-white" /></div>
                <span className="font-display text-2xl font-bold text-muted-foreground/30">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-navy mb-1">{s.title}</h3>
              <p className="text-sm text-slate-soft leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}