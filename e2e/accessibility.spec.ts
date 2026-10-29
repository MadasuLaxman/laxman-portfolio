import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Automated WCAG 2.1 A/AA scan. It catches regressions such as missing labels,
// low contrast or invalid ARIA; it doesn't replace manual keyboard and
// screen-reader testing.

const pages = ["/", "/projects/maya"];

for (const theme of ["dark", "light"] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    });

    for (const path of pages) {
      test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        const summary = results.violations.map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.nodes
              .slice(0, 3)
              .map((node) => node.target.join(" "))
              .join(", ")}`,
        );
        expect(summary).toEqual([]);
      });
    }
  });
}
