# Deployment

The site deploys to [Vercel](https://vercel.com) from a GitHub repository. No environment variables are
required. `NEXT_PUBLIC_SITE_URL` is only needed once you add a custom domain.

## 1. Check the build locally

```bash
npm install
npm run lint
npm run build
npm run start      # open http://localhost:3000 and click through
```

Before publishing, decide whether the resume PDF in `public/resume/` should include your phone number
(see [RESUME_ANALYSIS.md](RESUME_ANALYSIS.md), section 5).

## 2. Push to GitHub

The project folder isn't a Git repository yet.

1. Create an **empty** repository on GitHub (no README, license or `.gitignore`), for example
   `laxman-portfolio`.
2. From the project folder:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/MadasuLaxman/laxman-portfolio.git
   git push -u origin main
   ```

`.gitignore` already excludes `node_modules`, `.next`, `.vercel` and `.env*` files (except `.env.example`).

## 3. Import into Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Choose **Add New… → Project** and import the repository.
3. Vercel detects Next.js. Keep the defaults:
   - Framework preset: **Next.js**
   - Build command: `next build`
   - Install command: `npm install`
   - Output directory: default
   - Node.js version (Settings → General): **20.x or later**
4. Leave environment variables empty and click **Deploy**.

Within a minute or two the site is live at `https://<project-name>.vercel.app`. The canonical URL, sitemap
and Open Graph tags use that address automatically through Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.

Every push to `main` triggers a production deployment, and every other branch or pull request gets a
preview URL.

## 4. Add a custom domain (optional)

1. In the Vercel project, open **Settings → Domains** and add the domain.
2. Create the DNS records Vercel shows at your registrar and wait for verification.
3. Open **Settings → Environment Variables** and add, for **Production**:

   | Name                   | Value                     |
   | ---------------------- | ------------------------- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

4. Redeploy (**Deployments → … → Redeploy**). The variable is read at build time.

## 5. Check the live site

- `/` loads, and the theme toggle and mobile menu work.
- The **Download resume** buttons download the PDF.
- `/projects/maya`, `/projects/geethai-platform` and `/projects/ai-smart-scanner` load.
- `/projects/anything-else` returns a 404.
- `/sitemap.xml` and `/robots.txt` list the production domain, not `localhost`.
- Paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to check the
  preview image.
- Optionally, submit `/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Troubleshooting

- **Build fails while fetching fonts.** `next/font/google` downloads Geist at build time, so the build
  needs network access. Vercel has it; behind a restrictive proxy, retry or build on Vercel.
- **Sitemap shows `localhost`.** The build ran outside Vercel without `NEXT_PUBLIC_SITE_URL`. Set the
  variable and rebuild.
- **The resume is still the old file.** Browsers cache it for up to an hour (`Cache-Control: max-age=3600`).
  Do a hard refresh, or rename the file and update `profile.resume` in `src/content/profile.ts`.
