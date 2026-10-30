import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import Link from "next/link";
import { experience } from "@/content/experience";
import { certifications, education } from "@/content/profile";
import { getProject } from "@/content/projects";
import { Section } from "../ui";

export function Experience() {
  return (
    <Section band id="experience" index="04" label="Experience" title="Where I've done this work.">
      <ol className="space-y-6">
        {experience.map((role) => {
          const roleProjects = role.projectSlugs.map(getProject).filter((project) => project !== undefined);
          return (
            <li
              key={`${role.company}-${role.startISO}`}
              className="reveal spotlight grid gap-6 rounded-2xl border border-border bg-surface shadow-card p-5 shadow-card sm:p-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10"
            >
              <div className="space-y-2 text-sm">
                <p className="font-mono text-fg">
                  <time dateTime={role.startISO}>{role.start}</time> – {role.end}
                </p>
                <p className="flex items-start gap-1.5 text-fg-muted">
                  <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    {role.location}
                    <br />
                    {role.workMode}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {role.role}
                  <span className="text-fg-muted"> · {role.company}</span>
                </h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">{role.summary}</p>

                <h4 className="mt-7 font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">
                  Key accomplishments
                </h4>
                <ul className="mt-3 space-y-3 text-[0.95rem] leading-relaxed">
                  {role.achievements.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {roleProjects.length > 0 ? (
                  <>
                    <h4 className="mt-7 font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">
                      Projects in this role
                    </h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {roleProjects.map((project) => (
                        <li key={project.slug}>
                          <Link
                            href={`/projects/${project.slug}`}
                            prefetch
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
                          >
                            {project.name}
                            <span className="text-fg-subtle">· {project.kind}</span>
                            <ArrowUpRight aria-hidden="true" className="size-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="reveal spotlight rounded-2xl border border-border bg-surface shadow-card p-5 sm:p-8">
          <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">
            <GraduationCap aria-hidden="true" className="size-4" />
            Education
          </h3>
          <ul className="mt-5 space-y-5">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="font-medium tracking-tight">{item.degree}</p>
                <p className="mt-1 text-sm text-fg-muted">{item.institution}</p>
                <p className="mt-1 font-mono text-xs text-fg-subtle">{item.period}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal spotlight rounded-2xl border border-border bg-surface shadow-card p-5 sm:p-8">
          <h3 className="font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">Certifications &amp; training</h3>
          <ul className="mt-5 space-y-5">
            {certifications.map((cert) => (
              <li key={cert.name}>
                {cert.href ? (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 font-medium tracking-tight transition-colors hover:text-accent"
                  >
                    {cert.name}
                    <ArrowUpRight aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                    <span className="sr-only">(certificate, opens in a new tab)</span>
                  </a>
                ) : (
                  <p className="font-medium tracking-tight">{cert.name}</p>
                )}
                <p className="mt-1 text-sm text-fg-muted">{cert.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
