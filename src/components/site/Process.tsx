import { Search, PenTool, Code2, Rocket, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBg } from "./AnimatedBg";

const steps = [
  { icon: Search, title: "Discover", body: "Understanding your business, audience and goals." },
  { icon: PenTool, title: "Design", body: "Creating strategy, visuals and the brand experience." },
  { icon: Code2, title: "Develop", body: "Building high-performance, scalable solutions." },
  { icon: Rocket, title: "Launch", body: "Going live with confidence and clarity." },
  { icon: TrendingUp, title: "Grow", body: "Continuous support, iteration and optimization." },
];

export function Process() {
  return (
    <section id="process" className="relative py-24 overflow-hidden">
      <AnimatedBg variant="circuit" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Our process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">A simple, proven journey from idea to growth.</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-border/60 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div whileHover={{ rotate: -10, scale: 1.1 }} className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-white" />
                </motion.div>
                <span className="font-display text-2xl font-bold text-muted-foreground/30">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-navy mb-1">{s.title}</h3>
              <p className="text-sm text-slate-soft leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}