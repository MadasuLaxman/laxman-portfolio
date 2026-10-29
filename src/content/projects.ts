import type { Project } from "./types";

// Featured projects, in display order. All three are proprietary work at
// Geeth LLC, so `links` stays empty until a public URL actually exists.
export const projects: Project[] = [
  {
    slug: "maya",
    name: "Maya",
    kind: "AI Website Generation Platform",
    company: "Geeth LLC",
    role: "AI/ML Engineer",
    summary:
      "An LLM platform that turns a natural-language prompt into a schema-valid UI page tree for websites, portfolios and reusable components.",
    problem:
      "A generated page tree can only be rendered if it matches a strict schema and uses components that actually exist. Before the multi-stage pipeline, only 33% of generated pages in the evaluation set were structurally valid, and the model could invent component types the renderer doesn't know.",
    audience:
      "People describing a website, portfolio or reusable component in plain language instead of assembling it by hand.",
    stack: ["Python", "FastAPI", "LLMs", "RAG", "MongoDB", "ChromaDB", "Streamlit", "JSON"],
    highlights: [
      "Multi-stage pipeline (planner → grounded generator → validator → self-repair → quality scorer) that lifted structure validity from 33% to 100%.",
      "Hybrid retrieval (dense embeddings + BM25, fused with Reciprocal Rank Fusion) over a 154-component knowledge base, eliminating hallucinated component types.",
      "Provider-agnostic LLM layer across 6 providers with cross-provider fallback and per-stage token and cost accounting.",
    ],
    metricsLabel: "Results on a 12-page evaluation set",
    metrics: [
      { value: "33% → 100%", label: "Structure validity", context: "12-page evaluation set" },
      { value: "98.8% → 100%", label: "Component correctness", context: "12-page evaluation set" },
      { value: "154", label: "Components in the retrieval knowledge base", context: "Hybrid RAG corpus" },
      { value: "265", label: "Unit tests", context: "Plus a 300-prompt benchmark corpus" },
    ],
    requirements: [
      "Every generated page tree must validate against the page schema before it is returned.",
      "Only components from the 154-component library may appear in the output.",
      "The system must not depend on one model vendor; a failing provider falls back to another.",
      "Generation streams to the client as it happens (Server-Sent Events).",
      "Sessions keep version history so a user can undo or revert a generation.",
      "Token usage and cost are tracked for each pipeline stage.",
    ],
    diagram: {
      title: "Generation pipeline",
      nodes: [
        { kind: "io", label: "Prompt", detail: "A natural-language description of a website, portfolio or component." },
        { label: "Planner", detail: "Turns the prompt into a page plan before any components are generated." },
        {
          label: "Grounded generator",
          detail: "Builds the page tree from the plan, using only components returned by retrieval.",
          input: {
            label: "Hybrid retrieval",
            detail: "Dense embeddings + BM25, fused with Reciprocal Rank Fusion, over 154 components.",
          },
        },
        { label: "Validator", detail: "Checks the tree against the schema and the component library." },
        {
          label: "Self-repair",
          detail: "Feeds validation errors back so invalid parts are fixed, then re-validates.",
          note: "Loops to validator",
        },
        { label: "Quality scorer", detail: "Scores the validated output before it is returned." },
        { kind: "io", label: "Page tree (JSON)", detail: "Schema-valid output, streamed to the client over SSE." },
      ],
      layers: [
        {
          label: "LLM provider layer",
          items: ["Gemini", "Groq", "OpenAI", "Anthropic", "DeepSeek", "Ollama"],
          detail: "One interface for every stage, with cross-provider fallback and per-stage token and cost accounting.",
        },
        {
          label: "API & persistence",
          items: ["FastAPI", "MongoDB", "SSE streaming", "Version history"],
          detail: "Streaming generation endpoints and session history with undo and revert.",
        },
      ],
    },
    decisions: [
      {
        title: "Hybrid retrieval instead of embeddings alone",
        body: "Component names and property keys are exact identifiers, which BM25 matches literally. Dense embeddings capture intent, such as a request for a \"plans section\" matching a pricing component. Reciprocal Rank Fusion merges the two rankings by position, so their scores never have to be calibrated against each other.",
        tradeoff: "Two indexes to build and keep in sync with the component library.",
      },
      {
        title: "Validate and repair instead of trusting one generation",
        body: "Splitting the work into planning, grounded generation, validation, repair and scoring means each failure is caught at a specific stage and fixed with a targeted prompt, rather than regenerating the whole page.",
        tradeoff: "Repairs add LLM calls and latency. Per-stage token and cost accounting keeps that cost visible.",
      },
      {
        title: "A provider-agnostic model layer",
        body: "Every stage calls one interface, so a provider can be swapped or used as a fallback without touching pipeline code.",
        tradeoff: "Providers behave differently on the same prompt, which is one more reason the validator sits after generation.",
      },
      {
        title: "Server-Sent Events for streaming",
        body: "Generation progress only flows from server to client, which SSE handles over plain HTTP without the connection management of WebSockets.",
        tradeoff: "One-directional: user edits go through normal API calls.",
      },
    ],
    validation: [
      { title: "12-page evaluation set", body: "Used to measure structure validity (33% → 100%) and component correctness (98.8% → 100%)." },
      { title: "300-prompt benchmark corpus", body: "A wider prompt set used, with the unit tests, to validate streaming generation and session version history." },
      { title: "265 unit tests", body: "Automated checks run alongside the benchmark corpus." },
    ],
    contributions: [
      "Engineered the FastAPI + MongoDB LLM platform that converts natural-language prompts into schema-valid UI page trees.",
      "Architected the multi-stage RAG generation pipeline: planner, grounded generator, validator, self-repair and quality scorer.",
      "Implemented hybrid retrieval (dense embeddings + BM25 with Reciprocal Rank Fusion) over the 154-component knowledge base.",
      "Built the provider-agnostic LLM layer across 6 providers with cross-provider fallback and per-stage token and cost accounting.",
      "Delivered SSE streaming generation and session version history (undo and revert), validated by a 300-prompt benchmark corpus and 265 unit tests.",
    ],
    links: [],
    confidential: true,
  },
  {
    slug: "geethai-platform",
    name: "GeethAI",
    kind: "AI Application & Agent Platform",
    company: "Geeth LLC",
    role: "AI/ML Engineer",
    summary:
      "A multi-tenant platform that lets non-engineers build and publish AI applications as chat assistants, tool-calling agents or deterministic flows.",
    problem:
      "Non-engineers need to build and publish AI applications on shared infrastructure. That means many tenants on one system, LLM calls that can fail or hang, and agents that call tools, where a single bug could let one tenant's agent reach another tenant's data.",
    audience: "Non-engineers who want to build and publish their own AI applications.",
    stack: ["Python", "FastAPI", "MongoDB", "Streamlit", "LLMs", "AI agents", "Tool calling", "Multi-tenant architecture"],
    highlights: [
      "Three execution modes on one platform: conversational chat, tool-calling agents and deterministic flows.",
      "Reliability primitives built from scratch: circuit breakers, MongoDB-backed distributed locking, idempotency gating, dead-letter queues and retry/timeout policies.",
      "Tenant isolation through a database-proxy layer and deny-by-default tool scoping.",
    ],
    metricsLabel: "Verified figures",
    metrics: [
      { value: "3", label: "Execution modes", context: "Chat, agents, flows" },
      { value: "6", label: "LLM providers", context: "Swapped through configuration" },
      { value: "190", label: "Tests", context: "Reliability test suite" },
      { value: "57%", label: "Tool-call success before the fix", context: "Multi-turn agent issue, resolved" },
    ],
    requirements: [
      "Support conversational chat, tool-calling agents and deterministic flows on the same platform.",
      "Let each application change its model through configuration alone.",
      "Keep every tenant's data isolated, including from agents that call tools.",
      "Tolerate provider outages, duplicate requests and concurrent workers without corrupting state.",
    ],
    diagram: {
      title: "Platform architecture",
      nodes: [
        { kind: "io", label: "App builder", detail: "Non-engineers define an application without writing code." },
        { label: "App configuration", detail: "Execution mode, model and the tools the application may use." },
        {
          label: "Execution runtime",
          detail: "Runs the application in one of three modes: chat, tool-calling agent or deterministic flow.",
          input: {
            label: "Tool scoping",
            detail: "Deny by default: an agent can only call tools granted to its application.",
          },
        },
        { label: "LLM abstraction", detail: "One interface over 6 providers; models swap through configuration." },
        { kind: "io", label: "Published AI app", detail: "The running application, available to its users." },
      ],
      layers: [
        {
          label: "Reliability layer",
          items: ["Circuit breakers", "Retry / timeout policies", "Idempotency gating", "Distributed locks", "Dead-letter queues"],
          detail: "Built from scratch and validated by a 190-test suite. Locks are backed by MongoDB.",
        },
        {
          label: "Tenant isolation",
          items: ["Database proxy", "Tenant context on every query", "MongoDB"],
          detail: "Every query passes through a proxy that injects the tenant context.",
        },
        {
          label: "LLM providers",
          items: ["OpenAI", "Anthropic", "Gemini", "Groq", "DeepSeek", "Ollama"],
          detail: "Selected per application through configuration.",
        },
      ],
    },
    decisions: [
      {
        title: "Isolation in a database proxy, not in each query",
        body: "Injecting tenant context centrally means a forgotten filter in one handler can't leak another tenant's data.",
        tradeoff: "All data access has to go through the proxy, which becomes a critical path to keep correct and tested.",
      },
      {
        title: "Deny-by-default tool scoping",
        body: "Agents act on behalf of a tenant, so the safe default is no tools at all. Each application gets only the tools it is explicitly granted.",
        tradeoff: "Every new tool needs an explicit grant before an agent can use it.",
      },
      {
        title: "Distributed locks on MongoDB",
        body: "The platform already runs on MongoDB, so building locking on it coordinates concurrent workers without adding a separate service.",
        tradeoff: "A general-purpose database isn't optimized for locking the way a dedicated lock store is.",
      },
      {
        title: "Circuit breakers, idempotency and dead-letter queues together",
        body: "A circuit breaker stops calls to a failing provider instead of piling up timeouts; idempotency gating makes retries safe to repeat; a dead-letter queue keeps jobs that still fail for inspection instead of dropping them.",
        tradeoff: "More moving parts, which is why they are covered by a dedicated 190-test suite.",
      },
    ],
    validation: [
      { title: "190-test suite", body: "Validates the reliability primitives: circuit breakers, locking, idempotency, dead-letter queues and retry/timeout policies." },
      { title: "Agent reliability fix", body: "A multi-turn tool-calling failure was traced to cross-turn context persistence and fixed." },
    ],
    story: {
      title: "Debugging multi-turn agent reliability",
      problem: "In multi-turn conversations, agent tool-call success was stuck at 57%.",
      cause: "The problem was cross-turn context persistence: state from earlier turns wasn't reliably carried into later ones.",
      fix: "Fixing how context persists across turns restored reliable multi-step tool execution.",
    },
    contributions: [
      "Developed the multi-tenant LLM application platform with three execution modes: conversational chat, tool-calling agents and deterministic flows.",
      "Designed the provider-agnostic LLM abstraction across 6 providers, letting each application swap models purely through configuration.",
      "Established production reliability primitives from scratch: circuit breakers, MongoDB-backed distributed locking, idempotency gating, dead-letter queues and retry/timeout policies, validated by a 190-test suite.",
      "Enforced strict multi-tenant data isolation through a database-proxy layer and deny-by-default tool scoping.",
      "Diagnosed and resolved the multi-turn agent reliability issue (tool-call success stuck at 57%) by fixing cross-turn context persistence.",
    ],
    links: [],
    confidential: true,
  },
  {
    slug: "ai-smart-scanner",
    name: "AI Smart Scanner",
    kind: "Finance Application",
    company: "Geeth LLC",
    role: "AI/ML Engineer",
    summary:
      "A document-intelligence ETL pipeline that extracts structured data from receipts, W-2s, 1099s, bank statements and invoices, using OCR and layout rules first and an LLM only for non-standard layouts.",
    problem:
      "Financial documents arrive as scans, photos and PDFs in many different layouts. The data has to come out structured and correct, and because the documents are sensitive, sending every page to a hosted LLM is a poor default.",
    audience: "Users who need to review, correct and store financial records extracted from their documents.",
    stack: ["Python", "FastAPI", "Streamlit", "MongoDB", "OCR", "LLMs", "LangChain", "Docker"],
    highlights: [
      "Hybrid OCR pipeline (PaddleOCR, Tesseract, PyMuPDF, pdfplumber) with automatic engine selection and coordinate-level field mapping that extracts totals, vendors and line items without LLM calls.",
      "Pluggable LLM interface across 5 providers for non-standard layouts, local-first and privacy-preserving by default.",
      "Self-learning transaction classifier: rules plus weighted fuzzy scoring, with a feedback loop that promotes frequent user corrections into the live rule set.",
    ],
    metricsLabel: "Scope",
    metrics: [
      { value: "5", label: "Document types", context: "Receipts, W-2, 1099 variants, bank statements, invoices" },
      { value: "4", label: "Extraction engines", context: "PaddleOCR, Tesseract, PyMuPDF, pdfplumber" },
      { value: "0", label: "LLM calls to extract totals, vendors and line items", context: "Standard layouts" },
      { value: "5", label: "Pluggable LLM providers", context: "Local-first by default" },
    ],
    requirements: [
      "Handle receipts, W-2s, Form 1099 variants, bank statements and invoices.",
      "Extract totals, vendors and line items deterministically wherever possible.",
      "Use an LLM only for non-standard layouts, and default to a local-first, privacy-preserving mode.",
      "Classify transactions and improve from user corrections.",
      "Let users review and correct results before they are saved.",
    ],
    diagram: {
      title: "Extraction pipeline",
      nodes: [
        { kind: "io", label: "Financial document", detail: "Receipt, W-2, 1099 variant, bank statement or invoice." },
        { label: "Engine selection", detail: "Chooses the extraction engine for each document automatically." },
        { label: "OCR & PDF parsing", detail: "PaddleOCR, Tesseract, PyMuPDF or pdfplumber." },
        {
          label: "Field mapping",
          detail: "Coordinate-level mapping of totals, vendors and line items, with no LLM call.",
          input: {
            label: "LLM fallback",
            detail: "For non-standard layouts only: OpenAI, Gemini, Groq, Ollama or DeepSeek, local-first by default.",
          },
        },
        {
          label: "Transaction classifier",
          detail: "Rule-based logic plus weighted fuzzy scoring.",
          note: "Learns from corrections",
        },
        { label: "Review & correct", detail: "Streamlit interface for checking and fixing extracted records." },
        { kind: "io", label: "MongoDB", detail: "Corrected financial records are persisted." },
      ],
      layers: [
        {
          label: "Feedback loop",
          items: ["User corrections", "Frequency threshold", "Live rule set"],
          detail: "High-frequency corrections are promoted into the classifier's live rules.",
        },
        {
          label: "Services",
          items: ["FastAPI", "Streamlit", "LangChain", "Docker"],
          detail: "API, review interface, LLM integration and containers.",
        },
      ],
    },
    decisions: [
      {
        title: "Deterministic extraction first, LLM as fallback",
        body: "OCR with coordinate-level field mapping is reproducible, cheap and keeps documents local. The LLM handles only the layouts the rules can't.",
        tradeoff: "Layout rules need maintaining per document type; the LLM fallback covers the long tail.",
      },
      {
        title: "Automatic engine selection",
        body: "Digital PDFs carry a text layer that PyMuPDF and pdfplumber can read directly; scans and photos need OCR with PaddleOCR or Tesseract. Choosing per document avoids running OCR where it isn't needed.",
        tradeoff: "Four engines to integrate and keep consistent in their output format.",
      },
      {
        title: "Local-first LLM mode by default",
        body: "Financial documents are sensitive, so the default avoids sending them to a hosted provider. The interface is pluggable across 5 providers when a different trade-off is acceptable.",
        tradeoff: "Local models can be less capable than hosted ones on unusual layouts.",
      },
      {
        title: "Rules and fuzzy scoring with a feedback loop",
        body: "A rule-based classifier is transparent and works without labeled training data. Promoting only high-frequency corrections means repeated fixes become rules, while one-off mistakes don't.",
        tradeoff: "Learning is gradual: a correction has to recur before it changes the rules.",
      },
    ],
    validation: [
      { title: "Human review step", body: "Users review and correct extracted records in Streamlit before they are saved to MongoDB." },
      { title: "Feedback into rules", body: "Frequent corrections are promoted into the live rule set, so the classifier improves from review." },
    ],
    contributions: [
      "Built the document-intelligence ETL platform for receipts, W-2s, Form 1099 variants, bank statements and invoices.",
      "Engineered the hybrid OCR pipeline with automatic engine selection and coordinate-level field mapping, extracting totals, vendors and line items without LLM calls.",
      "Integrated the pluggable multi-provider LLM interface (OpenAI, Gemini, Groq, Ollama, DeepSeek) for non-standard layouts, defaulting to a local-first, privacy-preserving mode.",
      "Developed the self-learning transaction classification engine combining rule-based logic, weighted fuzzy scoring and a correction feedback loop.",
      "Designed the Streamlit Smart Scanner frontend for reviewing, correcting and persisting extracted records into MongoDB.",
    ],
    links: [],
    confidential: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
