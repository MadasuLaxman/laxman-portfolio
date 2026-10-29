# Deployment

| | |
| --- | --- |
| Live site | https://laxmanmadasu-portfolio.vercel.app |
| Repository | https://github.com/MadasuLaxman/laxman-portfolio (public) |
| Hosting | Vercel, connected to the repository |
| CI | GitHub Actions, `.github/workflows/ci.yml` |

No environment variables are required.

## How a change goes live

1. Make the change locally and run the checks (see below).
2. Commit and push to `main`:

   ```bash
   git push origin main
   ```

3. Two things happen on push:
   - **GitHub Actions** runs lint, type-check, the production build and the Playwright smoke tests.
     The result shows on the commit and in the repository's **Actions** tab.
   - **Vercel** builds and deploys to production. Every other branch or pull request gets a preview URL.

Vercel deploys even if CI fails, so check the Actions result after pushing. To block deploys on failing
checks, enable branch protection on `main` and work through pull requests.

## Checks

Run the same steps as CI before pushing:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e        # starts the production server on port 3100 itself
```

The first time on a new machine, install the test browser with `npx playwright install chromium`.
`npm run test:e2e` covers the home page, desktop and mobile navigation, theme switching, every case study,
the 404 page, the resume download and the SEO routes, at desktop and mobile sizes.

## Canonical URL

`src/lib/site.ts` decides the absolute URL used in the canonical link, Open Graph tags, `sitemap.xml` and
`robots.txt`:

1. `NEXT_PUBLIC_SITE_URL`, if set
2. `https://laxmanmadasu-portfolio.vercel.app` on any Vercel build (production and previews)
3. `http://localhost:3000` otherwise

It doesn't use Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. That variable kept pointing to an old, deleted
domain (`laxman-portfolio-sigma.vercel.app`), which broke link previews.

### Adding a custom domain

1. Vercel project → **Settings → Domains** → add the domain and create the DNS records it shows.
2. **Settings → Environment Variables** → add `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com` for **Production**.
3. Redeploy. The variable is read at build time.
4. Update the repository's **Website** field on GitHub.

## After each deploy

- [ ] The site loads, and the theme toggle and mobile menu work.
- [ ] **Download resume** downloads the PDF.
- [ ] All three case studies load, and `/projects/anything-else` shows the 404 page.
- [ ] `/robots.txt` and `/sitemap.xml` list `laxmanmadasu-portfolio.vercel.app`.
- [ ] The latest GitHub Actions run is green.

Occasionally:

- Paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh
  and check the preview image (LinkedIn caches previews).
- Submit `/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
- Open each certificate link while signed out of Google to confirm it's publicly viewable.

## Troubleshooting

- **Build fails while fetching fonts.** `next/font/google` downloads Geist at build time and needs network
  access. Retry, or build on Vercel.
- **Preview image missing on LinkedIn.** Check that `og:image` in the page source uses the live domain, then
  re-run the Post Inspector to clear LinkedIn's cache.
- **The resume is still the old file.** Browsers cache it for up to an hour (`Cache-Control: max-age=3600`).
  Hard-refresh, or rename the file and update `profile.resume` in `src/content/profile.ts`.
- **Smoke tests fail locally with "browser not found".** Run `npx playwright install chromium`.
