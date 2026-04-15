import { test, expect } from '@playwright/test'

const LOGIN_URL = 'http://localhost:5174/login'
const INVENTORY_URL = 'http://localhost:5174/inventory'

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error(
        'Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set before running Playwright tests.'
    );
}

test.describe('Inventory End-to-End Flow', () => {
    test.beforeEach(async ({ page }) => {

        await page.goto(LOGIN_URL);
        await page.fill('input[type="email"]', TEST_EMAIL!);
        await page.fill('input[type="password"]', TEST_PASSWORD!);

        await page.click('button[type="submit"]')
        await page.waitForURL('**/dashboard') 
        
        await page.goto(INVENTORY_URL);
        await page.waitForLoadState('networkidle')
    });

    test('should add a new inventory item with a custom category', async ({ page }) => {
        const itemName = `Test-Item-${Date.now()}`;
        const customCategory = 'Hardware';

        await page.click('button:has-text("Add Item")');

        const modal = page.locator('form');

        await modal.getByPlaceholder('Enter item name').fill(itemName);

        await modal.getByRole('button', { name: 'Select a category' }).click();
        await modal.getByRole('option', { name: '+ Add New Category' }).click();

        const customInput = modal.getByPlaceholder('e.g. Hardware');
        await expect(customInput).toBeVisible();
        await customInput.fill(customCategory);

        await modal.locator('input[type="number"]').nth(0).fill('1500');
        await modal.locator('input[type="number"]').nth(1).fill('50');
        await modal.locator('input[type="number"]').nth(2).fill('10');

        await modal.getByRole('button', { name: 'Save Item' }).click();

        await expect(page.locator('table')).toContainText(itemName);
        await expect(page.locator('table')).toContainText(customCategory);
    });

    test('should show the custom Delete Confirmation Modal and delete an item', async ({ page }) => {
        // Seed a test-specific item so the test is hermetic
        const testItemName = `Delete-Test-${Date.now()}`;

        await page.click('button:has-text("Add Item")');
        const modal = page.locator('form');
        await modal.getByPlaceholder('Enter item name').fill(testItemName);
        
        // Select custom category
        await modal.getByRole('button', { name: 'Select a category' }).click();
        await modal.getByRole('option', { name: '+ Add New Category' }).click();
        await modal.getByPlaceholder('e.g. Hardware').fill('Electronics');

        await modal.locator('input[type="number"]').nth(0).fill('10');
        await modal.locator('input[type="number"]').nth(1).fill('1');
        await modal.locator('input[type="number"]').nth(2).fill('1');
        await modal.getByRole('button', { name: 'Save Item' }).click();
        await expect(page.locator('table')).toContainText(testItemName);

        // Find the row for our seeded item and click its delete button
        const row = page.locator('tr', { hasText: testItemName });
        await row.getByTestId('delete-item-button').click();

        const deleteModal = page.locator('text=Delete Item');
        await expect(deleteModal).toBeVisible();
        await expect(page.locator('text=Are you sure you want to delete this item?')).toBeVisible();

        await page.click('button:has-text("Delete")');

        await expect(page.locator('table')).not.toContainText(testItemName);
    })
})