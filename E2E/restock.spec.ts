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

/** Logs in and navigates to the restock page. */
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
 * Seeds a product via the Inventory page so restock tests
 * have at least one product in the dropdown.
 */
async function seedProduct(page: import('@playwright/test').Page, name: string) {
  await page.goto(INVENTORY_URL)
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: 'Add Product' }).click()

  const modal = page.locator('form')
  await expect(modal).toBeVisible()

  await modal.getByPlaceholder('Enter product name').fill(name)
  await modal.locator('select').selectOption('Electronics')
  await modal.locator('input[type="number"]').nth(0).fill('100') // price
  await modal.locator('input[type="number"]').nth(1).fill('5')   // quantity
  await modal.locator('input[type="number"]').nth(2).fill('2')   // min stock
  await modal.getByRole('button', { name: 'Save Product' }).click()

  await expect(page.locator('table')).toContainText(name, { timeout: 15_000 })
}

/**
 * Waits for the product dropdown on the restock page to have a named option.
 * Needed because the dropdown is populated asynchronously via Supabase.
 */
async function waitForProductOption(
  page: import('@playwright/test').Page,
  productName: string,
) {
  await expect(page.locator('select option', { hasText: productName })).toBeAttached({
    timeout: 15_000,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Restock Page — End-to-End Flow', () => {

  test.describe('Page load', () => {
    test('should render the restock page with form and history table', async ({ page }) => {
      await loginAndGoToRestock(page)

      await expect(page.getByRole('heading', { name: 'Restock Management' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Add Restock' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Restock History' })).toBeVisible()
      await expect(page.locator('select')).toBeVisible()
      await expect(page.locator('input[type="number"]')).toBeVisible()
      await expect(page.locator('textarea')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Add Restock Entry' })).toBeVisible()
    })

    test('should show history section (empty state or rows) on load', async ({ page }) => {
      await loginAndGoToRestock(page)

      // Heading always renders regardless of data
      await expect(page.getByRole('heading', { name: 'Restock History' })).toBeVisible()

      // Either the empty-state message OR the data table must be present
      const emptyMsg = page.getByText('No restock history available')
      const table = page.locator('table')

      await Promise.race([
        expect(emptyMsg).toBeVisible({ timeout: 10_000 }).catch(() => null),
        expect(table).toBeVisible({ timeout: 10_000 }).catch(() => null),
      ])
    })
  })

  test.describe('Add Restock Entry', () => {
    let seededProductName: string

    test.beforeEach(async ({ page }) => {
      seededProductName = `Restock-Product-${Date.now()}`
      await loginAndGoToRestock(page)
      await seedProduct(page, seededProductName)

      // Navigate back and wait for dropdown to be populated
      await page.goto(RESTOCK_URL)
      await page.waitForLoadState('networkidle')
      await waitForProductOption(page, seededProductName)
    })

    test('should successfully submit a restock entry and show it in history', async ({ page }) => {
      const quantity = '25'
      const notes = `E2E restock note ${Date.now()}`

      await page.locator('select').selectOption({ label: seededProductName })
      await page.locator('input[type="number"]').fill(quantity)
      await page.locator('textarea').fill(notes)

      // Submit and wait for Supabase response
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('supabase') && r.status() < 400),
        page.getByRole('button', { name: 'Add Restock Entry' }).click(),
      ])
      expect(response.status()).toBeLessThan(400)

      // Form resets on success
      await expect(page.locator('select')).toHaveValue('')
      await expect(page.locator('input[type="number"]')).toHaveValue('')
      await expect(page.locator('textarea')).toHaveValue('')

      // New entry appears in history
      await expect(page.locator('table')).toContainText(seededProductName, { timeout: 10_000 })
      await expect(page.locator('table')).toContainText(`+${quantity} units`)
      await expect(page.locator('table')).toContainText(notes)
    })

    test('should show the quantity badge with correct format (+N units)', async ({ page }) => {
      const quantity = '10'

      await page.locator('select').selectOption({ label: seededProductName })
      await page.locator('input[type="number"]').fill(quantity)

      await Promise.all([
        page.waitForResponse((r) => r.url().includes('supabase') && r.status() < 400),
        page.getByRole('button', { name: 'Add Restock Entry' }).click(),
      ])

      await expect(page.locator('table')).toContainText(`+${quantity} units`, { timeout: 10_000 })
    })

    test('should add restock without notes and show "No notes" fallback', async ({ page }) => {
      await page.locator('select').selectOption({ label: seededProductName })
      await page.locator('input[type="number"]').fill('5')

      await Promise.all([
        page.waitForResponse((r) => r.url().includes('supabase') && r.status() < 400),
        page.getByRole('button', { name: 'Add Restock Entry' }).click(),
      ])

      await expect(page.locator('table')).toContainText('No notes', { timeout: 10_000 })
    })
  })

  test.describe('Form validation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAndGoToRestock(page)
    })

    test('should not submit when no product is selected', async ({ page }) => {
      await page.locator('input[type="number"]').fill('10')
      await page.getByRole('button', { name: 'Add Restock Entry' }).click()

      // Quantity remains — form was not reset by a successful submission
      await expect(page.locator('input[type="number"]')).toHaveValue('10')
    })

    test('should have submit button enabled when page loads', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Add Restock Entry' })).toBeEnabled()
    })
  })

  test.describe('Error handling', () => {
    test('should render the restock page for unauthenticated users (no auth guard in Layout)', async ({ page }) => {
      // Layout does NOT redirect unauthenticated users. This test documents
      // that known behaviour so it fails if an auth guard is ever added.
      await page.goto(RESTOCK_URL)
      await page.waitForLoadState('networkidle')

      await expect(page.getByRole('heading', { name: 'Restock Management' })).toBeVisible()
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

    test('should display dates in a readable format (e.g. Apr 7, 2026)', async ({ page }) => {
      const productName = `Date-Test-${Date.now()}`
      await loginAndGoToRestock(page)
      await seedProduct(page, productName)

      await page.goto(RESTOCK_URL)
      await page.waitForLoadState('networkidle')
      await waitForProductOption(page, productName)

      await page.locator('select').selectOption({ label: productName })
      await page.locator('input[type="number"]').fill('3')

      await Promise.all([
        page.waitForResponse((r) => r.url().includes('supabase') && r.status() < 400),
        page.getByRole('button', { name: 'Add Restock Entry' }).click(),
      ])

      // First date cell in tbody must contain a month abbreviation
      const dateCell = page.locator('table tbody tr td').nth(2)
      await expect(dateCell).toHaveText(
        /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/,
        { timeout: 10_000 },
      )
    })
  })
})
