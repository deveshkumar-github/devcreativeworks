import { createFileRoute } from "@tanstack/react-router";
import { ReferPage } from "@/components/refer/ReferPage";

export const Route = createFileRoute("/refer/$code")({
  head: () => ({
    meta: [
      { title: "You're Invited — Refer & Earn | Dev Creative Works" },
      { name: "description", content: "Submit your business details through this referral invite and get a tailored proposal from Dev Creative Works." },
      { property: "og:title", content: "You're Invited — Refer & Earn | Dev Creative Works" },
      { property: "og:description", content: "Submit your business details through this referral invite and get a tailored proposal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferCodePage,
});

function ReferCodePage() {
  const { code } = Route.useParams();
  return <ReferPage code={code} />;
}
