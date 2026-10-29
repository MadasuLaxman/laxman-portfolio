"use client";

import { Check, Loader2, Pause, Play, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "./ui";

/*
 * Animated illustration of the Maya generation pipeline. The prompt, plan,
 * component names and JSON are made up for the illustration (and labelled so on
 * the page); the stages and their order are the ones on the resume.
 */

const PROMPT = "A portfolio for a data scientist with a hero, a project grid and a contact form.";

const PHASES = [
  { key: "type", ms: 2000, log: "Receiving the prompt" },
  { key: "plan", ms: 1200, log: "Planner: breaking the request into page sections" },
  { key: "retrieve", ms: 1400, log: "Hybrid retrieval: BM25 + dense embeddings, fused with RRF" },
  { key: "generate", ms: 2200, log: "Grounded generator: building the page tree" },
  { key: "validate", ms: 1500, log: 'Validator: unknown component type "Carousel"' },
  { key: "repair", ms: 1500, log: "Self-repair: sending the error back for a targeted fix" },
  { key: "revalidate", ms: 1100, log: "Validator: page tree is schema-valid" },
  { key: "score", ms: 1100, log: "Quality scorer: scoring the result" },
  { key: "done", ms: 4200, log: "Done: page tree streamed to the client over SSE" },
] as const;

const LAST = PHASES.length - 1;
const at = (key: (typeof PHASES)[number]["key"]) => PHASES.findIndex((phase) => phase.key === key);

type Status = "idle" | "running" | "done" | "error";

const STAGES: { label: string; status: (p: number) => Status }[] = [
  { label: "Planner", status: (p) => (p < at("plan") ? "idle" : p === at("plan") ? "running" : "done") },
  { label: "Hybrid retrieval", status: (p) => (p < at("retrieve") ? "idle" : p === at("retrieve") ? "running" : "done") },
  { label: "Grounded generator", status: (p) => (p < at("generate") ? "idle" : p === at("generate") ? "running" : "done") },
  {
    label: "Validator",
    status: (p) =>
      p < at("validate")
        ? "idle"
        : p === at("validate") || p === at("revalidate")
          ? "running"
          : p === at("repair")
            ? "error"
            : "done",
  },
  { label: "Self-repair", status: (p) => (p < at("repair") ? "idle" : p === at("repair") ? "running" : "done") },
  { label: "Quality scorer", status: (p) => (p < at("score") ? "idle" : p === at("score") ? "running" : "done") },
];

const PLAN = ["Hero", "Projects", "Contact"];
const RETRIEVED = ["HeroSplit", "ProjectGrid", "ContactForm"];

export function PipelineDemo() {
  // The server renders the finished state, so the panel is complete without JavaScript.
  const [phase, setPhase] = useState<number>(LAST);
  const [chars, setChars] = useState(PROMPT.length);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const playing = started && visible && !paused;

  // Advance through the phases while playing; loop after the final one.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (phase === LAST) {
        setChars(0);
        setPhase(0);
      } else {
        setPhase(phase + 1);
      }
    }, PHASES[phase].ms);
    return () => window.clearTimeout(timer);
  }, [playing, phase]);

  // Type the prompt during the first phase.
  useEffect(() => {
    if (!playing || phase !== 0) return;
    const timer = window.setInterval(() => setChars((count) => Math.min(PROMPT.length, count + 2)), 45);
    return () => window.clearInterval(timer);
  }, [playing, phase]);

  function restart() {
    setChars(0);
    setPhase(0);
    setPaused(false);
    setStarted(true);
  }

  function onEnter() {
    setVisible(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!started && !reduceMotion) restart();
  }

  const showPlan = phase >= at("plan");
  const showRetrieved = phase >= at("retrieve");
  const showTree = phase >= at("generate");
  const badLine = phase === at("validate") || phase === at("repair");
  const fixed = phase >= at("revalidate");
  const valid = phase >= at("revalidate");

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        onViewportEnter={onEnter}
        onViewportLeave={() => setVisible(false)}
        viewport={{ amount: 0.35 }}
        className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-card"
      >
        <p className="sr-only">
          Animated illustration of the Maya pipeline: a prompt goes through a planner, hybrid retrieval and a grounded
          generator. The validator rejects an unknown component type, self-repair replaces it with a component from the
          library, the tree re-validates, and the quality scorer finishes. Simulated, not real model output.
        </p>

        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
            </span>
            <span className="truncate font-mono text-xs text-fg-muted">maya · POST /generate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden rounded-md border border-border px-2 py-0.5 font-mono text-[0.65rem] text-fg-subtle sm:inline">
              simulated
            </span>
            <button
              type="button"
              onClick={() => (started ? setPaused((value) => !value) : restart())}
              aria-label={playing ? "Pause animation" : "Play animation"}
              className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
            <button
              type="button"
              onClick={restart}
              aria-label="Replay animation from the start"
              className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Left: prompt and stages */}
          <div className="border-b border-border p-4 sm:p-5 lg:border-r lg:border-b-0">
            <p className="font-mono text-[0.68rem] tracking-[0.12em] text-fg-subtle uppercase">Prompt</p>
            <div className="mt-2 min-h-[4.5rem] rounded-lg border border-border bg-bg/60 px-3 py-2.5 text-sm leading-relaxed">
              {PROMPT.slice(0, chars)}
              {phase === 0 ? <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-accent" /> : null}
            </div>

            <ol className="mt-5 space-y-1.5">
              {STAGES.map((stage) => {
                const status = stage.status(phase);
                return (
                  <li
                    key={stage.label}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors duration-300",
                      status === "running" && "border-accent/50 bg-accent-soft text-fg",
                      status === "done" && "border-border bg-surface-2/50 text-fg",
                      status === "error" && "border-danger/50 bg-danger/10 text-fg",
                      status === "idle" && "border-border/60 text-fg-subtle",
                    )}
                  >
                    <StatusIcon status={status} />
                    <span className="flex-1">{stage.label}</span>
                    {stage.label === "Planner" && showPlan ? <Chips items={PLAN} animate={started} /> : null}
                    {stage.label === "Hybrid retrieval" && showRetrieved ? (
                      <Chips items={RETRIEVED} accent animate={started} />
                    ) : null}
                    {stage.label === "Validator" && status === "error" ? (
                      <span className="font-mono text-[0.68rem] text-danger">1 issue</span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: page tree */}
          <div className="flex min-w-0 flex-col p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.68rem] tracking-[0.12em] text-fg-subtle uppercase">Page tree · JSON</p>
              {/* initial={false}: the server-rendered finished state shows at full opacity. */}
              <AnimatePresence initial={false}>
                {valid ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[0.68rem] text-success"
                  >
                    <Check className="size-3" />
                    schema-valid
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <pre className="mt-2 min-h-[15.5rem] flex-1 overflow-x-auto rounded-lg border border-border bg-bg/60 p-3 font-mono text-[0.72rem] leading-6 sm:text-[0.78rem]">
              {showTree ? (
                <JsonTree badLine={badLine} fixed={fixed} animate={phase === at("generate")} />
              ) : (
                <span className="text-fg-subtle">{"// waiting for the generator…"}</span>
              )}
            </pre>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 font-mono text-xs text-fg-muted">
            <span className={cn("size-1.5 shrink-0 rounded-full", phase === LAST ? "bg-success" : "bg-accent animate-pulse")} />
            <span className="truncate" aria-hidden="true">
              {PHASES[phase].log}
            </span>
          </div>
          <div className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-2"
              initial={false}
              animate={{ width: `${(phase / LAST) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "running") return <Loader2 className="size-4 shrink-0 animate-spin text-accent" />;
  if (status === "done") return <Check className="size-4 shrink-0 text-success" />;
  if (status === "error") return <X className="size-4 shrink-0 text-danger" />;
  return <span className="mx-[5px] size-1.5 shrink-0 rounded-full bg-border-strong" />;
}

function Chips({ items, accent = false, animate }: { items: string[]; accent?: boolean; animate: boolean }) {
  return (
    <span className="hidden flex-wrap justify-end gap-1 sm:flex">
      {items.map((item, index) => (
        <motion.span
          key={item}
          initial={animate ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.12 }}
          className={cn(
            "rounded border px-1.5 py-px font-mono text-[0.65rem]",
            accent ? "border-accent/40 text-accent" : "border-border-strong text-fg-muted",
          )}
        >
          {item}
        </motion.span>
      ))}
    </span>
  );
}

function JsonTree({ badLine, fixed, animate }: { badLine: boolean; fixed: boolean; animate: boolean }) {
  const k = (text: string) => <span className="text-accent">&quot;{text}&quot;</span>;
  const v = (text: string) => <span className="text-fg">&quot;{text}&quot;</span>;
  const section = (type: string, prop: string, value: string) => (
    <>
      {"    { "}
      {k("type")}: {v(type)}, {k("props")}: {"{ "}
      {k(prop)}: {v(value)}
      {" } }"}
    </>
  );

  const lines = [
    <>{"{"}</>,
    <>
      {"  "}
      {k("page")}: {v("portfolio")},
    </>,
    <>
      {"  "}
      {k("sections")}: [
    </>,
    <>{section("HeroSplit", "title", "Data Scientist")},</>,
    "carousel",
    <>{section("ContactForm", "fields", "name,email")}</>,
    <>{"  ]"}</>,
    <>{"}"}</>,
  ];

  return (
    <span className="block text-fg-subtle">
      {lines.map((line, index) => {
        const isTarget = line === "carousel";
        return (
          <motion.span
            key={index}
            className={cn(
              "-mx-1.5 block rounded px-1.5 whitespace-pre transition-colors duration-300",
              isTarget && badLine && "bg-danger/15 ring-1 ring-danger/40",
              isTarget && fixed && "bg-success/10",
            )}
            initial={animate ? { opacity: 0, x: -6 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animate ? index * 0.22 : 0, duration: 0.25 }}
          >
            {isTarget ? (
              fixed ? (
                <>{section("ProjectGrid", "items", "projects")},</>
              ) : (
                <>
                  {section("Carousel", "items", "projects")},
                  {badLine ? <span className="ml-2 text-danger">{"← not in library"}</span> : null}
                </>
              )
            ) : (
              line
            )}
          </motion.span>
        );
      })}
    </span>
  );
}
