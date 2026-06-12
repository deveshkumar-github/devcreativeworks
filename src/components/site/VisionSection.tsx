import mapAsset from "@/assets/india-map.png.asset.json";
import { motion } from "motion/react";
import { AnimatedBg } from "./AnimatedBg";

export function VisionSection() {
  return (
    <section className="relative py-24 bg-muted/40 overflow-hidden">
      <AnimatedBg variant="aurora" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-orange mb-3">Our vision</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">
            Every business <span className="text-gradient-brand">online.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-soft leading-relaxed">
            Imagine every local business, temple, startup, school and entrepreneur having a professional digital presence.
            That's the future we're building — one brand at a time.
          </p>
          <p className="mt-8 font-display text-2xl text-navy italic">
            You Progress. <span className="text-orange">The Nation Follows.</span>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.img
            src={mapAsset.url}
            alt="Digital network across India"
            className="w-full h-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}