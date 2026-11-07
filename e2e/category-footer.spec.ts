import { test, expect } from '@playwright/test'

const CATEGORIES = ['fashion', 'beauty', 'electronics', 'home', 'accessories']

for (const slug of CATEGORIES) {
  test(`category ${slug} footer does not render marquee or footer.jpg, and renders clean bottom footer`, async ({
    page,
  }) => {
    const motionErrors: string[] = []
    page.on('pageerror', (err) => motionErrors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Target ref')) {
        motionErrors.push(msg.text())
      }
    })

    await page.goto(`/category/${slug}`)
    await page.waitForTimeout(600)

    expect(motionErrors).toEqual([])

    // Heading and products visible
    await expect(page.locator('h1')).toBeVisible()

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // 1. Marquee city names must NOT be present in footer on category pages
    const marqueeCity = footer.locator('text=Karachi')
    await expect(marqueeCity).toHaveCount(0)

    // 2. Footer hero picture (/images/footer.jpg) must NOT be present
    const footerImg = footer.locator('img[src*="footer.jpg"]')
    await expect(footerImg).toHaveCount(0)

    // 3. Coupon card must NOT be present on category page
    const couponCard = footer.locator('text=HEAR MORE')
    await expect(couponCard).toHaveCount(0)

    // 4. Clean bottom footer content (logo, policy links, back to top) must be present
    const logoImg = footer.locator('img[alt="5000 RS SHOP"]')
    await expect(logoImg).toBeVisible()

    const policyLink = footer.locator('text=Shipping & COD Policy')
    await expect(policyLink).toBeVisible()

    const backToTop = footer.locator('text=Back to Top')
    await expect(backToTop).toBeVisible()
  })
}

test('homepage footer renders marquee, footer.jpg image, and coupon card', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  const footer = page.locator('footer')
  await expect(footer).toBeVisible()

  // 1. Marquee city names MUST be present on homepage
  const marqueeCity = footer.locator('text=Karachi').first()
  await expect(marqueeCity).toBeAttached()

  // 2. Footer hero picture (/images/footer.jpg) MUST be present on homepage
  const footerImg = footer.locator('img[src*="footer.jpg"]').first()
  await expect(footerImg).toBeAttached()

  // 3. Coupon card MUST be present on homepage
  const couponCard = footer.locator('text=HEAR MORE').first()
  await expect(couponCard).toBeAttached()

  // 4. Logo and policies present
  const logoImg = footer.locator('img[alt="5000 RS SHOP"]')
  await expect(logoImg).toBeAttached()
})
