import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";

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

  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">What we do</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">Everything your brand needs to look and feel professional.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((s) => {
            const Icon = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[s.icon || "Sparkles"] || Icons.Sparkles;
            return (
              <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-8 hover:border-brand/40 hover:shadow-soft transition-all">
                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"><Icon className="w-6 h-6 text-orange" /></div>
                <h3 className="text-xl font-semibold text-navy mb-2">{s.title}</h3>
                <p className="text-slate-soft leading-relaxed mb-4">{s.description}</p>
                {s.pricing && <p className="text-sm font-semibold text-brand">{s.pricing}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}