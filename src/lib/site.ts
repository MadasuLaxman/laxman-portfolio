// Canonical origin used for metadata, the sitemap and robots.txt.
// Set NEXT_PUBLIC_SITE_URL once the production domain is known. On Vercel the
// production URL is used automatically when the variable is not set.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
