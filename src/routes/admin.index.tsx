import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUpsert,
  adminDelete,
  adminListContacts,
  adminListAllProjects,
  adminListAllServices,
  adminListAllTestimonials,
  adminListAllClientLogos,
  adminListAllPayments,
} from "@/lib/admin.functions";
import { useAdminAuth, clearAdminPassword } from "@/lib/use-admin";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Pencil, MessageCircle, X, Briefcase, Layers, Star, Inbox, Building2, Wallet, Copy, Check, ExternalLink, Lock, Unlock, ChevronRight, ChevronDown, LayoutDashboard, GripVertical } from "lucide-react";
import logoAsset from "@/assets/dev-logo.png.asset.json";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

type Tab = "projects" | "services" | "testimonials" | "logos" | "contacts" | "payments";

function AdminPage() {
  const { authenticated, ready, password } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("projects");

  useEffect(() => {
    if (ready && !authenticated) navigate({ to: "/admin/login" });
  }, [ready, authenticated, navigate]);

  if (!ready || !authenticated || !password) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} className="h-9 w-9 object-contain" alt="" />
            <div>
              <div className="font-display font-bold text-navy text-sm leading-tight">Dev Creative Works</div>
              <div className="text-xs text-slate-soft leading-tight">Admin dashboard</div>
            </div>
          </Link>
          <button
            onClick={() => { clearAdminPassword(); navigate({ to: "/admin/login" }); }}
            className="inline-flex items-center gap-2 text-sm text-slate-soft hover:text-brand"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} icon={Briefcase}>Projects</TabBtn>
          <TabBtn active={tab === "services"} onClick={() => setTab("services")} icon={Layers}>Services</TabBtn>
          <TabBtn active={tab === "testimonials"} onClick={() => setTab("testimonials")} icon={Star}>Testimonials</TabBtn>
          <TabBtn active={tab === "logos"} onClick={() => setTab("logos")} icon={Building2}>Client Logos</TabBtn>
          <TabBtn active={tab === "payments"} onClick={() => setTab("payments")} icon={Wallet}>Payments</TabBtn>
          <TabBtn active={tab === "contacts"} onClick={() => setTab("contacts")} icon={Inbox}>Leads</TabBtn>
        </div>
        {tab === "projects" && <ProjectsTab password={password} />}
        {tab === "services" && <ServicesTab password={password} />}
        {tab === "testimonials" && <TestimonialsTab password={password} />}
        {tab === "logos" && <ClientLogosTab password={password} />}
        {tab === "payments" && <PaymentsTab password={password} />}
        {tab === "contacts" && <ContactsTab password={password} />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${active ? "bg-gradient-brand text-white shadow-soft" : "bg-white text-slate-soft hover:text-navy border border-border"}`}>
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

/* ------------ PROJECTS ------------ */
function ProjectsTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllProjects);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const { data } = useQuery({ queryKey: ["admin-projects"], queryFn: () => list({ data: { password } }) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "projects", row } }),
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-projects"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { password, table: "projects", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-projects"] }); },
  });

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Portfolio items shown on the website" onAdd={() => setEditing({ status: "draft", tags: [] })} />
      <div className="grid gap-3">
        {(data ?? []).map((p) => (
          <RowCard key={p.id as string}
            title={p.title as string}
            subtitle={`${p.category ?? ""} · ${p.status}`}
            thumbnail={p.thumbnail_url as string}
            onEdit={() => setEditing(p as Record<string, unknown>)}
            onDelete={() => remove.mutate(p.id as string)}
          />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit project" : "New project"} onClose={() => setEditing(null)}>
          <ProjectForm initial={editing} onSubmit={(row) => save.mutate(row)} saving={save.isPending} password={password} />
        </Modal>
      )}
    </div>
  );
}

function ProjectForm({ initial, onSubmit, saving, password }: { initial: Record<string, unknown>; onSubmit: (r: Record<string, unknown>) => void; saving: boolean; password: string }) {
  const [f, setF] = useState({
    id: (initial.id as string) || undefined,
    title: (initial.title as string) || "",
    slug: (initial.slug as string) || "",
    category: (initial.category as string) || "",
    live_link: (initial.live_link as string) || "",
    tags: ((initial.tags as string[]) || []).join(", "),
    thumbnail_url: (initial.thumbnail_url as string) || "",
    challenge: (initial.challenge as string) || "",
    solution: (initial.solution as string) || "",
    result: (initial.result as string) || "",
    status: (initial.status as string) || "draft",
    sort_order: (initial.sort_order as number) ?? 0,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean), slug: f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }); }} className="space-y-4">
      <FieldRow label="Title *"><TextInput value={f.title} onChange={(v) => setF({ ...f, title: v })} required /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Slug (URL)"><TextInput value={f.slug} onChange={(v) => setF({ ...f, slug: v })} placeholder="auto from title" /></FieldRow>
        <FieldRow label="Category"><TextInput value={f.category} onChange={(v) => setF({ ...f, category: v })} /></FieldRow>
      </div>
      <FieldRow label="Live link"><TextInput value={f.live_link} onChange={(v) => setF({ ...f, live_link: v })} placeholder="https://..." /></FieldRow>
      <FieldRow label="Tags (comma separated)"><TextInput value={f.tags} onChange={(v) => setF({ ...f, tags: v })} /></FieldRow>
      <FieldRow label="Thumbnail (1280×720)"><ImageUpload value={f.thumbnail_url} onChange={(v) => setF({ ...f, thumbnail_url: v })} password={password} /></FieldRow>
      <FieldRow label="Challenge"><TextArea value={f.challenge} onChange={(v) => setF({ ...f, challenge: v })} /></FieldRow>
      <FieldRow label="Solution"><TextArea value={f.solution} onChange={(v) => setF({ ...f, solution: v })} /></FieldRow>
      <FieldRow label="Result"><TextArea value={f.result} onChange={(v) => setF({ ...f, result: v })} /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-brand">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FieldRow>
        <FieldRow label="Sort order"><TextInput type="number" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: Number(v) || 0 })} /></FieldRow>
      </div>
      <SaveBtn saving={saving} />
    </form>
  );
}

/* ------------ SERVICES ------------ */
function ServicesTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllServices);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const { data } = useQuery({ queryKey: ["admin-services"], queryFn: () => list({ data: { password } }) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "services", row } }),
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { password, table: "services", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-services"] }); },
  });
  return (
    <div>
      <SectionHeader title="Services" subtitle="Offerings shown on the homepage" onAdd={() => setEditing({ status: "active" })} />
      <div className="grid gap-3">
        {(data ?? []).map((s) => (
          <RowCard key={s.id as string}
            title={s.title as string}
            subtitle={`${s.pricing ?? ""} · ${s.status}`}
            thumbnail={s.thumbnail_url as string}
            onEdit={() => setEditing(s as Record<string, unknown>)}
            onDelete={() => remove.mutate(s.id as string)}
          />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit service" : "New service"} onClose={() => setEditing(null)}>
          <ServiceForm initial={editing} onSubmit={(row) => save.mutate(row)} saving={save.isPending} password={password} />
        </Modal>
      )}
    </div>
  );
}

function ServiceForm({ initial, onSubmit, saving, password }: { initial: Record<string, unknown>; onSubmit: (r: Record<string, unknown>) => void; saving: boolean; password: string }) {
  const [f, setF] = useState({
    id: (initial.id as string) || undefined,
    title: (initial.title as string) || "",
    description: (initial.description as string) || "",
    pricing: (initial.pricing as string) || "",
    icon: (initial.icon as string) || "Sparkles",
    thumbnail_url: (initial.thumbnail_url as string) || "",
    status: (initial.status as string) || "active",
    sort_order: (initial.sort_order as number) ?? 0,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
      <FieldRow label="Title *"><TextInput value={f.title} onChange={(v) => setF({ ...f, title: v })} required /></FieldRow>
      <FieldRow label="Description"><TextArea value={f.description} onChange={(v) => setF({ ...f, description: v })} /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Pricing"><TextInput value={f.pricing} onChange={(v) => setF({ ...f, pricing: v })} placeholder="From ₹5,000" /></FieldRow>
        <FieldRow label="Icon (lucide)"><TextInput value={f.icon} onChange={(v) => setF({ ...f, icon: v })} placeholder="Globe, Instagram, Video..." /></FieldRow>
      </div>
      <FieldRow label="Thumbnail"><ImageUpload value={f.thumbnail_url} onChange={(v) => setF({ ...f, thumbnail_url: v })} password={password} /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </FieldRow>
        <FieldRow label="Sort order"><TextInput type="number" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: Number(v) || 0 })} /></FieldRow>
      </div>
      <SaveBtn saving={saving} />
    </form>
  );
}

/* ------------ TESTIMONIALS ------------ */
function TestimonialsTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllTestimonials);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const { data } = useQuery({ queryKey: ["admin-test"], queryFn: () => list({ data: { password } }) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "testimonials", row } }),
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-test"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { password, table: "testimonials", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-test"] }); },
  });
  return (
    <div>
      <SectionHeader title="Testimonials" subtitle="Client feedback shown on the website" onAdd={() => setEditing({ status: "active", rating: 5 })} />
      <div className="grid gap-3">
        {(data ?? []).map((t) => (
          <RowCard key={t.id as string}
            title={t.name as string}
            subtitle={`${t.business ?? ""} · ${"★".repeat(t.rating as number || 5)}`}
            onEdit={() => setEditing(t as Record<string, unknown>)}
            onDelete={() => remove.mutate(t.id as string)}
          />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit testimonial" : "New testimonial"} onClose={() => setEditing(null)}>
          <TestimonialForm initial={editing} onSubmit={(row) => save.mutate(row)} saving={save.isPending} />
        </Modal>
      )}
    </div>
  );
}

function TestimonialForm({ initial, onSubmit, saving }: { initial: Record<string, unknown>; onSubmit: (r: Record<string, unknown>) => void; saving: boolean }) {
  const [f, setF] = useState({
    id: (initial.id as string) || undefined,
    name: (initial.name as string) || "",
    business: (initial.business as string) || "",
    quote: (initial.quote as string) || "",
    rating: (initial.rating as number) ?? 5,
    status: (initial.status as string) || "active",
    sort_order: (initial.sort_order as number) ?? 0,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Name *"><TextInput value={f.name} onChange={(v) => setF({ ...f, name: v })} required /></FieldRow>
        <FieldRow label="Business"><TextInput value={f.business} onChange={(v) => setF({ ...f, business: v })} /></FieldRow>
      </div>
      <FieldRow label="Quote *"><TextArea value={f.quote} onChange={(v) => setF({ ...f, quote: v })} /></FieldRow>
      <div className="grid sm:grid-cols-3 gap-4">
        <FieldRow label="Rating (1-5)"><TextInput type="number" value={String(f.rating)} onChange={(v) => setF({ ...f, rating: Math.min(5, Math.max(1, Number(v) || 5)) })} /></FieldRow>
        <FieldRow label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </FieldRow>
        <FieldRow label="Sort order"><TextInput type="number" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: Number(v) || 0 })} /></FieldRow>
      </div>
      <SaveBtn saving={saving} />
    </form>
  );
}

/* ------------ CONTACTS ------------ */
/* ------------ CLIENT LOGOS ------------ */
function ClientLogosTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllClientLogos);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const { data } = useQuery({ queryKey: ["admin-logos"], queryFn: () => list({ data: { password } }) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "client_logos", row } }),
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-logos"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { password, table: "client_logos", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-logos"] }); },
  });
  return (
    <div>
      <SectionHeader title="Client Logos" subtitle="Brand logos in the homepage scrolling marquee" onAdd={() => setEditing({ status: "active" })} />
      <div className="grid gap-3">
        {(data ?? []).map((l) => (
          <RowCard key={l.id as string}
            title={l.name as string}
            subtitle={(l.link as string) || ((l.status as string) === "active" ? "Active" : "Hidden")}
            thumbnail={l.logo_url as string}
            onEdit={() => setEditing(l as Record<string, unknown>)}
            onDelete={() => remove.mutate(l.id as string)}
          />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit logo" : "New logo"} onClose={() => setEditing(null)}>
          <ClientLogoForm initial={editing} onSubmit={(row) => save.mutate(row)} saving={save.isPending} password={password} />
        </Modal>
      )}
    </div>
  );
}

function ClientLogoForm({ initial, onSubmit, saving, password }: { initial: Record<string, unknown>; onSubmit: (r: Record<string, unknown>) => void; saving: boolean; password: string }) {
  const [f, setF] = useState({
    id: (initial.id as string) || undefined,
    name: (initial.name as string) || "",
    logo_url: (initial.logo_url as string) || "",
    link: (initial.link as string) || "",
    status: (initial.status as string) || "active",
    sort_order: (initial.sort_order as number) ?? 0,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
      <FieldRow label="Brand name *"><TextInput value={f.name} onChange={(v) => setF({ ...f, name: v })} required /></FieldRow>
      <FieldRow label="Logo image (PNG with transparent background works best)"><ImageUpload value={f.logo_url} onChange={(v) => setF({ ...f, logo_url: v })} password={password} /></FieldRow>
      <FieldRow label="Website link (optional)"><TextInput value={f.link} onChange={(v) => setF({ ...f, link: v })} placeholder="https://..." /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </FieldRow>
        <FieldRow label="Sort order"><TextInput type="number" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: Number(v) || 0 })} /></FieldRow>
      </div>
      <SaveBtn saving={saving} />
    </form>
  );
}

function ContactsTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListContacts);
  const upsert = useServerFn(adminUpsert);
  const { data } = useQuery({ queryKey: ["admin-contacts"], queryFn: () => list({ data: { password } }) });
  const update = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "contacts", row } }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-contacts"] }); },
  });

  const statuses = [
    { v: "new", label: "New", color: "bg-brand/10 text-brand" },
    { v: "in_progress", label: "In Progress", color: "bg-orange/10 text-orange" },
    { v: "won", label: "Won", color: "bg-emerald-100 text-emerald-700" },
    { v: "lost", label: "Lost", color: "bg-slate-200 text-slate-600" },
  ];

  return (
    <div>
      <SectionHeader title="Leads" subtitle="Contact form submissions" />
      <div className="grid gap-3">
        {(data ?? []).length === 0 && <div className="text-sm text-slate-soft bg-white border border-border rounded-2xl p-8 text-center">No leads yet.</div>}
        {(data ?? []).map((c) => {
          const status = statuses.find((s) => s.v === c.status) ?? statuses[0];
          const whatsapp = (c.phone as string)?.replace(/\D/g, "");
          return (
            <div key={c.id as string} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy">{c.name as string}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                  </div>
                  {c.business_name && <div className="text-sm text-slate-soft">{c.business_name as string}</div>}
                  <div className="text-xs text-slate-soft mt-1">
                    {c.email && <span>{c.email as string} · </span>}
                    {c.phone && <span>{c.phone as string}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {whatsapp && (
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full px-3 py-1.5 hover:bg-emerald-100">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                  <select value={c.status as string} onChange={(e) => update.mutate({ id: c.id, status: e.target.value })} className="text-xs rounded-full border border-border bg-white px-3 py-1.5 font-semibold">
                    {statuses.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              {c.project_details && <p className="text-sm text-ink mt-3 whitespace-pre-line bg-muted/40 rounded-lg p-3">{c.project_details as string}</p>}
              <div className="text-xs text-slate-soft mt-2">{new Date(c.created_at as string).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------ SHARED UI ------------ */
function SectionHeader({ title, subtitle, onAdd }: { title: string; subtitle?: string; onAdd?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-2xl font-bold text-navy">{title}</h2>
        {subtitle && <p className="text-sm text-slate-soft">{subtitle}</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand text-white px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all">
          <Plus className="w-4 h-4" /> New
        </button>
      )}
    </div>
  );
}

function RowCard({ title, subtitle, thumbnail, onEdit, onDelete }: { title: string; subtitle?: string; thumbnail?: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
      <div className="h-14 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {thumbnail ? <img src={thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-gradient-brand opacity-30" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-navy truncate">{title}</div>
        {subtitle && <div className="text-xs text-slate-soft">{subtitle}</div>}
      </div>
      <button onClick={onEdit} className="h-9 w-9 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand text-slate-soft flex items-center justify-center"><Pencil className="w-4 h-4" /></button>
      <button onClick={() => { if (confirm("Delete this item?")) onDelete(); }} className="h-9 w-9 rounded-lg bg-muted hover:bg-red-50 hover:text-red-600 text-slate-soft flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-glow my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display font-bold text-navy text-lg">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-soft uppercase tracking-wider">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
function TextInput({ value, onChange, type = "text", placeholder, required }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white" />;
}
function TextArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white" />;
}
function SaveBtn({ saving }: { saving: boolean }) {
  return <button type="submit" disabled={saving} className="w-full rounded-xl bg-gradient-brand text-white py-3 font-semibold shadow-soft disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>;
}

/* ------------ PAYMENTS ------------ */
type Inst = { label: string; amount: number; paid?: boolean; paid_at?: string | null };
type DashPage = { id: string; label: string; checked?: boolean; locked?: boolean; children?: DashPage[] };
type DashNote = { title?: string; body: string; tone?: "info" | "warning" };

function uid() { return Math.random().toString(36).slice(2, 10); }

const ISKCON_TEMPLATE: DashPage[] = [
  { id: uid(), label: "Home" },
  { id: uid(), label: "About", children: [
    { id: uid(), label: "About ISKCON" },
    { id: uid(), label: "ISKCON Kurnool" },
    { id: uid(), label: "Our Mission" },
    { id: uid(), label: "Founder Acharya" },
  ]},
  { id: uid(), label: "Temple", children: [
    { id: uid(), label: "Temple Timings" },
    { id: uid(), label: "Sunday Program" },
    { id: uid(), label: "Upcoming Festivals" },
    { id: uid(), label: "Goshala" },
    { id: uid(), label: "Shop" },
  ]},
  { id: uid(), label: "Media", children: [
    { id: uid(), label: "Gallery" },
    { id: uid(), label: "Social Media" },
  ]},
  { id: uid(), label: "Activities", children: [
    { id: uid(), label: "Youth Program" },
    { id: uid(), label: "Prahlada Badi" },
    { id: uid(), label: "Ekadashi Vratam" },
    { id: uid(), label: "Hari Nama Sankeerthana" },
  ]},
  { id: uid(), label: "Courses", children: [
    { id: uid(), label: "Bhagavad Gita" },
    { id: uid(), label: "Daily Classes" },
  ]},
  { id: uid(), label: "Connect" },
  { id: uid(), label: "Donate" },
  { id: uid(), label: "Additional Features", children: [
    { id: uid(), label: "Admin Panel" },
    { id: uid(), label: "Language Translation (English / Telugu / Hindi)" },
    { id: uid(), label: "WhatsApp Floating Icon" },
    { id: uid(), label: "Footer" },
  ]},
];

const DEFAULT_NOTES: DashNote[] = [
  { title: "Scope of Work", body: "This dashboard reflects the agreed project scope. Any additional pages, sections, features, or functionality requested after project approval will be treated as additional work and may incur additional development charges." },
  { title: "Content & Data Upload", body: "The project includes website development and an admin panel for content management. We cannot guarantee complete data uploading for the entire website. A dedicated person should upload and maintain the website content. We will provide one complimentary training session (up to 1 hour) on using the admin panel." },
  { title: "Progress Tracking", body: "The project progress bar is automatically updated based on completed tasks. Each completed section is marked with a checkbox, allowing you to track the current development status at any time." },
  { title: "Source Code & Access", body: "During the development phase, source code, hosting, server, repository, and other development access will not be shared. Full ownership and access will be handed over only after the website has been completed, approved, and the final payment has been received in full." },
  { title: "Revisions & Additional Requests", body: "Minor revisions within the agreed scope are included. Any new pages, features, integrations, or design changes beyond the approved scope will be considered additional work and will be quoted separately before implementation." },
  { title: "Locked Pages", body: "A 🔒 Lock icon indicates that the page or section has been reviewed and approved. Once a page is locked, it is considered finalized, and no further changes or revisions will be made to that page. Any modification requests after a page has been locked may be treated as additional work and may incur extra charges.", tone: "warning" },
];

function PaymentsTab({ password }: { password: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllPayments);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const { data } = useQuery({ queryKey: ["admin-payments"], queryFn: () => list({ data: { password } }) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) => upsert({ data: { password, table: "payments", row } }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-payments"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { password, table: "payments", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-payments"] }); },
  });

  return (
    <div>
      <SectionHeader title="Payments" subtitle="Create shareable payment pages for clients" onAdd={() => setEditing({})} />
      <div className="grid gap-3">
        {(data ?? []).length === 0 && <div className="text-sm text-slate-soft bg-white border border-border rounded-2xl p-8 text-center">No payment pages yet.</div>}
        {(data ?? []).map((p) => {
          const insts: Inst[] = Array.isArray(p.installments) ? (p.installments as Inst[]) : [];
          const total = Number(p.total_amount) || 0;
          const paid = insts.filter((i) => i.paid).reduce((a, b) => a + Number(b.amount || 0), 0);
          const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
          const url = typeof window !== "undefined" ? `${window.location.origin}/pay/${p.slug}` : `/pay/${p.slug}`;
          return (
            <div key={p.id as string} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {p.logo_url ? <img src={p.logo_url as string} className="w-full h-full object-contain" alt="" /> : <Wallet className="w-5 h-5 text-slate-soft" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy truncate">{p.title as string}</div>
                  <div className="text-xs text-slate-soft truncate">/pay/{p.slug as string}</div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-orange" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-slate-soft">
                    ₹{paid.toLocaleString("en-IN")} of ₹{total.toLocaleString("en-IN")} · {pct}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CopyBtn text={url} />
                  <a href={url} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand text-slate-soft flex items-center justify-center"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={() => setEditing(p as Record<string, unknown>)} className="h-9 w-9 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand text-slate-soft flex items-center justify-center"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("Delete payment page?")) remove.mutate(p.id as string); }} className="h-9 w-9 rounded-lg bg-muted hover:bg-red-50 hover:text-red-600 text-slate-soft flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit payment page" : "New payment page"} onClose={() => setEditing(null)}>
          <PaymentForm initial={editing} onSubmit={(r) => save.mutate(r)} saving={save.isPending} password={password} />
        </Modal>
      )}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="h-9 w-9 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand text-slate-soft flex items-center justify-center"
      title="Copy shareable link"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function PaymentForm({ initial, onSubmit, saving, password }: { initial: Record<string, unknown>; onSubmit: (r: Record<string, unknown>) => void; saving: boolean; password: string }) {
  const [f, setF] = useState({
    id: (initial.id as string) || undefined,
    slug: (initial.slug as string) || "",
    title: (initial.title as string) || "",
    description: (initial.description as string) || "",
    logo_url: (initial.logo_url as string) || "",
    total_amount: Number(initial.total_amount) || 0,
    upi_id: (initial.upi_id as string) || "",
    upi_name: (initial.upi_name as string) || "Dev Creative Works",
    whatsapp_number: (initial.whatsapp_number as string) || "917013906671",
    status: (initial.status as string) || "active",
  });
  const [insts, setInsts] = useState<Inst[]>(Array.isArray(initial.installments) ? (initial.installments as Inst[]) : []);
  const [dashEnabled, setDashEnabled] = useState<boolean>(!!initial.dashboard_enabled);
  const [dashTitle, setDashTitle] = useState<string>((initial.dashboard_title as string) || "");
  const [pages, setPages] = useState<DashPage[]>(Array.isArray(initial.dashboard_pages) ? (initial.dashboard_pages as DashPage[]) : []);
  const [notes, setNotes] = useState<DashNote[]>(Array.isArray(initial.dashboard_notes) ? (initial.dashboard_notes as DashNote[]) : []);

  const totalInsts = insts.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, slug: f.slug || slugify(f.title), installments: insts, dashboard_enabled: dashEnabled, dashboard_title: dashTitle, dashboard_pages: pages, dashboard_notes: notes }); }}
      className="space-y-4"
    >
      <FieldRow label="Title *"><TextInput value={f.title} onChange={(v) => setF({ ...f, title: v, slug: f.slug || slugify(v) })} required /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Shareable slug *"><TextInput value={f.slug} onChange={(v) => setF({ ...f, slug: slugify(v) })} placeholder="acme-website" required /></FieldRow>
        <FieldRow label="Total amount (₹) *"><TextInput type="number" value={String(f.total_amount)} onChange={(v) => setF({ ...f, total_amount: Number(v) || 0 })} required /></FieldRow>
      </div>
      <FieldRow label="Client / Project logo"><ImageUpload value={f.logo_url} onChange={(v) => setF({ ...f, logo_url: v })} password={password} /></FieldRow>
      <FieldRow label="Description"><TextArea value={f.description} onChange={(v) => setF({ ...f, description: v })} /></FieldRow>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="UPI ID *"><TextInput value={f.upi_id} onChange={(v) => setF({ ...f, upi_id: v })} placeholder="yourname@upi" /></FieldRow>
        <FieldRow label="UPI payee name"><TextInput value={f.upi_name} onChange={(v) => setF({ ...f, upi_name: v })} /></FieldRow>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="WhatsApp confirmation number"><TextInput value={f.whatsapp_number} onChange={(v) => setF({ ...f, whatsapp_number: v })} placeholder="917013906671" /></FieldRow>
        <FieldRow label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </FieldRow>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold text-navy text-sm">Payment breakdown</div>
            <div className="text-xs text-slate-soft">Total installments: ₹{totalInsts.toLocaleString("en-IN")} {totalInsts !== f.total_amount && f.total_amount > 0 ? <span className="text-orange">· doesn't match total</span> : null}</div>
          </div>
          <button type="button" onClick={() => setInsts([...insts, { label: `Installment ${insts.length + 1}`, amount: 0, paid: false }])} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {insts.length === 0 && <div className="text-xs text-slate-soft text-center py-3">No installments yet — split the total into milestones (e.g. 50% advance, 50% on delivery).</div>}
          {insts.map((inst, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white rounded-xl border border-border p-2">
              <input value={inst.label} onChange={(e) => setInsts(insts.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="Label" className="col-span-5 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none focus:border-brand focus:bg-white" />
              <input type="number" value={inst.amount} onChange={(e) => setInsts(insts.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) || 0 } : x))} placeholder="Amount" className="col-span-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm focus:outline-none focus:border-brand focus:bg-white" />
              <label className="col-span-3 inline-flex items-center gap-1.5 text-xs text-slate-soft">
                <input type="checkbox" checked={!!inst.paid} onChange={(e) => setInsts(insts.map((x, j) => j === i ? { ...x, paid: e.target.checked, paid_at: e.target.checked ? (x.paid_at || new Date().toISOString()) : null } : x))} className="accent-brand" />
                Paid
              </label>
              <button type="button" onClick={() => setInsts(insts.filter((_, j) => j !== i))} className="col-span-1 h-8 w-8 rounded-lg bg-muted hover:bg-red-50 hover:text-red-600 text-slate-soft flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
        {f.total_amount > 0 && insts.length > 0 && (
          <button
            type="button"
            onClick={() => {
              // Auto-distribute equally
              const each = Math.round((f.total_amount / insts.length) * 100) / 100;
              const remainder = Math.round((f.total_amount - each * (insts.length - 1)) * 100) / 100;
              setInsts(insts.map((x, i) => ({ ...x, amount: i === insts.length - 1 ? remainder : each })));
            }}
            className="mt-3 text-xs text-brand font-semibold hover:underline"
          >Split total evenly</button>
        )}
      </div>

      <DashboardEditor
        enabled={dashEnabled} onEnabled={setDashEnabled}
        title={dashTitle} onTitle={setDashTitle}
        pages={pages} onPages={setPages}
        notes={notes} onNotes={setNotes}
      />

      <SaveBtn saving={saving} />
    </form>
  );
}

/* --------- Dashboard editor --------- */
function DashboardEditor({
  enabled, onEnabled, title, onTitle, pages, onPages, notes, onNotes,
}: {
  enabled: boolean; onEnabled: (v: boolean) => void;
  title: string; onTitle: (v: string) => void;
  pages: DashPage[]; onPages: (v: DashPage[]) => void;
  notes: DashNote[]; onNotes: (v: DashNote[]) => void;
}) {
  const total = countAll(pages);
  const done = countChecked(pages);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const loadTemplate = () => {
    onPages(cloneWithIds(ISKCON_TEMPLATE));
    if (notes.length === 0) onNotes(DEFAULT_NOTES);
    if (!title) onTitle("ISKCON Kurnool Website Development Dashboard");
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => onEnabled(e.target.checked)} className="accent-brand w-4 h-4" />
          <span className="font-semibold text-navy text-sm inline-flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4 text-brand" /> Project dashboard on payment page</span>
        </label>
        <button type="button" onClick={loadTemplate} className="text-xs font-semibold text-brand hover:underline">Load ISKCON template</button>
      </div>
      {enabled && (
        <div className="space-y-3">
          <FieldRow label="Dashboard title">
            <TextInput value={title} onChange={onTitle} placeholder="ISKCON Kurnool Website Development Dashboard" />
          </FieldRow>

          <div className="rounded-xl bg-white border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-soft">Website progress</div>
              <div className="text-xs font-bold text-navy">{pct}% · {done}/{total}</div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand to-orange" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="rounded-xl bg-white border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-soft">Pages & Features</div>
              <button type="button" onClick={() => onPages([...pages, { id: uid(), label: "New page" }])} className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add page</button>
            </div>
            {pages.length === 0 && <div className="text-xs text-slate-soft text-center py-4">No pages yet. Click "Load ISKCON template" or "Add page".</div>}
            <div className="space-y-1.5">
              {pages.map((p, i) => (
                <PageEditor key={p.id} page={p} depth={0}
                  onChange={(next) => onPages(pages.map((x, j) => j === i ? next : x))}
                  onDelete={() => onPages(pages.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-soft">Important Notes</div>
              <div className="flex items-center gap-2">
                {notes.length === 0 && <button type="button" onClick={() => onNotes(DEFAULT_NOTES)} className="text-xs font-semibold text-brand hover:underline">Load defaults</button>}
                <button type="button" onClick={() => onNotes([...notes, { title: "", body: "" }])} className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add note</button>
              </div>
            </div>
            <div className="space-y-2">
              {notes.map((n, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start bg-muted/40 rounded-lg p-2">
                  <input value={n.title || ""} onChange={(e) => onNotes(notes.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} placeholder="Title (optional)" className="col-span-5 rounded-md border border-border bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  <textarea value={n.body} onChange={(e) => onNotes(notes.map((x, j) => j === i ? { ...x, body: e.target.value } : x))} placeholder="Body" rows={2} className="col-span-5 rounded-md border border-border bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  <select value={n.tone || "info"} onChange={(e) => onNotes(notes.map((x, j) => j === i ? { ...x, tone: e.target.value as "info" | "warning" } : x))} className="col-span-1 rounded-md border border-border bg-white px-1 py-1.5 text-xs">
                    <option value="info">Info</option>
                    <option value="warning">Warn</option>
                  </select>
                  <button type="button" onClick={() => onNotes(notes.filter((_, j) => j !== i))} className="col-span-1 h-8 w-8 rounded-md bg-white hover:bg-red-50 hover:text-red-600 text-slate-soft flex items-center justify-center border border-border"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageEditor({ page, depth, onChange, onDelete }: { page: DashPage; depth: number; onChange: (p: DashPage) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(true);
  const hasKids = !!page.children?.length;
  return (
    <div>
      <div className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 ${page.locked ? "bg-emerald-50/50 border-emerald-200" : page.checked ? "bg-brand/5 border-brand/20" : "bg-white border-border"}`} style={{ marginLeft: depth * 16 }}>
        <button type="button" onClick={() => setOpen(!open)} className="h-5 w-5 flex items-center justify-center text-slate-soft flex-shrink-0">
          {hasKids ? <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "" : "-rotate-90"}`} /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-soft/30" />}
        </button>
        <input type="checkbox" checked={!!page.checked} onChange={(e) => onChange({ ...page, checked: e.target.checked })} className="accent-emerald-500 w-4 h-4 flex-shrink-0" title="Mark completed" />
        <input value={page.label} onChange={(e) => onChange({ ...page, label: e.target.value })} className="flex-1 min-w-0 rounded-md border border-transparent hover:border-border focus:border-brand bg-transparent px-1.5 py-1 text-sm focus:outline-none focus:bg-white" />
        <button type="button" onClick={() => onChange({ ...page, locked: !page.locked })} className={`h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 ${page.locked ? "bg-emerald-500 text-white" : "bg-muted text-slate-soft hover:text-brand"}`} title={page.locked ? "Unlock page" : "Lock page (no more changes)"}>
          {page.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={() => onChange({ ...page, children: [...(page.children || []), { id: uid(), label: "New item" }] })} className="h-7 w-7 rounded-md bg-muted hover:bg-brand/10 hover:text-brand text-slate-soft flex items-center justify-center flex-shrink-0" title="Add sub-page">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDelete} className="h-7 w-7 rounded-md bg-muted hover:bg-red-50 hover:text-red-600 text-slate-soft flex items-center justify-center flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      {hasKids && open && (
        <div className="mt-1.5 space-y-1.5">
          {page.children!.map((c, i) => (
            <PageEditor key={c.id} page={c} depth={depth + 1}
              onChange={(next) => onChange({ ...page, children: page.children!.map((x, j) => j === i ? next : x) })}
              onDelete={() => onChange({ ...page, children: page.children!.filter((_, j) => j !== i) })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function countAll(p: DashPage[]): number { let n = 0; for (const x of p) { n++; if (x.children) n += countAll(x.children); } return n; }
function countChecked(p: DashPage[]): number { let n = 0; for (const x of p) { if (x.checked) n++; if (x.children) n += countChecked(x.children); } return n; }
function cloneWithIds(p: DashPage[]): DashPage[] { return p.map(x => ({ ...x, id: uid(), children: x.children ? cloneWithIds(x.children) : undefined })); }