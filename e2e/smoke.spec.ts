import { statSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

// Queries use getByRole where possible: Cache Components keeps previously
// visited routes in the DOM (hidden), and role queries ignore hidden content.

const resumePath = "/resume/Laxman_Madasu_AI_ML_Engineer_Resume.pdf";
const caseStudies = [
  { slug: "maya", name: "Maya" },
  { slug: "geethai-platform", name: "GeethAI" },
  { slug: "ai-smart-scanner", name: "AI Smart Scanner" },
];

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

test.describe("home page", () => {
  test("renders the key content without errors or overflow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Laxman Madasu");
    await expect(page.getByRole("img", { name: "Portrait of Laxman Madasu" })).toBeVisible();
    await expect(page.locator("#projects article")).toHaveCount(3);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test("has absolute canonical and social image URLs", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(canonical).toMatch(/^https?:\/\//);
    expect(ogImage).toMatch(/^https?:\/\/.+\/opengraph-image/);
  });

  test("pipeline demo shows its finished state under reduced motion", async ({ page }) => {
    await page.goto("/");
    const demo = page.locator("#pipeline");
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.getByText("schema-valid")).toBeVisible();
    await expect(page.getByRole("button", { name: /^(Play|Pause) animation$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Replay animation from the start" })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop nav scrolls to a section and marks it active", async ({ page }) => {
    test.skip(isMobile(page), "desktop navigation only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Skills" }).click();
    await expect(page).toHaveURL(/#skills$/);
    await expect(nav.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "location");
  });

  test("mobile menu opens, closes with Escape and returns focus", async ({ page }) => {
    test.skip(!isMobile(page), "mobile navigation only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(menu).toBeHidden();
  });
});

test.describe("theme", () => {
  test.use({ colorScheme: "light" });

  test("defaults to dark even when the OS prefers light, and remembers a change", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });
});

test.describe("case studies", () => {
  for (const study of caseStudies) {
    test(`${study.slug} renders`, async ({ page }) => {
      const response = await page.goto(`/projects/${study.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(study.name);
      await expect(page.getByRole("heading", { name: "System architecture" })).toBeVisible();
    });
  }

  test("project card links to its case study", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Read the case study.*Maya/ }).click();
    await expect(page).toHaveURL(/\/projects\/maya$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Maya");
  });

  test("unknown project returns a real 404", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page doesn't exist." })).toBeVisible();
  });
});

test.describe("resume", () => {
  test("downloads the real PDF", async ({ page }) => {
    await page.goto("/");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("main").getByRole("link", { name: /Download resume/ }).first().click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("Laxman_Madasu_AI_ML_Engineer_Resume.pdf");
    const expectedSize = statSync(join(process.cwd(), "public", resumePath)).size;
    expect(statSync(await download.path()).size).toBe(expectedSize);
  });

  test("is served with noindex", async ({ request }) => {
    const response = await request.get(resumePath);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe("noindex");
  });
});

test.describe("SEO routes", () => {
  test("robots.txt and sitemap.xml respond", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const study of caseStudies) expect(xml).toContain(`/projects/${study.slug}</loc>`);
  });
});
