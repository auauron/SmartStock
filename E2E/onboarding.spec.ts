import { test, expect, type Page } from "@playwright/test";
import { clearDatabase, resetOnboarding } from "./helpers/supabaseSeed";

const LOGIN_URL = "/login";
const DASHBOARD_URL = "/dashboard";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    "Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set before running Playwright tests.",
  );
}

async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await page.fill('input[type="email"]', TEST_EMAIL!);
  await page.fill('input[type="password"]', TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
}

async function openGoalStep(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Welcome to SmartStock" }),
  ).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "What do you want to do first?" }),
  ).toBeVisible();
}

test.describe("Onboarding End-to-End Flow", () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase();
    await resetOnboarding();
    await login(page);
    await page.goto(DASHBOARD_URL, { waitUntil: "domcontentloaded" });
  });

  test("starts new users on the welcome and goal screens", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome to SmartStock" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Step 1 of 5")).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByRole("heading", { name: "What do you want to do first?" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  });

  test("routes the default add-item goal to the real Add Item modal", async ({
    page,
  }) => {
    await openGoalStep(page);

    await page.getByRole("button", { name: "Start" }).click();

    await expect(page).toHaveURL(/\/inventory/);
    await expect(
      page.getByRole("heading", { name: "Add New Item" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByLabel("Item Name")).toBeVisible();
  });

  test("routes the view-inventory goal to the inventory list", async ({
    page,
  }) => {
    await openGoalStep(page);

    await page.getByRole("button", { name: "View current inventory" }).click();
    await page.getByRole("button", { name: "Start" }).click();

    await expect(page).toHaveURL(/\/inventory$/);
    await expect(page.getByText("Your inventory is empty")).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { name: "Add New Item" }),
    ).not.toBeVisible();
  });

  test("routes the low-stock goal to dashboard guidance", async ({ page }) => {
    await openGoalStep(page);

    await page
      .getByRole("button", { name: "Check low-stock products" })
      .click();
    await page.getByRole("button", { name: "Start" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", {
        name: "Your dashboard shows what needs attention",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Stock Alerts: products needing attention."),
    ).toBeVisible();
  });
});
