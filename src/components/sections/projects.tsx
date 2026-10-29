import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { DiagramPreview } from "../architecture-diagram";
import { Section, TagList } from "../ui";

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      label="Selected projects"
      title="LLM systems I have designed and built."
      description="All three are proprietary work at Geeth LLC, so there is no public code or demo. Each case study explains the architecture and decisions at the level of detail on my resume."
    >
      <ol className="space-y-6 sm:space-y-8">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const headingId = `project-${project.slug}`;
  return (
    <article
      aria-labelledby={headingId}
      className="reveal spotlight group grid gap-8 rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong sm:p-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-10"
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[0.68rem] text-fg-muted">
            <Lock aria-hidden="true" className="size-3" />
            Proprietary · {project.company}
          </span>
        </div>

        <h3 id={headingId} className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.name}
          <span className="text-fg-subtle"> · {project.kind}</span>
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{project.summary}</p>

        <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Problem</dt>
            <dd className="mt-1.5 leading-relaxed text-fg-muted">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Built for</dt>
            <dd className="mt-1.5 leading-relaxed text-fg-muted">{project.audience}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <h4 className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">What I built</h4>
          <ul className="mt-2.5 space-y-2.5 text-sm leading-relaxed">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border xl:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1 bg-surface-2/60 p-3.5">
              <dt className="order-2 text-xs leading-snug text-fg-muted">{metric.label}</dt>
              <dd className="order-1 font-mono text-base font-medium text-fg">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <TagList items={project.stack} label={`${project.name} technology stack`} />
        </div>

        <div className="mt-8 border-t border-border pt-5">
          <Link
            href={`/projects/${project.slug}`}
            prefetch
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
          >
            Read the case study
            <span className="sr-only">: {project.name}</span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="hidden self-start sm:block lg:sticky lg:top-24">
        <DiagramPreview diagram={project.diagram} />
      </div>
    </article>
  );
}
