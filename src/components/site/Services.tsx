import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

export function Services() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("status", "active").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    const ch = supabase.channel("services-public").on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => qc.invalidateQueries({ queryKey: ["public-services"] })).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const items = data ?? [];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <section id="services" ref={containerRef} className="relative" style={{ height: `${Math.max(items.length, 1) * 90 + 40}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-muted/30 to-white" style={{ perspective: "1400px" }}>
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-2xl mb-10 text-center mx-auto" style={{ opacity: useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [1, 1, 1, 0.4]) }}>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">What we do</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy">Everything your brand needs.</h2>
            <p className="mt-3 text-slate-soft">Scroll to explore each service →</p>
          </motion.div>
          <div className="relative h-[420px] flex items-center justify-center">
            {items.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} total={items.length} progress={scrollYProgress} />
            ))}
            {items.length === 0 && <p className="text-slate-soft text-sm">Services are coming soon.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

type ServiceRow = { id: string; title: string; description: string | null; pricing: string | null; icon: string | null; thumbnail_url: string | null };

function ServiceCard({ service, index, total, progress }: { service: ServiceRow; index: number; total: number; progress: MotionValue<number> }) {
  const span = 1 / Math.max(total, 1);
  const start = index * span;
  const end = start + span;
  const mid = start + span * 0.5;

  const opacity = useTransform(progress, [start, start + span * 0.15, end - span * 0.15, end], [0, 1, 1, 0]);
  const rotateX = useTransform(progress, [start, mid, end], [55, 0, -55]);
  const y = useTransform(progress, [start, mid, end], [120, 0, -120]);
  const scale = useTransform(progress, [start, mid, end], [0.8, 1, 0.8]);

  const Icon = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[service.icon || "Sparkles"] || Icons.Sparkles;

  return (
    <motion.div
      className="absolute inset-0 mx-auto max-w-3xl"
      style={{ opacity, rotateX, y, scale, transformStyle: "preserve-3d" }}
    >
      <div className="bg-white rounded-3xl border border-border/60 shadow-glow overflow-hidden grid md:grid-cols-2 h-full">
        <div className="relative bg-gradient-to-br from-brand/10 via-white to-orange/10 flex items-center justify-center p-8">
          {service.thumbnail_url ? (
            <img src={service.thumbnail_url} alt={service.title} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <div className="h-28 w-28 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Icon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-orange uppercase mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" /> 0{index + 1} / 0{total}
          </div>
          <h3 className="font-display text-3xl font-bold text-navy mb-3">{service.title}</h3>
          <p className="text-slate-soft leading-relaxed">{service.description}</p>
          {service.pricing && <p className="mt-5 text-sm font-bold text-brand">{service.pricing}</p>}
        </div>
      </div>
    </motion.div>
  );
}