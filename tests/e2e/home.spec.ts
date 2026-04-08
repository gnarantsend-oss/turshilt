import { test, expect } from "@playwright/test";

test.describe("Нүүр хуудас", () => {
  test("NABO лого харагдана", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("NABO")).toBeVisible();
  });

  test("Navbar навигацийн холбоосууд байгаа", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Нүүр" })).toBeVisible();
    await expect(page.getByText("Кино")).toBeVisible();
    await expect(page.getByText("Цуврал")).toBeVisible();
  });

  test("Hero хэсэгт Тоглуулах товч байна", async ({ page }) => {
    await page.goto("/");
    const playBtn = page.getByRole("button", { name: /тоглуулах/i }).first();
    await expect(playBtn).toBeVisible();
  });

  test("Нэвтрэх хуудас ачааллана", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Нэвтрэх")).toBeVisible();
    await expect(page.getByText("Google-ээр нэвтрэх")).toBeVisible();
    await expect(page.getByText("GitHub-ээр нэвтрэх")).toBeVisible();
  });
});

test.describe("Хөдөлгөөнт үзэгдэл", () => {
  test("Scroll хийхэд Navbar харлана", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(600);
    const nav = page.locator("nav");
    await expect(nav).toHaveCSS("background-color", /rgb\(20, 20, 20\)/);
  });
});
