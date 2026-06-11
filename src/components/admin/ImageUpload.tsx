import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminUploadFile } from "@/lib/admin.functions";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result);
      resolve(s.slice(s.indexOf(",") + 1));
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function ImageUpload({ value, onChange, password }: { value: string; onChange: (url: string) => void; password: string }) {
  const upload = useServerFn(adminUploadFile);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setBusy(true);
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await upload({ data: { password, filename: file.name, contentType: file.type, dataBase64 } });
      onChange(res.url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <img src={value} alt="" className="w-full aspect-video object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/95 text-navy flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-brand/60 hover:bg-brand/5 transition-colors flex flex-col items-center justify-center gap-2 text-slate-soft"
        >
          {busy ? <Loader2 className="w-6 h-6 animate-spin text-brand" /> : <Upload className="w-6 h-6" />}
          <span className="text-sm font-medium">{busy ? "Uploading..." : "Click to upload image"}</span>
          <span className="text-xs">JPG, PNG, WebP · up to 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-xs focus:outline-none focus:border-brand focus:bg-white"
      />
    </div>
  );
}