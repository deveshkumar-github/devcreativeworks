import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-soft hover:text-brand mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <p className="text-sm font-semibold uppercase tracking-wider text-orange mb-3">{p.category}</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-navy">{p.title}</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          {(p.tags ?? []).map((t: string) => (
            <span key={t} className="text-xs bg-muted px-3 py-1 rounded-full text-slate-soft">{t}</span>
          ))}
        </div>
        {p.live_link && (
          <a href={p.live_link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand text-white px-6 py-3 font-semibold shadow-soft">
            Visit Live Site <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {p.thumbnail_url && (
          <div className="mt-10 aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
            <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mt-12 grid gap-8">
          {p.challenge && <CaseBlock title="Challenge" body={p.challenge} />}
          {p.solution && <CaseBlock title="Solution" body={p.solution} />}
          {p.result && <CaseBlock title="Result" body={p.result} />}
        </div>
      </article>
      <Footer />
    </div>
  );
}

function CaseBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-border/60">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">{title}</h2>
      <p className="text-ink leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}