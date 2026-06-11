type Variant = "light" | "dots" | "grid" | "dark" | "gradient";

export function AnimatedBg({ variant = "light" }: { variant?: Variant }) {
  if (variant === "dark") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-dots opacity-[0.18]" />
        <div className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-brand/30 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-orange/20 blur-3xl animate-blob-slow" />
        <svg className="absolute top-10 right-10 w-40 h-40 text-white/10 animate-spin-slow" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {variant === "grid" && <div className="absolute inset-0 bg-grid opacity-60 animate-grid-pan [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />}
      {variant === "dots" && <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />}
      {variant === "light" && <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />}
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(21,101,216,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.10),transparent_55%)]" />
      )}

      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand/15 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -right-16 w-[460px] h-[460px] rounded-full bg-orange/15 blur-3xl animate-blob-slow" />

      <svg className="absolute top-16 right-8 w-28 h-28 text-brand/30 animate-drift-y" viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 95,80 5,80" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-10 left-10 w-24 h-24 text-orange/40 animate-spin-slow" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="15" width="70" height="70" rx="14" stroke="currentColor" strokeWidth="1.5" />
        <rect x="30" y="30" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute top-1/2 left-1/3 w-20 h-20 text-brand/20 animate-drift-y" style={{ animationDelay: "2s" }} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
      </svg>
    </div>
  );
}