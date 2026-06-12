import { useEffect } from "react";
import { AnimatedBg } from "./AnimatedBg";

declare global {
  interface Window {
    Cal?: any;
  }
}

export function BookConsultation() {
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments as any;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal!("init", "30min", { origin: "https://app.cal.com" });
    window.Cal!.config = window.Cal!.config || {};
    window.Cal!.config.forwardQueryParams = true;
    window.Cal!.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: "devesh-kumar-b6y66h/30min",
    });
    window.Cal!.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
  }, []);

  return (
    <section id="book" className="relative py-24 overflow-hidden">
      <AnimatedBg variant="waves" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 text-center mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange mb-3">Book a consultation</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">Let's talk about your project.</h2>
          <p className="mt-3 text-slate-soft">Pick a time that works for you — 30 minutes, no obligation.</p>
        </div>
        <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden p-2 sm:p-4">
          <div id="my-cal-inline-30min" style={{ width: "100%", height: "700px", overflow: "auto" }} />
        </div>
      </div>
    </section>
  );
}