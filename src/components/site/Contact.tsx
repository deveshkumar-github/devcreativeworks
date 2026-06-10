import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  business_name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().min(6).max(20),
  project_details: z.string().trim().min(5).max(2000),
});

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", business_name: "", email: "", phone: "", project_details: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contacts").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Could not submit. Try again."); return; }
    toast.success("Thanks! We'll be in touch shortly.");
    setForm({ name: "", business_name: "", email: "", phone: "", project_details: "" });
  }

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-brand p-8 sm:p-12 lg:p-16 text-white shadow-glow relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-orange/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Ready to Build Something Great?</h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                Let's create a digital identity that represents your vision and drives real growth.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/80">
                <p>📱 WhatsApp: <a className="underline" href="https://wa.me/919999999999">+91 99999 99999</a></p>
                <p>✉️ Email: hello@devcreativeworks.in</p>
              </div>
            </div>
            <form onSubmit={submit} className="bg-white rounded-2xl p-6 sm:p-8 text-ink space-y-4">
              <Field label="Your Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Business Name" value={form.business_name} onChange={(v) => setForm({ ...form, business_name: v })} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Phone / WhatsApp *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-soft uppercase tracking-wider">Project Details *</label>
                <textarea value={form.project_details} onChange={(e) => setForm({ ...form, project_details: e.target.value })} rows={4} className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors" placeholder="Tell us what you're building..." />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-brand text-white py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-60">
                {loading ? "Sending..." : "Start Your Project"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-soft uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors" />
    </div>
  );
}