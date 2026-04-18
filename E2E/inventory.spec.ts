import { test, expect } from "@playwright/test";
import { deleteInventoryItem, seedInventoryItem } from "./helpers/supabaseSeed";

const LOGIN_URL = "/login";
const INVENTORY_URL = "/inventory";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    "Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set before running Playwright tests.",
  );
}

test.describe("Inventory End-to-End Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"]', TEST_EMAIL!);
    await page.fill('input[type="password"]', TEST_PASSWORD!);

    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    await page.goto(INVENTORY_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should add a new inventory item with a custom category", async ({
    page,
  }) => {
    const itemName = `Test-Item-${Date.now()}`;
    const customCategory = "Hardware";

    await page.click('button:has-text("Add Item")');

    const modal = page.locator("form");

    await modal.getByPlaceholder("Enter item name").fill(itemName);

    await modal.locator("#inventory-category").click();
    await modal.getByRole("option", { name: "+ Add New Category" }).click();

    const customInput = modal.locator("#inventory-new-category");
    await expect(customInput).toBeVisible();
    await customInput.fill(customCategory);

    await modal.locator('input[type="number"]').nth(0).fill("1500");
    await modal.locator('input[type="number"]').nth(1).fill("50");
    await modal.locator('input[type="number"]').nth(2).fill("10");

    await modal.getByRole("button", { name: "Save Item" }).click();

    await page.getByPlaceholder("Search inventory...").fill(itemName);
    await expect(page.locator("table")).toContainText(itemName, {
      timeout: 15_000,
    });
    await expect(page.locator("table")).toContainText(customCategory);
  });

  test("should show the custom Delete Confirmation Modal and delete an item", async ({
    page,
  }) => {
    const testItemName = `Delete-Test-${Date.now()}`;
    const seeded = await seedInventoryItem(testItemName, "Electronics");

    try {
      await page.reload({ waitUntil: "networkidle" });

      await page.getByPlaceholder("Search inventory...").fill(testItemName);
      await expect(page.locator("table")).toContainText(testItemName);

      // Find the row for our seeded item and click its delete action
      const row = page.locator("tr", { hasText: testItemName });
      await row
        .getByRole("button", { name: `Actions for ${testItemName}` })
        .click();
      await page.getByRole("button", { name: "Delete Item" }).click();

      await expect(
        page.getByRole("heading", { name: "Delete Item" }),
      ).toBeVisible();
      await expect(page.getByText(`"${testItemName}"`)).toBeVisible();

      await page.getByRole("button", { name: /^Delete$/ }).click();

      await expect(page.locator("table")).not.toContainText(testItemName);
    } finally {
      await deleteInventoryItem(seeded.id).catch(() => undefined);
    }
  });
});
