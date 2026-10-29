# Laxman Madasu · Portfolio

[![CI](https://github.com/MadasuLaxman/laxman-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MadasuLaxman/laxman-portfolio/actions/workflows/ci.yml)

**Live: https://laxmanmadasu-portfolio.vercel.app**

Personal portfolio for Laxman Madasu, AI/ML Engineer. It has a home page (hero, about, an animated
pipeline walk-through, projects, experience, skills, contact) and a case-study page for each featured project.

Every factual claim on the site comes from the resume PDF in `public/resume/`. Nothing is added beyond it.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components, Turbopack) with React 19 and TypeScript (strict)
- Tailwind CSS v4 through the `@tailwindcss/turbopack` loader (configured in `next.config.ts`)
- [Motion](https://motion.dev) for the pipeline demo, rotating headline, mobile menu, nav indicator and scroll progress
- [Lucide](https://lucide.dev) icons; GitHub and LinkedIn marks are local SVGs
- Geist and Geist Mono through `next/font`

There is no backend, database, analytics or tracking.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

To open the dev server from a phone on the same Wi-Fi, use the Network URL it prints
(e.g. `http://192.168.1.6:3000`). `allowedDevOrigins` in `next.config.ts` permits `192.168.*.*`;
add your range there if your network uses a different one, or the page won't become interactive.

| Command         | What it does                                 |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Development server with hot reload           |
| `npm run lint`  | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`)        |
| `npm run build` | Production build                             |
| `npm run start` | Serve the production build                   |
| `npm run test:e2e` | Playwright smoke tests against the production build (run `build` first) |

## Testing

`e2e/smoke.spec.ts` covers the home page, desktop and mobile navigation, theme switching, every case study,
the 404 page, the resume download and the SEO routes, in a desktop and a mobile viewport. The same checks
run in GitHub Actions on every push to `main` and on pull requests (`.github/workflows/ci.yml`).

```bash
npx playwright install chromium   # first time only
npm run build
npm run test:e2e
```

## Updating content

All content is in typed files under `src/content/`. Components never hard-code personal facts.

| File            | Contains                                                         |
| --------------- | ---------------------------------------------------------------- |
| `profile.ts`    | Name, headline, focus areas, hero metrics, links, resume path, about text, education, certifications, navigation |
| `experience.ts` | Roles in reverse chronological order, with accomplishments       |
| `projects.ts`   | Featured projects and everything on their case-study pages       |
| `skills.ts`     | Skill groups                                                     |
| `types.ts`      | The shapes of the above                                          |

Common changes:

- **New job.** Add a role at the top of `experience` in `experience.ts`, then update the hero pill in
  `src/components/sections/hero.tsx` and `about.paragraphs` in `profile.ts`.
- **New project.** Add an entry to `projects` in `projects.ts`. The home-page card, the case-study page
  at `/projects/<slug>`, its social image, the sitemap and the 404 check all pick it up automatically.
  Put a real URL in `links` only if the repository or demo is public, and set `confidential: false`
  for public work.
- **New resume.** Replace `public/resume/Laxman_Madasu_AI_ML_Engineer_Resume.pdf`, keeping the filename,
  or change `profile.resume` to match a new one.
- **Headline and hero numbers.** `profile.headline`, `profile.focusAreas` (the rotating line),
  `heroMetrics` and `techStrip` in `profile.ts`.
- **Photo.** Replace `src/assets/laxman-madasu.jpg` (portrait, about 1200 × 1800) and
  `src/assets/og-portrait.jpg` (480 × 480 square for the social card). Strip EXIF data before committing.

## Project structure

```
src/
  app/
    layout.tsx               Root layout: fonts, metadata, theme script, JSON-LD
    page.tsx                 Home page (composes the sections)
    projects/[slug]/         Case-study page and its Open Graph image
    not-found.tsx            404 page
    opengraph-image.tsx      Site-wide social image (generated at build time)
    apple-icon.tsx, icon.svg Icons
    sitemap.ts, robots.ts    SEO routes
    globals.css              Design tokens (dark and light) and base styles
  components/
    sections/                Hero, About, Pipeline, Projects, Experience, Skills, Contact
    architecture-diagram.tsx Pipeline diagram (full and compact preview)
    pipeline-demo.tsx        Animated, simulated walk-through of the Maya pipeline (client)
    rotating-text.tsx        Rotating focus line in the hero (client)
    spotlight-effect.tsx     Cursor glow on .spotlight cards (client)
    site-header.tsx          Navigation, scroll-spy, mobile menu (client)
    theme-toggle.tsx         Light/dark toggle (client)
    copy-email.tsx           Copy-to-clipboard button (client)
    ui.tsx                   Container, Section, buttons, tags
  content/                   All site content (see above)
  assets/                    Portrait and social-card crop
  lib/site.ts                Canonical site URL
  lib/og-card.tsx            Shared social-image layout
  proxy.ts                   Returns a real 404 for unknown case-study slugs
public/resume/               The resume PDF
e2e/                         Playwright smoke tests
docs/                        Resume analysis and deployment guide
.github/workflows/ci.yml     Lint, type-check, build and smoke tests on GitHub Actions
```

## Notes on behavior

- **Theme.** Dark by default. The toggle stores a visitor's choice in `localStorage`, and a small inline
  script applies it before first paint to avoid a flash. Switching uses a circular View Transition where
  the browser supports it.
- **Rendering.** Every page is prerendered at build time. Pages revalidate weekly because the footer
  year is a cached value.
- **Resume.** Served with `X-Robots-Tag: noindex`, so it can be downloaded but stays out of search results.
- **Motion.** Scroll reveals use CSS scroll-driven animations (no JavaScript; unsupported browsers just
  show the content). Everything decorative stops under `prefers-reduced-motion`, and the pipeline demo
  then shows its finished state. The demo only runs while on screen and can be paused.
- **Canonical URL.** `NEXT_PUBLIC_SITE_URL` if set, otherwise `https://laxmanmadasu-portfolio.vercel.app`
  on Vercel builds and `http://localhost:3000` locally. See `src/lib/site.ts` and `.env.example`.
- **Case-study evidence.** Each case study has a "Reading the numbers" panel that says what every metric
  measures and what it doesn't show (`evidence` in `src/content/projects.ts`).

## Deployment

Pushing to `main` deploys to Vercel. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the workflow, the
canonical-URL setup and the post-deploy checklist.
