import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PipelineDemo } from "../pipeline-demo";
import { Section } from "../ui";

export function Pipeline() {
  return (
    <Section
      id="pipeline"
      band
      index="02"
      label="In motion"
      title="Watch a request move through a validated LLM pipeline."
      description="An animated walk-through of the Maya architecture: plan, retrieve, generate, validate, repair, score. The prompt, components and JSON are simulated for illustration; the stages are the real ones."
    >
      <div className="reveal">
        <PipelineDemo />
      </div>
      <p className="mt-5 text-sm text-fg-muted">
        Real results from this pipeline: structure validity rose from 33% to 100% on a 12-page evaluation set.{" "}
        <Link
          href="/projects/maya"
          prefetch
          className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-strong"
        >
          Read the Maya case study
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </p>
    </Section>
  );
}
