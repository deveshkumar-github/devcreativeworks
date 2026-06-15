import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Logo = { id: string; name: string; logo_url: string; link: string | null };

export function LogoMarquee() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["client-logos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_logos")
        .select("*")
        .eq("status", "active")
        .order("sort_order");
      if (error) throw error;
      return data as Logo[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("client-logos-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "client_logos" }, () =>
        qc.invalidateQueries({ queryKey: ["client-logos"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const logos = data ?? [];
  if (logos.length === 0) return null;

  // Repeat the sequence enough times to always fill the viewport, even with 4 logos
  const repeats = logos.length <= 4 ? 6 : logos.length <= 8 ? 3 : 2;
  const track = Array.from({ length: repeats }, () => logos).flat();

  return (
    <section
      aria-label="Trusted by leading brands"
      className="relative py-12 sm:py-16 bg-white border-y border-border/60 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-soft">
          Brands & businesses we've worked with
        </p>
      </div>

      {/* Marquee — duplicated track for seamless loop */}
      <div
        className="group relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div className="flex w-max animate-marquee-x group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center gap-12 sm:gap-20 px-6 sm:px-10">
              {track.map((l, i) => (
                <li
                  key={`${dup}-${l.id}-${i}`}
                  className="shrink-0 h-14 sm:h-16 flex items-center"
                >
                  {l.link ? (
                    <a href={l.link} target="_blank" rel="noreferrer" aria-label={l.name}>
                      <LogoImg l={l} />
                    </a>
                  ) : (
                    <LogoImg l={l} />
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoImg({ l }: { l: Logo }) {
  return (
    <img
      src={l.logo_url}
      alt={l.name}
      loading="lazy"
      className="h-10 sm:h-14 w-auto max-w-[180px] sm:max-w-[220px] object-contain opacity-90 hover:opacity-100 transition duration-300"
    />
  );
}