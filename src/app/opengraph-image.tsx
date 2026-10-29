import { profile } from "@/content/profile";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `${profile.name}, ${profile.role}: Generative AI and LLM systems`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: `${profile.role} · Generative AI & LLM systems`,
    title: profile.name,
    subtitle: "LLM systems that stay grounded, return validated structured output, and keep working when a provider fails.",
    stages: ["Planner", "Grounded generator", "Validator", "Self-repair", "Quality scorer"],
  });
}
