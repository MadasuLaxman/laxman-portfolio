import type { Certification, Education, Metric, NavItem, SocialLink } from "./types";

// Every value here is taken from the resume in public/resume/.
export const profile = {
  name: "Laxman Madasu",
  initials: "LM",
  role: "AI/ML Engineer",
  location: "Hyderabad, India",
  email: "madasulaxman028@gmail.com",
  resume: {
    href: "/resume/Laxman_Madasu_AI_ML_Engineer_Resume.pdf",
    fileName: "Laxman_Madasu_AI_ML_Engineer_Resume.pdf",
    sizeLabel: "PDF · 2 pages",
  },
  // Emphasized fragments render in the primary text color.
  headline: [
    { text: "I build LLM systems that " },
    { text: "stay grounded in real data", emphasis: true },
    { text: ", return output that " },
    { text: "passes validation", emphasis: true },
    { text: ", and " },
    { text: "keep working when a provider fails", emphasis: true },
    { text: "." },
  ],
  // Cycled in the hero, one at a time.
  focusAreas: ["RAG pipelines", "AI agent platforms", "LLM orchestration", "document intelligence"],
  seoDescription:
    "Laxman Madasu is an AI/ML Engineer building LLM systems: hybrid RAG retrieval, validated structured output, provider-agnostic orchestration, AI agents and document intelligence.",
} as const;

// The four figures under the hero. Each must be on the resume.
export const heroMetrics: Metric[] = [
  { value: "33% → 100%", label: "Structure validity after a validate-and-repair pipeline", context: "Maya · 12-page evaluation set" },
  { value: "154", label: "Components indexed for hybrid BM25 + dense retrieval", context: "Maya" },
  { value: "6", label: "LLM providers behind one interface", context: "Maya · GeethAI" },
  { value: "190", label: "Tests covering reliability primitives", context: "GeethAI" },
];

// Scrolling strip under the hero. Every item is on the resume.
export const techStrip: string[] = [
  "Python",
  "FastAPI",
  "LangChain",
  "OpenAI",
  "Anthropic",
  "Gemini",
  "Groq",
  "DeepSeek",
  "Ollama",
  "ChromaDB",
  "MongoDB",
  "BM25 + RRF",
  "PaddleOCR",
  "Tesseract",
  "TensorFlow",
  "Scikit-learn",
  "Docker",
  "AWS",
  "Streamlit",
];

export const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/MadasuLaxman",
    handle: "MadasuLaxman",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/laxmanmadasu/",
    handle: "laxmanmadasu",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    handle: profile.email,
  },
];

export const about = {
  paragraphs: [
    "I'm an AI/ML engineer at Geeth LLC, working remotely from Hyderabad for a company based in Waukesha, Wisconsin. My work sits between the model and the product: the retrieval, validation, orchestration and reliability layers that decide whether an LLM feature can be trusted.",
    "That has meant building a multi-stage generation pipeline that took structure validity from 33% to 100% on our evaluation set, a provider-agnostic LLM layer across six providers, and the circuit breakers, locks and dead-letter queues behind a multi-tenant agent platform.",
    "I came to this through data science: a B.Sc. in Data Science and an MCA from JNTUH. I know the classical ML and deep-learning toolkit, but most of my professional work is applied LLM systems engineering.",
  ],
  principles: [
    {
      title: "Measure before claiming",
      body: "Evaluation sets, benchmark corpora and test suites come first, so an improvement is a number, not an impression.",
    },
    {
      title: "Constrain the model",
      body: "Schemas, grounded retrieval and deny-by-default permissions narrow what an LLM is allowed to produce or do.",
    },
    {
      title: "Design for failure",
      body: "Fallback providers, circuit breakers, idempotency and retries assume that calls will time out and services will go down.",
    },
  ],
};

export const education: Education[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
    period: "2024 – 2026",
  },
  {
    degree: "Bachelor of Science (Data Science)",
    institution: "Satavahana University, Karimnagar",
    period: "2020 – 2023",
  },
];

// Links exactly as they appear in the resume PDF.
export const certifications: Certification[] = [
  {
    name: "Machine Learning with Python",
    issuer: "IBM Developer Skills Network",
    href: "https://drive.google.com/file/d/1v_yANaZAaY2eFmeQwuWMj5miZc2TOO-b/view",
  },
  {
    name: "Certificate of Course Completion in Data Science",
    issuer: "Innomatics Research Labs",
    href: "https://drive.google.com/file/d/1HMOcQt_RxdXd1j_LJIzzPFmC_pg25Ty0/view",
  },
  {
    name: "Exploratory Data Analysis Module Completion",
    issuer: "Innomatics Research Labs",
    href: "https://drive.google.com/file/d/1Ryqy0UJzjQj9TTmNE1mphdBbS3ahyJNg/view",
  },
];
