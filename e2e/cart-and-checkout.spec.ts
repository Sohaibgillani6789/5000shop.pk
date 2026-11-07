import { test, expect } from '@playwright/test'

test.describe('Cart & Checkout User Journey', () => {
  test('cart page renders empty state when no items in storage', async ({ page }) => {
    await page.goto('/cart')

    // Expect empty cart indicator
    const emptyNotice = page.locator('text=/Cart is empty|Your cart is empty|No items/i')
    await expect(emptyNotice).toBeVisible()
  })

  test('checkout page validates required fields before submission', async ({ page }) => {
    // Populate localStorage with a sample cart item so checkout doesn't show empty cart state
    await page.addInitScript(() => {
      window.localStorage.setItem(
        '5000shop_cart_v1',
        JSON.stringify([
          {
            productId: 'test-p1',
            slug: 'test-wallet',
            title: 'Test Leather Wallet',
            price: 1500,
            imageUrl: null,
            quantity: 1,
          },
        ])
      )
    })

    await page.goto('/checkout')

    const nameInput = page.getByLabel(/Full Name/i)
    await expect(nameInput).toBeVisible()

    const submitBtn = page.getByRole('button', { name: 'Place Cash on Delivery Order' })
    await expect(submitBtn).toBeVisible()
    await submitBtn.dispatchEvent('click')

    // Customer name validation error should be visible
    const nameError = page.locator('text=Name must be at least 2 characters long.')
    await expect(nameError).toBeVisible()
  })
})
