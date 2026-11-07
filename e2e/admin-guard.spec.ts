import { test, expect } from '@playwright/test'

test.describe('Admin Route Guards & Access Control', () => {
  test('unauthenticated visit to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin')

    // Expect redirection to login
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.locator('.admin-login-subtitle')).toContainText(/Admin Portal/i)
  })

  test('unauthenticated visit to /admin/orders redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin/orders')

    // Expect redirection to login
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
