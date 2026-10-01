import { createFileRoute } from "@tanstack/react-router";
import { EmailTool } from "@/components/workplace/email-tool";
export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator | AI Workplace" },
      {
        name: "description",
        content: "Generate polished professional emails from your key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate polished professional emails from your key points.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailTool,
});
