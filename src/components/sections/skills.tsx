import {
  BarChart3,
  Bot,
  Brain,
  Cloud,
  Database,
  Network,
  ScanText,
  Search,
  Server,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { skillGroups } from "@/content/skills";
import type { SkillIcon } from "@/content/types";
import { cn, Section } from "../ui";

const icons: Record<SkillIcon, LucideIcon> = {
  sparkles: Sparkles,
  search: Search,
  bot: Bot,
  network: Network,
  server: Server,
  database: Database,
  scan: ScanText,
  brain: Brain,
  chart: BarChart3,
  cloud: Cloud,
};

export function Skills() {
  return (
    <Section
      id="skills"
      index="05"
      label="Skills"
      title="Tools I use, grouped by the problem they solve."
      description="Everything here is on my resume. Proficiency is shown through the projects above rather than with ratings."
    >
      {/* Dense packing backfills gaps so rows stay full at every column count. */}
      <ul className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => {
          const Icon = icons[group.icon];
          return (
            <li
              key={group.title}
              className={cn(
                "reveal spotlight flex flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong sm:p-6",
                group.wide && "md:col-span-2",
              )}
            >
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-2 text-accent">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold tracking-tight">{group.title}</h3>
                  <p className="mt-0.5 text-sm text-fg-muted">{group.description}</p>
                </div>
              </div>
              <ul aria-label={group.title} className="mt-5 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border border-border bg-bg/50 px-2.5 py-1.5 text-[0.8rem] leading-none text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 font-mono text-[0.68rem] text-fg-subtle">
                {group.skills.length} {group.skills.length === 1 ? "skill" : "skills"}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
