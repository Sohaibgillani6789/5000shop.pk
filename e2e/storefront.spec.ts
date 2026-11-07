import { test, expect } from '@playwright/test'

test.describe('Storefront Browsing Journey', () => {
  test('homepage renders hero, categories, and footer', async ({ page }) => {
    await page.goto('/')

    // Verify title and brand presence
    await expect(page).toHaveTitle(/5 Hazaar Tak|5000shop/i)

    // Verify Hero CTA and Trust Pillars
    const shopNowCta = page.locator('text=SHOP NOW').first()
    await expect(shopNowCta).toBeVisible()

    const trustBadge = page.locator('text=Cash on Delivery').first()
    await expect(trustBadge).toBeVisible()

    // Verify Footer is rendered
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText(/COD|5 HAZAAR TAK/i)
  })

  test('category navigation loads products under ₨5,000', async ({ page }) => {
    // Navigate to canonical Electronics category
    await page.goto('/category/electronics')

    // Expect category title to render
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()

    // Verify product price badges display currency
    const priceBadges = page.locator('text=/(?:Rs|₨)\\s*[0-9,]+/')
    const count = await priceBadges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('legal policy pages load successfully', async ({ page }) => {
    await page.goto('/shipping-policy')
    await expect(page.locator('h1')).toContainText(/Shipping/i)

    await page.goto('/return-policy')
    await expect(page.locator('h1')).toContainText(/Return/i)
  })
})
