import { ArrowDown, Download, Layers, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import portrait from "@/assets/laxman-madasu.jpg";
import { heroMetrics, profile, socialLinks, techStrip } from "@/content/profile";
import { GitHubIcon, LinkedInIcon } from "../brand-icons";
import { RotatingText } from "../rotating-text";
import { buttonStyles, cn, Container } from "../ui";

// Staggered entrance done in CSS so the hero text needs no client JavaScript.
function rise(delay: number): CSSProperties {
  return { "--delay": `${delay}ms` } as CSSProperties;
}

const linkIcons: Record<string, ReactNode> = {
  GitHub: <GitHubIcon size={16} />,
  LinkedIn: <LinkedInIcon size={16} />,
  Email: <Mail aria-hidden="true" className="size-4" />,
};

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />

      <Container className="relative grid items-center gap-16 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:pt-24 lg:pb-20">
        <div>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3 py-1.5 text-xs text-fg-muted backdrop-blur">
            <Sparkles aria-hidden="true" className="size-3.5 text-accent" />
            {profile.role} at Geeth LLC
            <span aria-hidden="true" className="text-fg-subtle">
              ·
            </span>
            {profile.location}
          </p>

          <h1
            id="hero-heading"
            className="animate-rise mt-6 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem] lg:leading-[0.95]"
            style={rise(60)}
          >
            {profile.name}
          </h1>

          <p
            className="animate-rise mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
            style={rise(120)}
          >
            <span className="text-fg-muted">Building </span>
            <RotatingText words={profile.focusAreas} />
          </p>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted"
            style={rise(180)}
          >
            {profile.headline.map((part) =>
              "emphasis" in part ? (
                <span key={part.text} className="font-medium text-fg">
                  {part.text}
                </span>
              ) : (
                part.text
              ),
            )}
          </p>

          <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(240)}>
            <a href="#projects" className={buttonStyles.primary}>
              Explore projects
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
            <a href={profile.resume.href} download={profile.resume.fileName} className={buttonStyles.secondary}>
              <Download aria-hidden="true" className="size-4" />
              Download resume
              <span className="font-mono text-xs text-fg-subtle">PDF</span>
            </a>
          </div>

          <ul className="animate-rise mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm" style={rise(300)} aria-label="Profiles">
            {socialLinks.map((link) => {
              const external = link.label !== "Email";
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-fg"
                  >
                    {linkIcons[link.label]}
                    {external ? link.label : link.handle}
                    {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <Portrait />
      </Container>

      <Container className="relative">
        <dl className="reveal grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="spotlight flex flex-col gap-2 bg-surface p-5 sm:p-6">
              <dt className="order-2 text-sm leading-snug text-fg-muted">{metric.label}</dt>
              <dd className="order-1 font-mono text-2xl font-medium tracking-tight text-fg">{metric.value}</dd>
              <dd className="order-3 mt-auto font-mono text-[0.7rem] text-fg-subtle">{metric.context}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <TechStrip />
    </section>
  );
}

function Portrait() {
  return (
    <div className="animate-rise relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-none" style={rise(160)}>
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
      />
      <div className="photo-frame relative rounded-[2rem] p-[1.5px] shadow-card">
        <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-surface">
          <Image
            src={portrait}
            alt={`Portrait of ${profile.name}`}
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 352px"
            className="aspect-[4/5] w-full object-cover object-[50%_20%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
            <div>
              <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
              <p className="text-sm text-white/75">{profile.role}</p>
            </div>
            <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[0.68rem] backdrop-blur">
              Since Dec 2024
            </span>
          </div>
        </div>
      </div>

      <FloatingChip
        className="-top-4 -left-3 sm:-left-8"
        delay="0s"
        icon={<ShieldCheck aria-hidden="true" className="size-4 text-success" />}
        value="33% → 100%"
        label="structure validity"
      />
      <FloatingChip
        className="top-1/2 -right-3 sm:-right-8"
        delay="-2s"
        icon={<Layers aria-hidden="true" className="size-4 text-accent" />}
        value="6 LLM providers"
        label="one interface"
      />
      <FloatingChip
        className="bottom-24 -left-3 sm:-left-10"
        delay="-4s"
        icon={<Sparkles aria-hidden="true" className="size-4 text-accent-2" />}
        value="154 components"
        label="hybrid RAG index"
      />
    </div>
  );
}

function FloatingChip({
  className,
  delay,
  icon,
  value,
  label,
}: {
  className: string;
  delay: string;
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "animate-float absolute z-10 flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface/85 px-3 py-2 shadow-card backdrop-blur-md",
        className,
      )}
      style={{ "--float-delay": delay } as CSSProperties}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-surface-2">{icon}</span>
      <span className="leading-tight">
        <span className="block font-mono text-xs font-medium text-fg">{value}</span>
        <span className="block text-[0.7rem] text-fg-muted">{label}</span>
      </span>
    </div>
  );
}

function TechStrip() {
  // The list is rendered twice so the strip can loop seamlessly.
  const items = [...techStrip, ...techStrip];
  return (
    <div className="relative mt-14 border-y border-border bg-surface/40 py-4 sm:mt-16">
      <p className="sr-only">Technologies I work with: {techStrip.join(", ")}.</p>
      <div aria-hidden="true" className="marquee overflow-hidden">
        <ul className="marquee-track flex w-max gap-10 pr-10">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-fg-subtle">
              {item}
              <span className="size-1 rounded-full bg-border-strong" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
