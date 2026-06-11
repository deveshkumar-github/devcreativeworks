import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
    <section id="work" className="relative py-24 bg-muted/40 overflow-hidden">
      <AnimatedBg variant="grid" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Featured work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">Real businesses. Real results.</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {(data ?? []).map((p) => (
            <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="group block bg-white rounded-2xl overflow-hidden border border-border/60 hover:shadow-soft transition-all">
              <div className="aspect-[16/9] bg-gradient-brand relative overflow-hidden">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/40 font-display text-6xl">{p.title.charAt(0)}</div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange">{p.category}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-soft group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">{p.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {(p.tags ?? []).slice(0, 3).map((t: string) => (
                    <span key={t} className="text-xs bg-muted px-2.5 py-1 rounded-full text-slate-soft">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}