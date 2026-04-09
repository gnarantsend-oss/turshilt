import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir:  "./tests/e2e",
  timeout:  30_000,
  retries:  process.env.CI ? 2 : 0,
  reporter: [["html"], ["list"]],

  use: {
    baseURL:     process.env.BASE_URL ?? "http://localhost:3000",
    screenshot:  "only-on-failure",
    video:       "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile",   use: { ...devices["iPhone 13"] } },
  ],

  // Тест ажиллахаасаа өмнө Next.js dev server эхлүүлэх
  webServer: {
    command:              "npm run dev",
    url:                  "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout:              60_000,
  },
});
