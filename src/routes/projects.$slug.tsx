import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, ExternalLink, Target, Lightbulb, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy">Project not found</h1>
        <Link to="/" className="text-brand mt-4 inline-block">Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-soft">{error.message}</p>
    </div>
  ),
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen" />;
  if (!p) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0f1a33] to-[#0b1220] text-white">
          <div className="pointer-events-none absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-brand/30 blur-[120px] animate-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 w-[480px] h-[480px] rounded-full bg-orange/25 blur-[120px] animate-pulse" />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }} />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
            <Link to="/" hash="work" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to work
            </Link>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              {p.category && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-orange">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                  {p.category}
                </span>
              )}
              <h1 className="mt-5 text-4xl sm:text-6xl font-bold leading-[1.05]">
                {p.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {(p.tags ?? []).map((t: string) => (
                  <span key={t} className="text-xs bg-white/5 ring-1 ring-white/10 px-3 py-1 rounded-full text-white/80">
                    {t}
                  </span>
                ))}
              </div>
              {p.live_link && (
                <a href={p.live_link} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-navy px-6 py-3 text-sm font-semibold hover:bg-orange hover:text-white transition-colors">
                  Visit live site <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </div>

          {p.thumbnail_url && (
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              >
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/40 via-transparent to-transparent" />
              </motion.div>
            </div>
          )}
        </section>

        {/* CASE STUDY */}
        <section className="relative bg-gradient-to-b from-[#f7f9ff] via-white to-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
            {p.challenge && (
              <CaseBlock index="01" icon={Target}    title="The Challenge" body={p.challenge} accent="brand" />
            )}
            {p.solution && (
              <CaseBlock index="02" icon={Lightbulb} title="Our Solution"  body={p.solution}  accent="orange" />
            )}
            {p.result && (
              <CaseBlock index="03" icon={Trophy}    title="The Result"    body={p.result}    accent="brand" />
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#13265a] to-[#0b1220] text-white p-10 sm:p-14 text-center ring-1 ring-white/10"
          >
            <div className="pointer-events-none absolute -top-24 -left-20 w-[300px] h-[300px] rounded-full bg-brand/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 w-[340px] h-[340px] rounded-full bg-orange/30 blur-3xl" />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-orange">
              <Sparkles className="w-3.5 h-3.5" /> Let's build yours
            </span>
            <h2 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight">
              Ready to start{" "}
              <span className="bg-gradient-to-r from-[#5aa9ff] via-white to-[#ffb072] bg-clip-text text-transparent">
                your project?
              </span>
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Tell us where you want to go — we'll design, build and ship it with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/" hash="contact" className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-6 py-3 text-sm font-semibold hover:bg-orange hover:text-white transition-colors">
                Start your project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/" hash="work" className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/25 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
                View more work
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CaseBlock({
  index, icon: Icon, title, body, accent,
}: {
  index: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  accent: "brand" | "orange";
}) {
  const accentClass = accent === "brand" ? "from-brand to-brand/70" : "from-orange to-orange/70";
  const ringClass = accent === "brand" ? "ring-brand/20" : "ring-orange/20";
  const labelClass = accent === "brand" ? "text-brand" : "text-orange";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className={`relative bg-white rounded-3xl p-7 sm:p-10 ring-1 ${ringClass} shadow-soft hover:shadow-glow transition-shadow`}
    >
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${accentClass} flex items-center justify-center text-white shadow-soft`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className={`font-display text-sm font-bold tracking-widest ${labelClass}`}>{index}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">{title}</h2>
          </div>
          <p className="mt-3 text-ink/90 leading-relaxed whitespace-pre-line text-[15px] sm:text-base">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}