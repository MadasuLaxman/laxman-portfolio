import { CornerDownRight, RotateCcw } from "lucide-react";
import type { Diagram } from "@/content/types";
import { cn } from "./ui";

/**
 * Pipeline diagram drawn as an ordered list, so it stays readable by screen
 * readers and reflows on small screens instead of shrinking like an image.
 */
export function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  // Number processing stages only; inputs and outputs are marked separately.
  const stageNumbers = diagram.nodes.map(
    (_, index) => diagram.nodes.slice(0, index + 1).filter((node) => node.kind !== "io").length,
  );

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:px-6">
        <span className="font-mono text-xs tracking-[0.12em] text-fg-muted uppercase">{diagram.title}</span>
        <span className="hidden font-mono text-xs text-fg-subtle sm:inline">Data flows top to bottom</span>
      </figcaption>

      <div className="relative px-5 py-6 sm:px-6 sm:py-8">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <ol className="relative">
          {diagram.nodes.map((node, index) => {
            const isIO = node.kind === "io";
            const isLast = index === diagram.nodes.length - 1;
            const stageNumber = stageNumbers[index];
            return (
              <li key={node.label} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 pb-5 last:pb-0">
                {!isLast ? (
                  <span aria-hidden="true" className="absolute top-8 bottom-0 left-4 w-px -translate-x-1/2 bg-border-strong" />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center font-mono text-[0.7rem]",
                    isIO
                      ? "rounded-md border border-dashed border-fg-subtle bg-bg text-fg-subtle"
                      : "rounded-full border border-accent/50 bg-accent-soft text-accent",
                  )}
                >
                  {isIO ? (index === 0 ? "in" : "out") : String(stageNumber).padStart(2, "0")}
                </span>

                <div
                  className={cn(
                    "rounded-xl border px-4 py-3",
                    isIO ? "border-dashed border-border-strong bg-bg/60" : "border-border-strong bg-surface-2/70",
                    node.input ? "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:gap-4" : "",
                  )}
                >
                  <div>
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium tracking-tight">
                      <span className="sr-only">{isIO ? (index === 0 ? "Input: " : "Output: ") : `Stage ${stageNumber}: `}</span>
                      {node.label}
                      {node.note ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[0.68rem] font-normal text-accent">
                          <RotateCcw aria-hidden="true" className="size-3" />
                          {node.note}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{node.detail}</p>
                  </div>

                  {node.input ? (
                    <div className="mt-3 rounded-lg border border-dashed border-accent/50 bg-accent-soft px-3 py-2.5 md:mt-0">
                      <p className="flex items-center gap-1.5 font-mono text-[0.7rem] tracking-wide text-accent uppercase">
                        <CornerDownRight aria-hidden="true" className="size-3.5" />
                        <span>
                          <span className="sr-only">Feeds this stage: </span>
                          {node.input.label}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{node.input.detail}</p>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {diagram.layers.length > 0 ? (
        <div className="border-t border-dashed border-border-strong bg-bg/40 px-5 py-5 sm:px-6">
          <p className="mb-3 font-mono text-[0.7rem] tracking-[0.12em] text-fg-subtle uppercase">Shared layers</p>
          <ul className="grid gap-3">
            {diagram.layers.map((layer) => (
              <li
                key={layer.label}
                className="grid gap-2 rounded-xl border border-border bg-surface px-4 py-3 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-4"
              >
                <p className="text-sm font-medium">{layer.label}</p>
                <div>
                  <ul className="flex flex-wrap gap-1.5" aria-label={`${layer.label} components`}>
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-border-strong px-2 py-1 font-mono text-[0.7rem] leading-none text-fg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{layer.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </figure>
  );
}

/** Small decorative preview of the same pipeline for project cards. */
export function DiagramPreview({ diagram }: { diagram: Diagram }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg/60 p-5">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <p className="relative mb-4 font-mono text-[0.68rem] tracking-[0.12em] text-fg-subtle uppercase">
        {diagram.title}
      </p>
      <ol className="relative" aria-label={`${diagram.title} stages`}>
        {diagram.nodes.map((node, index) => {
          const isIO = node.kind === "io";
          const isLast = index === diagram.nodes.length - 1;
          return (
            <li key={node.label} className="relative flex items-start gap-3 pb-2.5 last:pb-0">
              {!isLast ? (
                <span aria-hidden="true" className="absolute top-3 bottom-0 left-[5px] w-px bg-border-strong" />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 mt-[5px] size-[11px] shrink-0",
                  isIO ? "rounded-[3px] border border-fg-subtle bg-bg" : "rounded-full border border-accent bg-accent-soft",
                )}
              />
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn("text-[0.8rem] leading-5", isIO ? "text-fg-muted" : "text-fg")}>{node.label}</span>
                {node.input ? (
                  <span className="rounded border border-dashed border-accent/50 px-1.5 py-px font-mono text-[0.65rem] text-accent">
                    + {node.input.label}
                  </span>
                ) : null}
                {node.note ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-fg-subtle">
                    <RotateCcw aria-hidden="true" className="size-2.5" />
                    {node.note}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
