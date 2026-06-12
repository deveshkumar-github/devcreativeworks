import { Eye, Target, Heart } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBg } from "./AnimatedBg";

export function About() {
  const cards = [
    { icon: Heart, title: "Our Story", body: "Every growing business deserves a digital identity. We're building more than websites — we're building brands that inspire trust, attract customers, and create opportunities." },
    { icon: Eye, title: "Vision", body: "To empower 100,000+ businesses with digital transformation — across cities, towns and villages of India." },
    { icon: Target, title: "Mission", body: "Making professional digital solutions accessible to every entrepreneur, school, temple and organization." },
  ];
  return (
    <section id="about" className="relative py-24 bg-muted/40 overflow-hidden">
      <AnimatedBg variant="blueprint" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">About us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">Crafted for businesses that want to be taken seriously.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 border border-border/60 hover:shadow-soft transition-shadow"
            >
              <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-5">
                <c.icon className="w-5 h-5 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-navy mb-2">{c.title}</h3>
              <p className="text-slate-soft leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}