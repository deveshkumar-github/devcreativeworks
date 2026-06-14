import { Search, PenTool, Code2, Rocket, TrendingUp, Workflow } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  { icon: Search,     title: "Discover", duration: "Week 1",   body: "Deep-dive into your business, audience and goals to define the brief." },
  { icon: PenTool,    title: "Design",   duration: "Week 2",   body: "Strategy, moodboards, visuals and the brand experience." },
  { icon: Code2,      title: "Develop",  duration: "Week 3-4", body: "Engineering performant, scalable and pixel-perfect solutions." },
  { icon: Rocket,     title: "Launch",   duration: "Week 5",   body: "QA, polish and going live with confidence and clarity." },
  { icon: TrendingUp, title: "Grow",     duration: "Ongoing",  body: "Continuous support, iteration and growth optimization." },
];

export function Process() {
  return (
    <section id="process" className="relative py-28 overflow-hidden bg-gradient-to-b from-[#f7f9ff] via-white to-[#fff7f0]">
      {/* decorative blobs + grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-brand/15 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-20 w-[460px] h-[460px] rounded-full bg-orange/15 blur-3xl animate-blob-slow" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-brand/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand shadow-soft"
          >
            <Workflow className="w-3.5 h-3.5" /> Our process
          </motion.span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-navy leading-tight">
            From idea to{" "}
            <span className="bg-gradient-to-r from-brand via-brand to-orange bg-clip-text text-transparent">
              measurable growth
            </span>
          </h2>
          <p className="mt-4 text-slate-soft">
            A clear five-step journey designed for speed, clarity and results.
          </p>
        </div>

        {/* DESKTOP — horizontal timeline */}
        <div className="relative hidden lg:block">
          {/* connector line */}
          <div className="absolute top-[88px] left-[6%] right-[6%] h-[3px] rounded-full bg-gradient-to-r from-brand/20 via-brand/60 to-orange/60" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className="absolute top-[88px] left-[6%] right-[6%] h-[3px] rounded-full bg-gradient-to-r from-brand to-orange"
          />

          <ol className="grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.12 }}
                className="relative"
              >
                {/* node */}
                <div className="relative mx-auto w-[176px] flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-brand/20 blur-xl animate-pulse-ring" aria-hidden />
                    <div className="relative h-[88px] w-[88px] rounded-full bg-white ring-4 ring-white shadow-[0_18px_40px_-12px_rgba(21,101,216,0.45)] flex items-center justify-center">
                      <div className="h-[70px] w-[70px] rounded-full bg-gradient-to-br from-brand to-orange flex items-center justify-center">
                        <s.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                        0{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* card */}
                  <div className="mt-6 w-full text-center rounded-2xl bg-white/90 backdrop-blur ring-1 ring-border/60 p-5 hover:-translate-y-1.5 hover:shadow-glow transition-all duration-300">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange">{s.duration}</p>
                    <h3 className="mt-1.5 font-display text-lg font-bold text-navy">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-soft leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* MOBILE / TABLET — vertical timeline */}
        <ol className="lg:hidden relative max-w-xl mx-auto">
          <div className="absolute left-[27px] top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-brand via-brand to-orange opacity-80" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pl-20 pb-8 last:pb-0"
            >
              <div className="absolute left-0 top-0 h-[56px] w-[56px] rounded-full bg-white shadow-soft ring-4 ring-white flex items-center justify-center">
                <div className="h-[44px] w-[44px] rounded-full bg-gradient-to-br from-brand to-orange flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-border/60 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="font-display text-lg font-bold text-navy">
                    <span className="text-orange mr-2">0{i + 1}.</span>{s.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange whitespace-nowrap">{s.duration}</span>
                </div>
                <p className="text-sm text-slate-soft leading-relaxed">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}