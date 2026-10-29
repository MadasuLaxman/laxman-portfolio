// Canonical origin used for metadata, the sitemap and robots.txt.
const productionUrl = "https://laxmanmadasu-portfolio.vercel.app";

// NEXT_PUBLIC_SITE_URL overrides everything (e.g. for a custom domain). Any
// Vercel build, production or preview, canonicalizes to the production URL.
// Vercel's VERCEL_PROJECT_PRODUCTION_URL isn't used: it kept an old, dead domain.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.VERCEL) return productionUrl;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
