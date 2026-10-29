export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: "GitHub" | "LinkedIn" | "Email";
  href: string;
  handle: string;
};

export type Metric = {
  value: string;
  label: string;
  context: string;
};

export type DiagramNode = {
  label: string;
  /** One-line description shown in the full (case study) diagram. */
  detail: string;
  /** Marks the system boundary: inputs and final outputs. */
  kind?: "io" | "stage";
  /** A side input feeding this stage, e.g. a retrieval index. */
  input?: { label: string; detail: string };
  /** Short badge, e.g. a loop back to an earlier stage. */
  note?: string;
};

export type DiagramLayer = {
  label: string;
  items: string[];
  detail: string;
};

export type Diagram = {
  title: string;
  nodes: DiagramNode[];
  layers: DiagramLayer[];
};

export type Decision = {
  title: string;
  body: string;
  tradeoff: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Short subtitle as written on the resume. */
  kind: string;
  company: string;
  role: string;
  summary: string;
  problem: string;
  audience: string;
  stack: string[];
  /** Two or three bullets for the home page card. */
  highlights: string[];
  metrics: Metric[];
  /** Heading for the metrics block, e.g. where the numbers come from. */
  metricsLabel: string;
  requirements: string[];
  diagram: Diagram;
  decisions: Decision[];
  validation: { title: string; body: string }[];
  /** Resume bullets: what I personally did. */
  contributions: string[];
  /** Optional deeper story, e.g. a debugging investigation. */
  story?: { title: string; problem: string; cause: string; fix: string };
  links: { label: string; href: string }[];
  confidential: boolean;
};

export type ExperienceRole = {
  company: string;
  role: string;
  location: string;
  workMode: string;
  start: string;
  end: string;
  /** ISO dates for the <time> element. */
  startISO: string;
  summary: string;
  achievements: string[];
  projectSlugs: string[];
};

export type SkillIcon =
  | "sparkles"
  | "search"
  | "bot"
  | "network"
  | "server"
  | "database"
  | "scan"
  | "brain"
  | "chart"
  | "cloud";

export type SkillGroup = {
  title: string;
  description: string;
  icon: SkillIcon;
  /** Wide cards span two columns; order in skills.ts keeps every grid row full. */
  wide?: boolean;
  skills: string[];
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
};

export type Certification = {
  name: string;
  issuer: string;
  href?: string;
};
