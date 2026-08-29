import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/marketing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mailcoy — Professional business email on your domain via Gmail" },
      {
        name: "description",
        content:
          "Mailcoy gives your team professional business email on your domain — while they keep using the Gmail they already know.",
      },
      { property: "og:title", content: "Mailcoy — Business Email via Gmail" },
      {
        property: "og:description",
        content:
          "Your company's email identity. Your team's Gmail workflow.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  component: LandingPage,
});
