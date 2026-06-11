import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

export function Testimonials() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("status", "active").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    const ch = supabase.channel("testimonials-public").on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, () => qc.invalidateQueries({ queryKey: ["public-testimonials"] })).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <section id="testimonials" className="py-24 overflow-hidden bg-gradient-to-b from-white to-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">Trusted by founders, schools and organizations.</h2>
        </div>
      </div>
      <Marquee items={data ?? []} direction="left" />
      <div className="h-6" />
      <Marquee items={[...(data ?? [])].reverse()} direction="right" />
    </section>
  );
}

type T = { id: string; name: string; business: string | null; quote: string; rating: number | null };

function Marquee({ items, direction }: { items: T[]; direction: "left" | "right" }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <div key={`${t.id}-${i}`} className="bg-white rounded-2xl border border-border/60 p-8 relative w-[380px] flex-shrink-0 shadow-soft hover:shadow-glow transition-shadow">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-brand/10" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating || 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-orange text-orange" />
              ))}
            </div>
            <p className="text-ink leading-relaxed mb-6 line-clamp-5">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
              <div>
                <div className="font-semibold text-navy text-sm">{t.name}</div>
                {t.business && <div className="text-xs text-slate-soft">{t.business}</div>}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}