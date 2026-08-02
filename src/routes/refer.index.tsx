import { createFileRoute } from "@tanstack/react-router";
import { ReferPage } from "@/components/refer/ReferPage";

export const Route = createFileRoute("/refer/")({
  head: () => ({
    meta: [
      { title: "Refer & Earn — Dev Creative Works" },
      { name: "description", content: "Refer a business for websites, branding or digital marketing and earn up to ₹4,000 plus gift cards for every successful project." },
      { property: "og:title", content: "Refer & Earn — Dev Creative Works" },
      { property: "og:description", content: "Refer a business. Earn rewards for every successful project with Dev Creative Works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ReferPage />,
});
