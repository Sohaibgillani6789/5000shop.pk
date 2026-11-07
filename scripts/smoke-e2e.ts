/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — End-to-End Staging / Local Smoke Suite
 *
 * Runs 18 rigorous integration test cases against the live HTTP server:
 *
 * CUSTOMER LIFECYCLE & SECURITY:
 *   1. Happy path COD checkout (valid PK mobile, address, province) -> 201
 *   2. Token-gated confirmation lookup with valid token -> 200
 *   3. Token security: invalid or omitted token hides PII
 *   4. Price-tampering resistance: manipulated prices ignored, catalog total charged
 *   5. Idempotent double-submit: identical idempotencyKey returns existing order
 *   6. Empty cart rejection -> 422
 *   7. Quantity <= 0 rejection -> 422
 *   8. Quantity > 10 rejection -> 422
 *   9. Decimal quantity rejection -> 422
 *  10. Duplicate products in single order rejection -> 422
 *  11. Nonexistent product ID rejection -> 400
 *  12. Invalid Pakistani phone number (e.g. landline) rejection -> 422
 *  13. Invalid province rejection -> 422
 *  14. Malformed JSON payload rejection -> 400
 *  15. Unsupported Media Type (non-JSON Content-Type) rejection -> 415
 *  16. Payload too large (> 16 KB) rejection -> 413
 *
 * ADMIN SECURITY & ACCESS CONTROL:
 *  17. Unauthenticated GET /admin/orders -> redirect (307) or 401
 *  18. Unauthenticated PATCH /api/admin/orders/[id] -> 401
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 npx tsx scripts/smoke-e2e.ts
 * ──────────────────────────────────────────────────────────────
 */

import { config } from 'dotenv'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

config({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[smoke-e2e] ❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const TEST_TAG = 'ZZ Verify Bot'
const createdOrderIds: string[] = []

async function cleanup() {
  if (createdOrderIds.length > 0) {
    console.log(`\n[cleanup] Purging ${createdOrderIds.length} smoke test order(s)...`)
    await serviceClient.from('orders').delete().in('id', createdOrderIds)
  }
}

async function run() {
  console.log('════════════════════════════════════════════════════════════════')
  console.log(' 5 HAZAAR TAK — End-to-End Staging / Smoke Test Suite')
  console.log(' Target URL:', BASE_URL)
  console.log('════════════════════════════════════════════════════════════════\n')

  let passed = 0
  let failed = 0

  function pass(msg: string) {
    console.log(`  ✅ [PASS] ${msg}`)
    passed++
  }

  function fail(msg: string, detail?: unknown) {
    console.error(`  ❌ [FAIL] ${msg}`)
    if (detail) console.error('     Detail:', detail)
    failed++
  }

  try {
    // 0. Fetch an in-stock product from Supabase to use in test orders
    const { data: products, error: pError } = await serviceClient
      .from('products')
      .select('id, title, slug, price, in_stock')
      .eq('in_stock', true)
      .limit(2)

    if (pError || !products || products.length === 0) {
      console.error('[smoke-e2e] Cannot run tests: No in-stock products in Supabase catalog.')
      process.exit(1)
    }

    const testProduct = products[0]
    console.log(`[setup] Using in-stock test product: "${testProduct.title}" (₨${testProduct.price}, ID: ${testProduct.id})\n`)

    // ── Case 1: Happy Path Checkout ─────────────────────────────
    console.log('[Case 1] Testing Happy Path COD Checkout...')
    const order1Idemp = `smoke-${Date.now()}-1`
    const order1Res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        email: 'test@5000shop.pk',
        province: 'Sindh',
        city: 'Karachi',
        area: 'Gulshan-e-Iqbal',
        address: 'Block 4, Street 12, House 45-B',
        paymentMethod: 'cod',
        idempotencyKey: order1Idemp,
        items: [
          {
            productId: testProduct.id,
            slug: testProduct.slug,
            quantity: 1,
          },
        ],
      }),
    })

    const order1Json = await order1Res.json()
    if (order1Res.status === 201 && order1Json.orderNumber && order1Json.confirmationToken) {
      createdOrderIds.push(order1Json.orderId)
      pass(`Happy Path order placed: 201 Created (Order #${order1Json.orderNumber})`)
    } else {
      fail(`Happy Path failed: HTTP ${order1Res.status}`, order1Json)
    }

    // ── Case 2: Token-gated Confirmation Page ───────────────────
    console.log('[Case 2] Testing Token-Gated Order Confirmation Page...')
    const confirmUrl = `${BASE_URL}/order-confirmation/${order1Json.orderNumber}?token=${order1Json.confirmationToken}`
    const confirmRes = await fetch(confirmUrl)
    const confirmHtml = await confirmRes.text()

    if (confirmRes.status === 200 && confirmHtml.includes(order1Json.orderNumber)) {
      pass('Order confirmation page loaded successfully with valid token (HTTP 200)')
    } else {
      fail(`Order confirmation failed with valid token: HTTP ${confirmRes.status}`)
    }

    // ── Case 3: Confirmation Security with Bogus Token ──────────
    console.log('[Case 3] Testing Confirmation Security with Bogus/Omitted Token...')
    const bogusUrl = `${BASE_URL}/order-confirmation/${order1Json.orderNumber}?token=00000000-0000-0000-0000-000000000000`
    const bogusRes = await fetch(bogusUrl)
    const bogusHtml = await bogusRes.text()

    // When token is invalid, page renders fallback security message without customer details
    if (!bogusHtml.includes(TEST_TAG)) {
      pass('Bogus token securely masked customer PII (zero private data leaked)')
    } else {
      fail('LEAK: Customer details displayed with bogus confirmation token!')
    }

    // ── Case 4: Price-Tampering Resistance ──────────────────────
    console.log('[Case 4] Testing Price-Tampering Resistance...')
    const tamperIdemp = `smoke-tamper-${Date.now()}`
    const tamperRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Punjab',
        city: 'Lahore',
        area: 'DHA',
        address: 'Sector Y, House 10',
        paymentMethod: 'cod',
        idempotencyKey: tamperIdemp,
        subtotal: 1.00,       // Client sends fake subtotal
        delivery_fee: 0.00,   // Client sends 0 delivery
        total: 1.00,          // Client sends ₨1 total
        items: [
          {
            productId: testProduct.id,
            slug: testProduct.slug,
            unitPrice: 1.00,  // Client sends ₨1 price
            quantity: 2,
          },
        ],
      }),
    })

    const tamperJson = await tamperRes.json()
    if (tamperRes.status === 201) {
      createdOrderIds.push(tamperJson.orderId)
      const expectedTotal = Number((testProduct.price * 2 + 250).toFixed(2))
      if (Number(tamperJson.total) === expectedTotal) {
        pass(`Tampered price overridden: Charged real catalog total ₨${tamperJson.total} (expected ₨${expectedTotal})`)
      } else {
        fail(`Tampered total accepted: got ₨${tamperJson.total}, expected ₨${expectedTotal}`)
      }
    } else {
      fail(`Tamper test failed with HTTP ${tamperRes.status}`, tamperJson)
    }

    // ── Case 5: Idempotency & Double-Submit ──────────────────────
    console.log('[Case 5] Testing Idempotent Double-Submit Protection...')
    const doubleRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Punjab',
        city: 'Lahore',
        area: 'DHA',
        address: 'Sector Y, House 10',
        paymentMethod: 'cod',
        idempotencyKey: tamperIdemp, // Replay same idempotency key
        items: [
          {
            productId: testProduct.id,
            slug: testProduct.slug,
            quantity: 2,
          },
        ],
      }),
    })

    const doubleJson = await doubleRes.json()
    if (doubleRes.status === 201 && doubleJson.orderNumber === tamperJson.orderNumber) {
      pass(`Idempotent submission safely deduplicated: Returned original order #${doubleJson.orderNumber}`)
    } else {
      fail(`Idempotent submission failed: HTTP ${doubleRes.status}`, doubleJson)
    }

    // ── Case 6: Empty Cart Rejection (422) ───────────────────────
    console.log('[Case 6] Testing Empty Cart Rejection...')
    const emptyRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `empty-${Date.now()}`,
        items: [],
      }),
    })
    if (emptyRes.status === 422) {
      pass('Empty cart rejected with HTTP 422 Unprocessable Content')
    } else {
      fail(`Empty cart expected HTTP 422, got HTTP ${emptyRes.status}`)
    }

    // ── Case 7: Quantity <= 0 Rejection (422) ───────────────────
    console.log('[Case 7] Testing Quantity <= 0 Rejection...')
    const qtyZeroRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `qty0-${Date.now()}`,
        items: [{ productId: testProduct.id, slug: testProduct.slug, quantity: 0 }],
      }),
    })
    if (qtyZeroRes.status === 422) {
      pass('Quantity <= 0 rejected with HTTP 422 Unprocessable Content')
    } else {
      fail(`Quantity <= 0 expected HTTP 422, got HTTP ${qtyZeroRes.status}`)
    }

    // ── Case 8: Quantity > 10 Rejection (422) ───────────────────
    console.log('[Case 8] Testing Quantity > 10 Rejection...')
    const qty11Res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `qty11-${Date.now()}`,
        items: [{ productId: testProduct.id, slug: testProduct.slug, quantity: 11 }],
      }),
    })
    if (qty11Res.status === 422) {
      pass('Quantity > 10 rejected with HTTP 422 Unprocessable Content')
    } else {
      fail(`Quantity > 10 expected HTTP 422, got HTTP ${qty11Res.status}`)
    }

    // ── Case 9: Decimal Quantity Rejection (422) ────────────────
    console.log('[Case 9] Testing Decimal Quantity Rejection...')
    const decimalQtyRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `dec-${Date.now()}`,
        items: [{ productId: testProduct.id, slug: testProduct.slug, quantity: 2.5 }],
      }),
    })
    if (decimalQtyRes.status === 422) {
      pass('Decimal quantity rejected with HTTP 422 Unprocessable Content')
    } else {
      fail(`Decimal quantity expected HTTP 422, got HTTP ${decimalQtyRes.status}`)
    }

    // ── Case 10: Duplicate Products in Single Order (422) ───────
    console.log('[Case 10] Testing Duplicate Products Rejection...')
    const dupRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `dup-${Date.now()}`,
        items: [
          { productId: testProduct.id, slug: testProduct.slug, quantity: 1 },
          { productId: testProduct.id, slug: testProduct.slug, quantity: 2 },
        ],
      }),
    })
    if (dupRes.status === 422) {
      pass('Duplicate product IDs in payload rejected with HTTP 422')
    } else {
      fail(`Duplicate products expected HTTP 422, got HTTP ${dupRes.status}`)
    }

    // ── Case 11: Nonexistent Product ID (400) ───────────────────
    console.log('[Case 11] Testing Nonexistent Product ID Rejection...')
    const ghostRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `ghost-${Date.now()}`,
        items: [
          { productId: '00000000-0000-0000-0000-000000000000', slug: 'ghost', quantity: 1 },
        ],
      }),
    })
    if (ghostRes.status === 400) {
      pass('Nonexistent product ID cleanly rejected with HTTP 400')
    } else {
      fail(`Nonexistent product ID expected HTTP 400, got HTTP ${ghostRes.status}`)
    }

    // ── Case 12: Invalid Pakistani Mobile Phone (422) ───────────
    console.log('[Case 12] Testing Invalid Phone Number Rejection...')
    const badPhoneRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '02131234567', // Landline, not mobile
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `phone-${Date.now()}`,
        items: [{ productId: testProduct.id, slug: testProduct.slug, quantity: 1 }],
      }),
    })
    if (badPhoneRes.status === 422) {
      pass('Invalid phone (landline) rejected with HTTP 422')
    } else {
      fail(`Invalid phone expected HTTP 422, got HTTP ${badPhoneRes.status}`)
    }

    // ── Case 13: Invalid Province (422) ─────────────────────────
    console.log('[Case 13] Testing Invalid Province Rejection...')
    const badProvRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: TEST_TAG,
        phone: '03001234567',
        province: 'California',
        city: 'Karachi',
        area: 'DHA',
        address: 'Test Lane',
        paymentMethod: 'cod',
        idempotencyKey: `prov-${Date.now()}`,
        items: [{ productId: testProduct.id, slug: testProduct.slug, quantity: 1 }],
      }),
    })
    if (badProvRes.status === 422) {
      pass('Invalid province rejected with HTTP 422')
    } else {
      fail(`Invalid province expected HTTP 422, got HTTP ${badProvRes.status}`)
    }

    // ── Case 14: Malformed JSON (400) ───────────────────────────
    console.log('[Case 14] Testing Malformed JSON Rejection...')
    const malformedRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"unclosed_json: true',
    })
    if (malformedRes.status === 400) {
      pass('Malformed JSON rejected with HTTP 400 Bad Request')
    } else {
      fail(`Malformed JSON expected HTTP 400, got HTTP ${malformedRes.status}`)
    }

    // ── Case 15: Unsupported Media Type (415) ───────────────────
    console.log('[Case 15] Testing Unsupported Media Type (415)...')
    const badMediaRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'plain text body',
    })
    if (badMediaRes.status === 415) {
      pass('Non-JSON media type rejected with HTTP 415 Unsupported Media Type')
    } else {
      fail(`Non-JSON media type expected HTTP 415, got HTTP ${badMediaRes.status}`)
    }

    // ── Case 16: Payload Too Large (413) ────────────────────────
    console.log('[Case 16] Testing Payload Too Large (413)...')
    const largePayload = JSON.stringify({ padding: 'x'.repeat(18 * 1024) })
    const largeRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: largePayload,
    })
    if (largeRes.status === 413) {
      pass('Oversized payload rejected with HTTP 413 Payload Too Large')
    } else {
      fail(`Oversized payload expected HTTP 413, got HTTP ${largeRes.status}`)
    }

    // ── Case 17: Unauthenticated Admin Page Guard (307/401) ─────
    console.log('[Case 17] Testing Unauthenticated Admin Page Guard...')
    const adminPageRes = await fetch(`${BASE_URL}/admin/orders`, {
      redirect: 'manual',
    })
    if (adminPageRes.status === 307 || adminPageRes.status === 302 || adminPageRes.status === 401) {
      pass(`Unauthenticated visit to /admin/orders redirected cleanly (HTTP ${adminPageRes.status})`)
    } else {
      fail(`Unauthenticated /admin/orders expected 307 redirect, got HTTP ${adminPageRes.status}`)
    }

    // ── Case 18: Unauthenticated Admin API Guard (401) ──────────
    console.log('[Case 18] Testing Unauthenticated Admin API PATCH Guard...')
    const adminApiRes = await fetch(`${BASE_URL}/api/admin/orders/00000000-0000-0000-0000-000000000000`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: 'confirmed' }),
    })
    if (adminApiRes.status === 401) {
      pass('Unauthenticated PATCH to /api/admin/orders/[id] rejected with HTTP 401')
    } else {
      fail(`Unauthenticated PATCH expected HTTP 401, got HTTP ${adminApiRes.status}`)
    }
  } catch (err) {
    console.error('[smoke-e2e] Unexpected error:', err)
    failed++
  } finally {
    await cleanup()
  }

  console.log('\n════════════════════════════════════════════════════════════════')
  console.log(` SMOKE SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`)
  console.log('════════════════════════════════════════════════════════════════')

  if (failed > 0) {
    process.exit(1)
  }
}

run()
