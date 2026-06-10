import mapAsset from "@/assets/india-map.png.asset.json";

export function VisionSection() {
  return (
    <section className="py-24 bg-muted/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange mb-3">Our vision</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">
            Every business <span className="text-gradient-brand">online.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-soft leading-relaxed">
            Imagine every local business, temple, startup, school and entrepreneur having a professional digital presence.
            That's the future we're building — one brand at a time.
          </p>
          <p className="mt-8 font-display text-2xl text-navy italic">
            You Progress. <span className="text-orange">The Nation Follows.</span>
          </p>
        </div>
        <div className="relative">
          <img src={mapAsset.url} alt="Digital network across India" className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
}