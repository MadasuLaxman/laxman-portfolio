import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { buttonStyles, Container, Eyebrow, TagList } from "@/components/ui";
import { getProject, projects } from "@/content/projects";
import type { Project } from "@/content/types";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name}: ${project.kind} case study`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `/projects/${project.slug}`,
    },
  };
}

function sectionsFor(project: Project) {
  return [
    { id: "problem", label: "Problem" },
    { id: "requirements", label: "Requirements" },
    { id: "architecture", label: "Architecture" },
    { id: "decisions", label: "Decisions & trade-offs" },
    { id: "validation", label: "Validation" },
    ...(project.story ? [{ id: "debugging", label: "Debugging" }] : []),
    { id: "contributions", label: "My contributions" },
  ];
}

// The slug is URL data, so it is read inside a Suspense boundary. Every known
// slug is still prerendered, and links to case studies prefetch the full page.
export default function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<CaseStudySkeleton />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}

function CaseStudySkeleton() {
  return (
    <div aria-hidden="true">
      <Container className="animate-pulse py-14">
        <div className="h-4 w-28 rounded bg-surface-2" />
        <div className="mt-10 h-3 w-32 rounded bg-surface-2" />
        <div className="mt-5 h-14 w-64 rounded-lg bg-surface-2" />
        <div className="mt-5 h-6 w-96 max-w-full rounded bg-surface-2" />
        <div className="mt-10 h-32 rounded-2xl bg-surface-2" />
      </Container>
    </div>
  );
}

async function CaseStudy({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const sections = sectionsFor(project);
  // Cache Components keeps the previous route mounted (hidden), so another case
  // study can be in the DOM at the same time. Prefixing IDs keeps them unique.
  const anchor = (name: string) => `${project.slug}-${name}`;

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <Container className="relative pt-10 pb-14 sm:pt-14 sm:pb-20">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-md text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All projects
          </Link>

          <Eyebrow className="mt-10">
            Case study <span className="text-fg-subtle">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          </Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{project.name}</h1>
          <p className="mt-3 text-xl tracking-tight text-fg-muted sm:text-2xl">{project.kind}</p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-fg-muted">{project.summary}</p>

          <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:gap-10">
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Company</dt>
              <dd className="mt-1.5">{project.company}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">My role</dt>
              <dd className="mt-1.5">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Stack</dt>
              <dd className="mt-2">
                <TagList items={project.stack} label="Technology stack" />
              </dd>
            </div>
          </dl>

          {project.confidential ? (
            <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm leading-relaxed text-fg-muted">
              <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
              <span>
                Proprietary work at {project.company}. The code and internal details aren&apos;t public, so this case
                study stays at the level of detail on my resume. The diagram shows the system&apos;s structure, not its
                implementation.
              </span>
            </p>
          ) : null}
        </Container>
      </header>

      <Container className="py-12 sm:py-16">
        <section aria-labelledby={anchor("results-heading")}>
          <h2 id={anchor("results-heading")} className="font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">
            {project.metricsLabel}
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-2 bg-surface p-5 sm:p-6">
                <dt className="order-2 text-sm leading-snug text-fg">{metric.label}</dt>
                <dd className="order-1 font-mono text-2xl font-medium tracking-tight">{metric.value}</dd>
                <dd className="order-3 font-mono text-[0.7rem] text-fg-subtle">{metric.context}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-border text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${anchor(section.id)}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 space-y-20">
            <CaseSection id={anchor("problem")} title="Problem">
              <p className="text-lg leading-relaxed text-fg-muted">{project.problem}</p>
              <p className="mt-5 leading-relaxed">
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Built for · </span>
                <span className="text-fg-muted">{project.audience}</span>
              </p>
            </CaseSection>

            <CaseSection id={anchor("requirements")} title="Requirements and constraints">
              <ul className="space-y-3">
                {project.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3 leading-relaxed">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
                    <span className="text-fg-muted">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CaseSection>

            <CaseSection
              id={anchor("architecture")}
              title="System architecture"
              intro="Numbered steps are processing stages. Dashed boxes mark inputs and outputs, and highlighted boxes show what feeds a stage from the side."
            >
              <ArchitectureDiagram diagram={project.diagram} />
            </CaseSection>

            <CaseSection id={anchor("decisions")} title="Decisions and trade-offs">
              <div className="grid gap-4 md:grid-cols-2">
                {project.decisions.map((decision) => (
                  <div key={decision.title} className="reveal spotlight flex flex-col rounded-2xl border border-border bg-surface shadow-card p-5 transition-colors hover:border-border-strong sm:p-6">
                    <h3 className="font-medium tracking-tight">{decision.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{decision.body}</p>
                    <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-fg-muted">
                      <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Trade-off · </span>
                      {decision.tradeoff}
                    </p>
                  </div>
                ))}
              </div>
            </CaseSection>

            <CaseSection id={anchor("validation")} title="Validation and reliability">
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.validation.map((item) => (
                  <li key={item.title} className="reveal spotlight rounded-2xl border border-border bg-surface shadow-card p-5">
                    <p className="font-medium tracking-tight">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.body}</p>
                  </li>
                ))}
              </ul>

              {project.evidence ? (
                <div className="reveal mt-8">
                  <h3 className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">
                    Reading the numbers
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                    What each figure measures, and what it doesn&apos;t prove.
                  </p>
                  <dl className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                    {project.evidence.map((item) => (
                      <div
                        key={item.metric}
                        className="grid gap-3 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
                      >
                        <dt className="font-mono text-sm font-medium text-fg">{item.metric}</dt>
                        <dd className="text-sm leading-relaxed text-fg-muted">
                          <span className="mb-1 block font-mono text-[0.65rem] tracking-[0.12em] text-success uppercase">
                            Measures
                          </span>
                          {item.measures}
                        </dd>
                        <dd className="text-sm leading-relaxed text-fg-muted">
                          <span className="mb-1 block font-mono text-[0.65rem] tracking-[0.12em] text-fg-subtle uppercase">
                            Doesn&apos;t show
                          </span>
                          {item.doesNotShow}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </CaseSection>

            {project.story ? (
              <CaseSection id={anchor("debugging")} title={project.story.title}>
                <dl className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                  {[
                    { term: "Symptom", text: project.story.problem },
                    { term: "Cause", text: project.story.cause },
                    { term: "Fix", text: project.story.fix },
                  ].map((row) => (
                    <div
                      key={row.term}
                      className="grid gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <dt className="font-mono text-[0.7rem] tracking-[0.12em] text-accent uppercase sm:pt-1">{row.term}</dt>
                      <dd className="leading-relaxed text-fg-muted">{row.text}</dd>
                    </div>
                  ))}
                </dl>
              </CaseSection>
            ) : null}

            <CaseSection id={anchor("contributions")} title="My contributions">
              <ol className="space-y-4">
                {project.contributions.map((item, itemIndex) => (
                  <li key={item} className="grid grid-cols-[2.25rem_minmax(0,1fr)] leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-sm text-accent">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CaseSection>
          </div>
        </div>
      </Container>

      <Container className="pb-20">
        <nav
          aria-label="More projects"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface shadow-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <Link href={`/projects/${next.slug}`} prefetch className="group">
            <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Next case study</span>
            <span className="mt-1 flex items-center gap-2 text-lg font-medium tracking-tight group-hover:text-accent">
              {next.name} · {next.kind}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link href="/#contact" className={buttonStyles.secondary}>
            Get in touch
          </Link>
        </nav>
      </Container>
    </article>
  );
}

function CaseSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    // The reveal animation sits inside the anchor target: a transformed target
    // would make in-page links land at the wrong offset.
    <section id={id} aria-labelledby={`${id}-heading`}>
      <div className="reveal">
        <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {intro ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{intro}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
