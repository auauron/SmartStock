import { test, expect, type Page } from "@playwright/test";
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

// Helpers

async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await page.waitForSelector('input[type="email"]', { timeout: 15_000 });
  await page.fill('input[type="email"]', TEST_EMAIL!);
  await page.fill('input[type="password"]', TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15_000 });
}

async function goToInventory(page: Page) {
  await page.goto(INVENTORY_URL, { waitUntil: "domcontentloaded" });
  // Wait for the search bar — signals the page is interactive, not just loaded
  await expect(page.getByPlaceholder("Search inventory...")).toBeVisible({
    timeout: 15_000,
  });
  // Wait for skeleton loaders to disappear so we're not acting on a loading state
  await expect(page.locator(".animate-pulse").first()).not.toBeVisible({
    timeout: 15_000,
  });
}

async function searchFor(page: Page, itemName: string) {
  const search = page.getByPlaceholder("Search inventory...");
  await search.clear();
  await search.fill(itemName);
  await page.waitForTimeout(300);
}

// Test suite

test.describe("Inventory End-to-End Flow", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await goToInventory(page);
  });

  // ADD ITEM

  test("should add a new inventory item with a custom category", async ({
    page,
  }) => {
    const itemName = `Test-Item-${Date.now()}`;
    const customCategory = "Hardware";

    // Open modal
    await page.click('button:has-text("Add Item")');
    const modal = page.locator("form");
    await expect(modal).toBeVisible();

    // Fill item name
    await modal.getByPlaceholder("Enter item name").fill(itemName);

    // Handle category — dropdown may or may not be present depending on
    // whether existing categories exist
    const categoryDropdown = modal.locator("#inventory-category");
    const newCategoryInput = modal.locator("#inventory-new-category");

    if (await categoryDropdown.isVisible()) {
      await categoryDropdown.selectOption("OTHER");
    }

    await expect(newCategoryInput).toBeVisible();
    await newCategoryInput.fill(customCategory);

    // Fill numeric fields by label
    await modal.locator("#inventory-price").fill("1500");
    await modal.locator("#inventory-quantity").fill("50");
    await modal.locator("#inventory-min-stock").fill("10");

    await modal.getByRole("button", { name: "Save Item" }).click();

    // Modal close
    await expect(modal).not.toBeVisible({ timeout: 10_000 });

    // Verify the item appears in the table
    await searchFor(page, itemName);
    const table = page.locator("table");
    await expect(table).toContainText(itemName, { timeout: 15_000 });
    await expect(table).toContainText(customCategory);
    await expect(table).toContainText("50");
  });

  // EDIT ITEM
  test("should edit an existing inventory item", async ({ page }) => {
    const itemName = `Edit-Test-${Date.now()}`;
    const seeded = await seedInventoryItem(itemName, "Electronics");
    const updatedName = `${itemName}-Updated`;

    try {
      await goToInventory(page);
      await searchFor(page, itemName);

      await expect(page.locator("table")).toContainText(itemName, {
        timeout: 15_000,
      });

      // Open action menu and click Edit
      const row = page.locator("tr", { hasText: itemName });
      await row
        .getByRole("button", { name: `Actions for ${itemName}` })
        .click();
      await page.getByRole("button", { name: "Edit Item" }).click();

      const modal = page.locator("form");
      await expect(modal).toBeVisible();

      // Update the name
      const nameInput = modal.getByPlaceholder("Enter item name");
      await nameInput.clear();
      await nameInput.fill(updatedName);

      await modal.getByRole("button", { name: "Update Item" }).click();
      await expect(modal).not.toBeVisible({ timeout: 10_000 });

      // Verify updated name appears
      await searchFor(page, updatedName);
      await expect(page.locator("table")).toContainText(updatedName, {
        timeout: 15_000,
      });
    } finally {
      await deleteInventoryItem(seeded.id).catch(() => undefined);
    }
  });

  // SEARCH & FILTER
  test("should filter items by search query", async ({ page }) => {
    const uniqueName = `SearchTarget-${Date.now()}`;
    const seeded = await seedInventoryItem(uniqueName, "Filters");

    try {
      await goToInventory(page);
      await searchFor(page, uniqueName);

      await expect(page.locator("table")).toContainText(uniqueName, {
        timeout: 15_000,
      });

      // Non-matching search should show empty state
      await searchFor(page, "zzz_no_match_zzz");
      await expect(page.locator("table")).toContainText(
        "No items match your filters",
      );
    } finally {
      await deleteInventoryItem(seeded.id).catch(() => undefined);
    }
  });

  // DELETE + UNDO
  test("should show delete confirmation modal and support undo", async ({
    page,
  }) => {
    const testItemName = `Delete-Test-${Date.now()}`;
    const seeded = await seedInventoryItem(testItemName, "Electronics");

    try {
      await goToInventory(page);
      await searchFor(page, testItemName);
      await expect(page.locator("table")).toContainText(testItemName, {
        timeout: 15_000,
      });

      // Open action menu → Delete Item
      const row = page.locator("tr", { hasText: testItemName });
      await row
        .getByRole("button", { name: `Actions for ${testItemName}` })
        .click();
      await page.getByRole("button", { name: "Delete Item" }).click();

      // Confirm the modal content
      await expect(
        page.getByRole("heading", { name: "Delete Item" }),
      ).toBeVisible();
      await expect(page.getByText(`"${testItemName}"`)).toBeVisible();
      await expect(
        page.getByText(/This action.*cannot.*be undone/i),
      ).toBeVisible();

      // Hit Delete in the modal
      await page.getByRole("button", { name: /^Delete$/ }).click();

      // Item should disappear from the table
      await expect(page.locator("table")).not.toContainText(testItemName, {
        timeout: 10_000,
      });

      // A toast with Undo should appear
      const undoButton = page.getByRole("button", { name: /undo/i });
      await expect(undoButton).toBeVisible({ timeout: 5_000 });

      // Click Undo — item should reappear
      await undoButton.click();
      await expect(page.locator("table")).toContainText(testItemName, {
        timeout: 10_000,
      });
    } finally {
      await deleteInventoryItem(seeded.id).catch(() => undefined);
    }
  });

  test("should permanently delete an item after the undo window expires", async ({
    page,
  }) => {
    const testItemName = `PermDelete-${Date.now()}`;
    const seeded = await seedInventoryItem(testItemName, "Electronics");

    try {
      await goToInventory(page);
      await searchFor(page, testItemName);
      await expect(page.locator("table")).toContainText(testItemName, {
        timeout: 15_000,
      });

      const row = page.locator("tr", { hasText: testItemName });
      await row
        .getByRole("button", { name: `Actions for ${testItemName}` })
        .click();
      await page.getByRole("button", { name: "Delete Item" }).click();
      await page.getByRole("button", { name: /^Delete$/ }).click();

      // Wait out the 5s undo window + buffer
      await page.waitForTimeout(6_000);

      // Item must be gone — confirm with a fresh page load
      await goToInventory(page);
      await searchFor(page, testItemName);
      await expect(page.locator("table")).toContainText(
        "No items match your filters",
        { timeout: 10_000 },
      );
    } finally {
      await deleteInventoryItem(seeded.id).catch(() => undefined);
    }
  });
});