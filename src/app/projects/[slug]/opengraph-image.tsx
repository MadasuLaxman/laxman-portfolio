import { notFound } from "next/navigation";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = `Case study by ${profile.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgCard({
    eyebrow: `Case study · ${profile.name}`,
    title: project.name,
    subtitle: project.kind,
    stages: project.diagram.nodes.filter((node) => node.kind !== "io").map((node) => node.label).slice(0, 5),
  });
}
