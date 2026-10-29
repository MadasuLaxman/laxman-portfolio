import { ArrowUpRight, Download, Mail } from "lucide-react";
import { profile, socialLinks } from "@/content/profile";
import { GitHubIcon, LinkedInIcon } from "../brand-icons";
import { CopyEmailButton } from "../copy-email";
import { buttonStyles, Section } from "../ui";

export function Contact() {
  const profiles = socialLinks.filter((link) => link.label !== "Email");

  return (
    <Section
      id="contact"
      index="06"
      label="Contact"
      title="Get in touch."
      description="Email is the best way to reach me, whether it's about a role, a project on this page, or LLM systems in general."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="reveal spotlight rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">
            <Mail aria-hidden="true" className="size-4" />
            Email
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-4 block text-xl font-medium tracking-tight break-all text-fg transition-colors hover:text-accent sm:text-3xl"
          >
            {profile.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} className={buttonStyles.primary}>
              <Mail aria-hidden="true" className="size-4" />
              Write an email
            </a>
            <CopyEmailButton email={profile.email} />
          </div>
        </div>

        <ul className="reveal grid gap-3">
          {profiles.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong"
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg">
                  {link.label === "GitHub" ? <GitHubIcon /> : <LinkedInIcon />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{link.label}</span>
                  <span className="block truncate font-mono text-xs text-fg-muted">{link.handle}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-fg-subtle transition-colors group-hover:text-accent"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resume.href}
              download={profile.resume.fileName}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg">
                <Download aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Download resume</span>
                <span className="block font-mono text-xs text-fg-muted">{profile.resume.sizeLabel}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
