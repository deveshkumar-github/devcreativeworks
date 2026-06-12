type Variant =
  | "grid"
  | "dots"
  | "gradient"
  | "dark"
  | "waves"
  | "blueprint"
  | "mesh"
  | "hex"
  | "ribbons"
  | "aurora"
  | "circuit";

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {children}
  </div>
);

export function AnimatedBg({ variant = "grid" }: { variant?: Variant }) {
  switch (variant) {
    case "dark":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-dots opacity-[0.2]" />
          <div className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-brand/30 blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-orange/20 blur-3xl animate-blob-slow" />
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dline" x1="0" x2="1">
                <stop offset="0" stopColor="#f97316" stopOpacity="0" />
                <stop offset="0.5" stopColor="#f97316" />
                <stop offset="1" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[80, 160, 240, 320].map((y) => (
              <line key={y} x1="0" y1={y} x2="800" y2={y - 40} stroke="url(#dline)" strokeWidth="1" />
            ))}
          </svg>
        </Wrap>
      );

    case "waves":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-brand/[0.03] to-white" />
          <svg className="absolute bottom-0 left-0 w-[200%] h-64 animate-wave-x" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0 100 Q150 40 300 100 T600 100 T900 100 T1200 100 V200 H0 Z" fill="rgba(21,101,216,0.08)" />
            <path d="M0 120 Q150 60 300 120 T600 120 T900 120 T1200 120 V200 H0 Z" fill="rgba(249,115,22,0.06)" />
          </svg>
          <svg className="absolute top-0 left-0 w-[200%] h-48 animate-wave-x" style={{ animationDuration: "30s", animationDirection: "reverse" }} viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0 80 Q200 20 400 80 T800 80 T1200 80 V0 H0 Z" fill="rgba(21,101,216,0.05)" />
          </svg>
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-brand/10 blur-3xl animate-blob" />
        </Wrap>
      );

    case "blueprint":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-blueprint opacity-70 animate-grid-pan [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)]" />
          <svg className="absolute top-12 left-12 w-40 h-40 text-brand/40 animate-spin-slow" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg className="absolute bottom-10 right-16 w-32 h-32 text-orange/40 animate-drift-y" viewBox="0 0 100 100" fill="none">
            <polygon points="50,5 95,80 5,80" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="50,25 78,72 22,72" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </Wrap>
      );

    case "mesh":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-[radial-gradient(at_20%_20%,rgba(21,101,216,0.18),transparent_50%),radial-gradient(at_80%_30%,rgba(249,115,22,0.15),transparent_50%),radial-gradient(at_50%_80%,rgba(21,101,216,0.12),transparent_55%)] animate-hue-shift" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-brand/20 blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-orange/20 blur-3xl animate-blob-slow" />
        </Wrap>
      );

    case "hex":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-hex opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]" />
          <div className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-orange/10 blur-3xl animate-blob-slow" />
          <svg className="absolute bottom-8 left-8 w-28 h-28 text-brand/30 animate-spin-slow" viewBox="0 0 100 100" fill="none">
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" stroke="currentColor" strokeWidth="1" />
            <polygon points="50,25 75,38 75,62 50,75 25,62 25,38" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Wrap>
      );

    case "ribbons":
      return (
        <Wrap>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600">
            <defs>
              <linearGradient id="rib1" x1="0" x2="1">
                <stop offset="0" stopColor="#1565d8" stopOpacity="0.18" />
                <stop offset="1" stopColor="#f97316" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="rib2" x1="0" x2="1">
                <stop offset="0" stopColor="#f97316" stopOpacity="0.12" />
                <stop offset="1" stopColor="#1565d8" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <path d="M-50 200 C 200 80, 400 380, 850 180" stroke="url(#rib1)" strokeWidth="80" fill="none" className="animate-drift-y" />
            <path d="M-50 420 C 250 320, 500 580, 850 400" stroke="url(#rib2)" strokeWidth="60" fill="none" className="animate-drift-x" />
          </svg>
          <div className="absolute top-10 left-1/3 w-72 h-72 rounded-full bg-brand/10 blur-3xl animate-blob" />
        </Wrap>
      );

    case "aurora":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-diagonal opacity-50" />
          <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] rotate-12 bg-gradient-to-r from-brand/30 via-transparent to-orange/30 blur-3xl animate-blob" />
          <div className="absolute -bottom-32 right-0 w-[500px] h-[300px] -rotate-12 bg-gradient-to-r from-orange/20 to-brand/20 blur-3xl animate-blob-slow" />
        </Wrap>
      );

    case "circuit":
      return (
        <Wrap>
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="none">
            <g stroke="rgba(21,101,216,0.4)" fill="none" strokeWidth="0.6">
              <path d="M0 50 H100 V120 H200 V60 H400" strokeDasharray="3 4" className="animate-dash-flow" />
              <path d="M0 200 H80 V160 H240 V220 H400" strokeDasharray="3 4" className="animate-dash-flow" style={{ animationDelay: "1s" }} />
              <path d="M50 0 V80 H180 V0" strokeDasharray="3 4" className="animate-dash-flow" style={{ animationDelay: "2s" }} />
              <path d="M320 300 V220 H260 V300" strokeDasharray="3 4" className="animate-dash-flow" style={{ animationDelay: "0.5s" }} />
            </g>
            <g fill="rgba(249,115,22,0.7)">
              <circle cx="100" cy="120" r="2.5" />
              <circle cx="200" cy="60" r="2.5" />
              <circle cx="80" cy="160" r="2.5" />
              <circle cx="240" cy="220" r="2.5" />
              <circle cx="180" cy="80" r="2.5" />
            </g>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
        </Wrap>
      );

    case "dots":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand/15 blur-3xl animate-blob" />
          <div className="absolute -bottom-32 -right-16 w-[460px] h-[460px] rounded-full bg-orange/15 blur-3xl animate-blob-slow" />
          <svg className="absolute top-16 right-12 w-24 h-24 text-orange/40 animate-drift-y" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
          </svg>
        </Wrap>
      );

    case "gradient":
      return (
        <Wrap>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(21,101,216,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.14),transparent_55%)]" />
          <div className="absolute top-1/4 right-10 w-80 h-80 rounded-full bg-brand/15 blur-3xl animate-blob" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-orange/15 blur-3xl animate-blob-slow" />
          <svg className="absolute top-12 left-1/3 w-20 h-20 text-brand/30 animate-spin-slow" viewBox="0 0 100 100" fill="none">
            <polygon points="50,5 95,80 5,80" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Wrap>
      );

    case "grid":
    default:
      return (
        <Wrap>
          <div className="absolute inset-0 bg-grid opacity-60 animate-grid-pan [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand/15 blur-3xl animate-blob" />
          <div className="absolute -bottom-32 -right-16 w-[460px] h-[460px] rounded-full bg-orange/15 blur-3xl animate-blob-slow" />
          <svg className="absolute top-16 right-8 w-28 h-28 text-brand/30 animate-drift-y" viewBox="0 0 100 100" fill="none">
            <polygon points="50,5 95,80 5,80" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Wrap>
      );
  }
}