import { motion } from "motion/react";
import { ArrowRight, Target, Zap, BadgeDollarSign, Lightbulb, Users, Sparkles } from "lucide-react";

const items = [
  { icon: Target, title: "Impact-Driven Solutions", body: "Every product we build is custom-crafted to create real business impact." },
  { icon: Zap, title: "Fast & Reliable Delivery", body: "Get high-quality results in days or weeks — not months." },
  { icon: BadgeDollarSign, title: "Transparent & Fair Pricing", body: "Honest, customized pricing with no hidden fees or surprises." },
  { icon: Lightbulb, title: "Expert Problem Solvers", body: "We tackle technical and creative challenges with innovative solutions." },
  { icon: Users, title: "Seamless Collaboration", body: "Clear communication and feedback at every stage of the project." },
  { icon: Sparkles, title: "Direct Access to Top Talent", body: "Work directly with senior experts — no long-term hiring needed." },
];

export function WhyUs() {
  return (
    <section className="relative py-24 bg-[#f5f7fb] overflow-hidden">
      {/* Dashed framing lines */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-y-0 left-8 sm:left-16 border-l border-dashed border-navy/15" />
        <div className="absolute inset-y-0 right-8 sm:right-16 border-r border-dashed border-navy/15" />
        <div className="absolute top-32 inset-x-0 border-t border-dashed border-navy/15" />
        <div className="absolute bottom-28 inset-x-0 border-t border-dashed border-navy/15" />
        <div className="absolute top-1/2 inset-x-0 border-t border-dashed border-navy/10" />
      </div>

      {/* Floating background blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-orange/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-navy">
            Why Choose <span className="text-gradient-brand">Dev Creative Works?</span>
          </h2>
          <p className="mt-4 text-slate-soft">
            Discover the advantages of partnering with a creative tech team that's built for results and client success.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative text-center px-4"
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, -4, 4, 0], scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto mb-6 h-20 w-20 flex items-center justify-center"
              >
                <span className="absolute inset-0 rounded-3xl bg-brand/10 group-hover:bg-brand/15 transition-colors" />
                <span className="absolute -inset-2 rounded-3xl border border-dashed border-brand/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <item.icon className="relative w-10 h-10 text-brand" strokeWidth={1.8} />
                <motion.span
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
              <h3 className="font-display text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-slate-soft leading-relaxed max-w-xs mx-auto">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="#book"
            className="group inline-flex items-center gap-2 rounded-full bg-navy hover:bg-ink text-white px-7 py-3.5 font-semibold shadow-soft transition-all"
          >
            Reserve Your Slot
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}