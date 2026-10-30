import { defineConfig, devices } from "@playwright/test";

const port = 3100;

// Smoke tests run against the production build: `npm run build` first.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // Decorative motion is off so assertions don't race animations.
    contextOptions: { reducedMotion: "reduce" },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    // Never reuse: a leftover server on this port would be tested instead of the
    // current build. If the port is busy, the run fails loudly instead.
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
