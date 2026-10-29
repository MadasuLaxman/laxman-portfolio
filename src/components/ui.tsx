import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

// cn() doesn't resolve conflicting utilities, so size and variant are chosen
// here rather than overridden with extra classes at the call site.
const buttonBase =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const buttonSizes = {
  md: "h-11 px-5",
  sm: "h-9 px-3.5",
  icon: "size-11",
};

const buttonVariants = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-strong",
  secondary: "border border-border-strong bg-surface text-fg hover:border-fg-subtle hover:bg-surface-2",
};

export function button(variant: keyof typeof buttonVariants, size: keyof typeof buttonSizes = "md") {
  return cn(buttonBase, buttonSizes[size], buttonVariants[variant]);
}

export const buttonStyles = {
  primary: button("primary"),
  secondary: button("secondary"),
};

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs tracking-[0.14em] text-accent uppercase", className)}>
      {children}
    </p>
  );
}

export function Section({
  id,
  index,
  label,
  title,
  description,
  children,
  className,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("border-t border-border py-20 sm:py-28", className)}>
      <Container>
        <header className="reveal mb-12 max-w-2xl sm:mb-16">
          <Eyebrow>
            <span className="text-fg-subtle">{index}</span> / {label}
          </Eyebrow>
          <h2 id={headingId} className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p> : null}
        </header>
        {children}
      </Container>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-md border border-border bg-surface-2/60 px-2 py-1 font-mono text-[0.72rem] leading-none text-fg-muted">
      {children}
    </li>
  );
}

export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}
