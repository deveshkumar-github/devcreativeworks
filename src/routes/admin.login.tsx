import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin } from "@/lib/admin.functions";
import { setAdminPassword } from "@/lib/use-admin";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import logoAsset from "@/assets/dev-logo.png.asset.json";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ data: { password: pw } });
      setAdminPassword(pw);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch {
      toast.error("Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl shadow-soft border border-border/60 p-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={logoAsset.url} className="h-10 w-10 object-contain" alt="" />
          <div>
            <h1 className="font-display font-bold text-navy">Dev Creative Works</h1>
            <p className="text-xs text-slate-soft">Admin panel</p>
          </div>
        </div>
        <label className="text-xs font-semibold text-slate-soft uppercase tracking-wider">Admin password</label>
        <div className="relative mt-2">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-soft" />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 py-3 focus:outline-none focus:border-brand focus:bg-white"
            placeholder="Enter password"
            autoFocus
          />
        </div>
        <button disabled={loading} type="submit" className="mt-6 w-full rounded-xl bg-gradient-brand text-white py-3 font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-60">
          {loading ? "Checking..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}