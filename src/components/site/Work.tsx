import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBg } from "./AnimatedBg";

export function Work() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("status", "published").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    const ch = supabase.channel("projects-public").on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => qc.invalidateQueries({ queryKey: ["public-projects"] })).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <section id="work" className="relative py-28 overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0f1a33] to-[#0b1220] text-white">
      <AnimatedBg variant="hex" />
      {/* glowing orbs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-brand/30 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-orange/25 blur-[120px] animate-pulse" />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-orange" /> Featured work
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              Real businesses.{" "}
              <span className="bg-gradient-to-r from-[#5aa9ff] via-white to-[#ffb072] bg-clip-text text-transparent">
                Real results.
              </span>
            </h2>
            <p className="mt-4 text-white/60 max-w-xl">
              A curated selection of recent launches — brands we've built, shipped and scaled.
            </p>
          </motion.div>
          <Link
            to="/"
            hash="contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-navy px-5 py-2.5 text-sm font-semibold hover:bg-orange hover:text-white transition-colors"
          >
            Start a project <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              {/* gradient border */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand/60 via-white/10 to-orange/60 opacity-60 group-hover:opacity-100 blur-[1px] transition-opacity" />
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="relative block rounded-2xl overflow-hidden bg-[#0e1a30]/90 backdrop-blur ring-1 ring-white/10 h-full"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-white/30 font-display text-7xl">
                      {p.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/30 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md ring-1 ring-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                    {p.category}
                  </span>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(p.tags ?? []).slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium bg-white/5 ring-1 ring-white/10 px-2.5 py-1 rounded-full text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}