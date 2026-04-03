import { test, expect } from '@playwright/test'

const LOGIN_URL = 'http://localhost:5173/login'
const INVENTORY_URL = 'http://localhost:5173/inventory'

test.describe('Inventory End-to-End Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(LOGIN_URL);
        await page.fill('input[type="email"]', 'johndoe@gmail.com');
        await page.fill('input[type="password"]', 'HelloWorld');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForURL('**/dashboard') 
        ]);
        
        await page.goto(INVENTORY_URL);
        
        await expect(page.locator('button:has-text("Add Product")')).toBeVisible();
    });


    test('should show the custom Delete Confirmation Modal and delete a product', async ({ page }) => {
        await page.locator('button.text-red-600').first().click();

        const deleteModal = page.locator('text=Delete Product');
        await expect(deleteModal).toBeVisible();
        await expect(page.locator('text=Are you sure you want to delete this product?')).toBeVisible();

        await page.click('button:has-text("Delete")');

        await expect(page.locator('table')).not.toContainText('Logitech MX Master');
    })
})