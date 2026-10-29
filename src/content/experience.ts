import type { ExperienceRole } from "./types";

// Reverse chronological order. Add new roles at the top.
export const experience: ExperienceRole[] = [
  {
    company: "Geeth LLC",
    role: "AI/ML Engineer",
    location: "Waukesha, WI, United States",
    workMode: "Remote",
    start: "Dec 2024",
    end: "Present",
    startISO: "2024-12",
    summary:
      "Design and build LLM platforms across three products: retrieval and generation pipelines, provider-agnostic model orchestration, reliability infrastructure, OCR-based document extraction, and the FastAPI services and Streamlit interfaces around them.",
    achievements: [
      "Lifted structure validity from 33% to 100% and component correctness from 98.8% to 100% with a multi-stage RAG pipeline (planner, grounded generator, validator, self-repair, quality scorer), measured on a 12-page evaluation set.",
      "Eliminated hallucinated component types with hybrid retrieval (dense embeddings + BM25, fused via Reciprocal Rank Fusion) over a 154-component knowledge base.",
      "Built provider-agnostic LLM layers across 6 providers: cross-provider fallback with per-stage token and cost accounting in Maya, and configuration-only model swaps in GeethAI.",
      "Built reliability primitives from scratch (circuit breakers, MongoDB-backed distributed locking, idempotency gating, dead-letter queues, retry/timeout policies), validated by a 190-test suite.",
      "Enforced multi-tenant data isolation with a database-proxy layer and deny-by-default tool scoping.",
      "Resolved a multi-turn agent issue that held tool-call success at 57% by fixing cross-turn context persistence.",
      "Built a hybrid OCR pipeline that extracts totals, vendors and line items from financial documents without LLM calls, with a local-first LLM fallback for non-standard layouts.",
    ],
    projectSlugs: ["maya", "geethai-platform", "ai-smart-scanner"],
  },
];
