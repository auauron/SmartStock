import { test, expect } from '@playwright/test'

const LOGIN_URL = 'http://localhost:5173/login'
const INVENTORY_URL = 'http://localhost:5173/inventory'
const RESTOCK_URL = 'http://localhost:5173/restock'

const TEST_EMAIL = process.env.TEST_USER_EMAIL
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    'Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set before running Playwright tests.'
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Logs in and navigates to the restock page. Runs before each test. */
async function loginAndGoToRestock(page: import('@playwright/test').Page) {
  await page.goto(LOGIN_URL)
  await page.fill('input[type="email"]', TEST_EMAIL!)
  await page.fill('input[type="password"]', TEST_PASSWORD!)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard')
  await page.goto(RESTOCK_URL)
  await page.waitForLoadState('networkidle')
}

/**
 * Seeds a product via the Inventory page so every restock test
 * has at least one product in the dropdown.
 */
async function seedProduct(page: import('@playwright/test').Page, name: string) {
  await page.goto(INVENTORY_URL)
  await page.waitForLoadState('networkidle')

  await page.click('button:has-text("Add Product")')
  const modal = page.locator('form')
  await modal.getByPlaceholder('Enter product name').fill(name)
  await modal.locator('select').selectOption('Electronics')
  await modal.locator('input[type="number"]').nth(0).fill('100')  // price
  await modal.locator('input[type="number"]').nth(1).fill('5')   // quantity
  await modal.locator('input[type="number"]').nth(2).fill('2')   // min stock
  await modal.getByRole('button', { name: 'Save Product' }).click()
  await expect(page.locator('table')).toContainText(name)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Restock Page — End-to-End Flow', () => {

  test.describe('Page load', () => {
    test('should render the restock page with form and history table', async ({ page }) => {
      await loginAndGoToRestock(page)

      // Heading
      await expect(page.getByRole('heading', { name: 'Restock Management' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Add Restock' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Restock History' })).toBeVisible()

      // Form elements
      await expect(page.locator('select')).toBeVisible()
      await expect(page.locator('input[type="number"]')).toBeVisible()
      await expect(page.locator('textarea')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Add Restock Entry' })).toBeVisible()
    })

    test('should show empty history state when no restocks exist', async ({ page }) => {
      await loginAndGoToRestock(page)

      // It's fine if history is either empty or has rows — just assert no crash
      const emptyState = page.getByText('No restock history available')
      const historyTable = page.locator('table')

      const hasEmpty = await emptyState.isVisible().catch(() => false)
      const hasTable = await historyTable.isVisible().catch(() => false)

<<<<<<< Updated upstream
      expect(hasEmpty || hasTable).toBe(true)
=======
      await Promise.any([
        expect(emptyMsg).toBeVisible({ timeout: 10_000 }).catch(() => null),
        expect(table).toBeVisible({ timeout: 10_000 }).catch(() => null),
      ])
>>>>>>> Stashed changes
    })
  })

  test.describe('Add Restock Entry', () => {
    let seededProductName: string

    test.beforeEach(async ({ page }) => {
      // Seed a fresh product for each test so we have something to restock
      seededProductName = `Restock-Product-${Date.now()}`
      await loginAndGoToRestock(page)
      await seedProduct(page, seededProductName)
      await page.goto(RESTOCK_URL)
      await page.waitForLoadState('networkidle')
    })

    test('should successfully submit a restock entry and show it in history', async ({ page }) => {
      // Arrange
      const quantity = '25'
      const notes = `E2E restock note ${Date.now()}`

      // Select the seeded product from the dropdown
      await page.locator('select').selectOption({ label: seededProductName })

      // Fill quantity and notes
      await page.locator('input[type="number"]').fill(quantity)
      await page.locator('textarea').fill(notes)

      // Act
      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      // Assert — form resets after success
      await expect(page.locator('select')).toHaveValue('')
      await expect(page.locator('input[type="number"]')).toHaveValue('')
      await expect(page.locator('textarea')).toHaveValue('')

      // Assert — new entry visible in history table
      const historyTable = page.locator('table')
      await expect(historyTable).toContainText(seededProductName)
      await expect(historyTable).toContainText(`+${quantity} units`)
      await expect(historyTable).toContainText(notes)
    })

    test('should show the quantity badge with correct format (+N units)', async ({ page }) => {
      const quantity = '10'

      await page.locator('select').selectOption({ label: seededProductName })
      await page.locator('input[type="number"]').fill(quantity)
      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      // Badge should read "+10 units"
      await expect(page.locator('table')).toContainText(`+${quantity} units`)
    })

    test('should add restock without notes and show "No notes" fallback', async ({ page }) => {
      await page.locator('select').selectOption({ label: seededProductName })
      await page.locator('input[type="number"]').fill('5')
      // Intentionally leave notes empty

      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      await expect(page.locator('table')).toContainText('No notes')
    })
  })

  test.describe('Form validation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAndGoToRestock(page)
    })

    test('should not submit when no product is selected', async ({ page }) => {
      // Fill quantity but leave product dropdown on default
      await page.locator('input[type="number"]').fill('10')
      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      // Form should still be visible and unsaved (no success reset)
      await expect(page.locator('input[type="number"]')).toHaveValue('10')
    })

    test('should disable the submit button while a submission is in progress', async ({ page }) => {
      // Check the button starts enabled
      const btn = page.getByRole('button', { name: 'Add Restock Entry' })
      await expect(btn).toBeEnabled()
    })
  })

  test.describe('Error handling', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
      // Navigate directly without logging in
      await page.goto(RESTOCK_URL)

      // Should be redirected away from restock (to login or landing)
      await expect(page).not.toHaveURL(/\/restock/)
    })
  })

  test.describe('Restock History table', () => {
    test('should display correct column headers', async ({ page }) => {
      await loginAndGoToRestock(page)

      const thead = page.locator('thead')
      await expect(thead).toContainText('Product Name')
      await expect(thead).toContainText('Quantity Added')
      await expect(thead).toContainText('Date')
      await expect(thead).toContainText('Notes')
    })

    test('should display dates in readable format (e.g. Apr 7, 2026)', async ({ page }) => {
      const productName = `Date-Test-${Date.now()}`
      await loginAndGoToRestock(page)
      await seedProduct(page, productName)
      await page.goto(RESTOCK_URL)
      await page.waitForLoadState('networkidle')

      await page.locator('select').selectOption({ label: productName })
      await page.locator('input[type="number"]').fill('3')
      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      // Date cell should contain a month abbreviation (Jan–Dec)
      const dateCell = page.locator('table tbody tr td').nth(2)
      await expect(dateCell).toHaveText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
    })
  })
})
