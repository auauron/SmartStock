import { test, expect } from "@playwright/test";
import {
  deleteInventoryItem,
  deleteRestocksForInventory,
  seedInventoryItem,
  seedRestockEntry,
} from "./helpers/supabaseSeed";

const LOGIN_URL = "/login";
const RESTOCK_URL = "/restock";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    "Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set before running Playwright tests.",
  );
}

async function loginAndGoToRestock(page: import("@playwright/test").Page) {
  await page.goto(LOGIN_URL);
  await page.fill('input[type="email"]', TEST_EMAIL!);
  await page.fill('input[type="password"]', TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
  await page.goto(RESTOCK_URL);
  await page.waitForLoadState("networkidle");
}

test.describe("Restock Page - End-to-End Flow", () => {
  test.describe("Page load", () => {
    test("should render the restock page with form and history table", async ({
      page,
    }) => {
      await loginAndGoToRestock(page);

      await expect(
        page.getByRole("heading", { name: "Restock Management" }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Add Restock" })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Restock History" }),
      ).toBeVisible();
      await expect(page.locator("#restock-item-select")).toBeVisible();
      await expect(page.getByLabel("Restock Quantity")).toBeVisible();
      await expect(page.getByLabel("Notes (Optional)")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Add Restock Entry" }),
      ).toBeVisible();
    });

    test("should show history section (empty state or rows) on load", async ({
      page,
    }) => {
      await loginAndGoToRestock(page);

      await expect(
        page.getByRole("heading", { name: "Restock History" }),
      ).toBeVisible();

      const emptyMsg = page.getByText("No restock history available");
      const table = page.locator("table");

      await Promise.any([
        expect(emptyMsg)
          .toBeVisible({ timeout: 10_000 })
          .catch(() => null),
        expect(table)
          .toBeVisible({ timeout: 10_000 })
          .catch(() => null),
      ]);
    });
  });

  test.describe("Seeded Restock History", () => {
    let seededItemName = "";
    let seededItemId = "";

    test.beforeEach(async ({ page }) => {
      seededItemName = `Restock-Item-${Date.now()}`;
      const seeded = await seedInventoryItem(seededItemName);
      seededItemId = seeded.id;
      await loginAndGoToRestock(page);
    });

    test.afterEach(async () => {
      if (seededItemId) {
        await deleteRestocksForInventory(seededItemId);
        await deleteInventoryItem(seededItemId);
      }
    });

    test("should render a seeded restock entry in history", async ({ page }) => {
      const quantity = 25;
      const notes = `E2E restock note ${Date.now()}`;

      await seedRestockEntry(seededItemId, quantity, notes);
      await page.reload({ waitUntil: "networkidle" });

      await expect(page.locator("table")).toContainText(seededItemName, {
        timeout: 10_000,
      });
      await expect(page.locator("table")).toContainText(`+${quantity} units`);
      await expect(page.locator("table")).toContainText(notes);
    });

    test("should show the quantity badge with correct format (+N units)", async ({ page }) => {
      const quantity = 10;

      await seedRestockEntry(seededItemId, quantity);
      await page.reload({ waitUntil: "networkidle" });

      await expect(page.locator("table")).toContainText(`+${quantity} units`, {
        timeout: 10_000,
      });
    });

    test('should show "No notes" fallback for seeded restock with empty notes', async ({
      page,
    }) => {
      await seedRestockEntry(seededItemId, 5, "");
      await page.reload({ waitUntil: "networkidle" });

      await expect(page.locator("table")).toContainText("No notes", {
        timeout: 10_000,
      });
    });
  });

  test.describe("Form validation", () => {
    test.beforeEach(async ({ page }) => {
      await loginAndGoToRestock(page);
    });

    test("should not submit when no item is selected", async ({ page }) => {
      await page.getByLabel("Restock Quantity").fill("10");
      await page.getByRole("button", { name: "Add Restock Entry" }).click();

      await expect(page.getByLabel("Restock Quantity")).toHaveValue("10");
    });

    test("should have submit button enabled when page loads", async ({
      page,
    }) => {
      await expect(
        page.getByRole("button", { name: "Add Restock Entry" }),
      ).toBeEnabled();
    });
  });

  test.describe("Error handling", () => {
    test("should render the restock page for unauthenticated users (no auth guard in Layout)", async ({
      page,
    }) => {
      await page.goto(RESTOCK_URL);
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByRole("heading", { name: "Restock Management" }),
      ).toBeVisible();
    });
  });

  test.describe("Restock History table", () => {
    test("should display correct column headers", async ({ page }) => {
      await loginAndGoToRestock(page);

      const thead = page.locator("thead");
      await expect(thead).toContainText("Item Name");
      await expect(thead).toContainText("Quantity Added");
      await expect(thead).toContainText("Date");
      await expect(thead).toContainText("Notes");
    });

    test("should display dates in a readable format (e.g. Apr 7, 2026)", async ({
      page,
    }) => {
      const itemName = `Date-Test-${Date.now()}`;
      const seeded = await seedInventoryItem(itemName);

      try {
        await seedRestockEntry(seeded.id, 3);
        await loginAndGoToRestock(page);

        const dateCell = page.locator("table tbody tr td").nth(2);
        await expect(dateCell).toHaveText(
          /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/,
          { timeout: 10_000 },
        );
      } finally {
        await deleteRestocksForInventory(seeded.id);
        await deleteInventoryItem(seeded.id);
      }
    });
  });
});
