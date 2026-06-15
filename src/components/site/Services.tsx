import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";
import { motion } from "motion/react";

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

  return (
    <section id="services" className="relative py-20 sm:py-28 bg-gradient-to-b from-white via-muted/30 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14 sm:mb-18 text-center mx-auto"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">What we do</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-navy">Everything your brand needs.</h2>
          <p className="mt-3 text-slate-soft">Explore the services we offer to grow your business.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-slate-soft text-sm text-center">Services are coming soon.</p>
        )}
      </div>
    </section>
  );
}

type ServiceRow = { id: string; title: string; description: string | null; pricing: string | null; icon: string | null; thumbnail_url: string | null };

function ServiceCard({ service, index }: { service: ServiceRow; index: number }) {
  const Icon = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[service.icon || "Sparkles"] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl border border-border/60 shadow-soft hover:shadow-glow transition-all duration-300 overflow-hidden"
    >
      <div className="relative bg-gradient-to-br from-brand/10 via-white to-orange/10 flex items-center justify-center p-8 h-44">
        {service.thumbnail_url ? (
          <img src={service.thumbnail_url} alt={service.title} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <div className="h-20 w-20 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-10 h-10 text-white" />
          </div>
        )}
      </div>
      <div className="p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wider text-orange uppercase mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" /> 0{index + 1}
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-navy mb-2">{service.title}</h3>
        <p className="text-slate-soft leading-relaxed text-sm">{service.description}</p>
        {service.pricing && <p className="mt-4 text-sm font-bold text-brand">{service.pricing}</p>}
      </div>
    </motion.div>
  );
}