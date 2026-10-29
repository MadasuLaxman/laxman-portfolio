import { about } from "@/content/profile";
import { Section } from "../ui";

export function About() {
  return (
    <Section id="about" index="01" label="About" title="Engineering the layer between the model and the product.">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div className="reveal space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg sm:leading-relaxed">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="reveal">
          <h3 className="font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">How I work</h3>
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {about.principles.map((principle, index) => (
              <li key={principle.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] py-5">
                <span aria-hidden="true" className="font-mono text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium tracking-tight">{principle.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
