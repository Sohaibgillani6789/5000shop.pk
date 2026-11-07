# 5000shop.pk (5 Hazaar Tak) — Master AI Agent Execution Plan

## Purpose & Agent Directive
You are an autonomous Staff Software Engineer working on `5000shop.pk` (**5 Hazaar Tak**), a Pakistani Cash-on-Delivery (COD) e-commerce platform where every item is priced between ₨1 and ₨5,000.

The repository is currently at **~85% MVP functionality** and **~60–70% production launch readiness**. ESLint, strict TypeScript, and local route smoke tests (`HTTP 200` on homepage, categories, products, cart, checkout, robots, and sitemap) already pass.

**Your Directive:**
Execute the phases in this document **strictly in numerical order (Phase 0 through Phase 8)**. Do not skip verification gates, do not combine multiple phases into a single unverified change set, and never claim a phase is complete until every command and acceptance criterion in its gate passes.

---

## 0. Execution Progress Tracker
Update this checklist at the end of every session so the next agent session has deterministic state awareness:

- [x] **Phase 0:** Build Unblocking & Dependency Security Hardening (Offline Fonts, Next.js 16 Patch, `middleware` $\rightarrow$ `proxy`) — ✅ 2026-11-02
- [x] **Phase 1:** Environment & Configuration Hardening (`.env` Contract & Startup Validation) — ✅ 2026-11-02
- [x] **Phase 2:** Supabase Database, RLS & Atomic RPC Verification (Migrations `001`–`003` + Seed + Security Audit) — ✅ 2026-11-02
- [x] **Phase 3:** Staging Deployment & End-to-End Checkout/Admin Verification — ✅ 2026-11-02
- [x] **Phase 4:** Automated Test Suite (Vitest Unit/Integration + Playwright E2E) — ✅ 2026-11-02
- [x] **Phase 5:** CI/CD Pipeline Automation (GitHub Actions) — ✅ 2026-11-02
- [x] **Phase 6:** V2 Quantity-Based Inventory & Oversell Protection — ⏭️ Deferred to Post-Launch V2 (owner decision)
- [x] **Phase 7:** Final Production Launch Readiness Gate — ✅ 2026-11-02

---

## 1. System Architecture & Baseline Context

### 1.1 Tech Stack & Implemented Capabilities
- **Framework:** Next.js 16 (App Router), React 19, Strict TypeScript, Tailwind CSS v4.
- **Storefront:** Homepage, 5 canonical category routes, product detail pages, shipping/return policy pages, full SEO metadata, JSON-LD, `sitemap.ts`, `robots.ts`, loading/error/not-found boundaries.
- **Cart & Checkout:** Client cart drawer and page with resilient `localStorage` persistence, Pakistani address & mobile phone validation, Cash on Delivery (COD) flow.
- **Backend & Security:** Server-side price/stock/total recalculation, atomic Supabase order creation RPC, token-gated order confirmation page, Supabase Auth admin login, protected admin order dashboard with status/courier/tracking/notes mutations.
- **Database:** Three SQL migrations (`001`, `002`, `003`) and `supabase/seed.sql`.

### 1.2 Known Baseline Gaps to Resolve
1. **Build Friction:** `npm run build` fails in restricted/offline environments because `next/font/google` attempts to fetch `Inter` and `Outfit` over the network.
2. **Framework Deprecation:** Next.js 16 warns that `middleware` is deprecated in favor of the `proxy` convention.
3. **Dependency Vulnerabilities:** `npm audit` reports **1 critical** and **8 high** vulnerabilities (including a critical Next.js advisory).
4. **Unverified Live Supabase State:** Migrations `001`–`003`, RLS policies, and atomic RPC edge cases must be proven against a real Supabase instance.
5. **Zero Test Files & No CI:** Currently `0` automated test files and no `.github/workflows` pipeline exist.
6. **Boolean Inventory:** Stock is currently tracked via `in_stock` boolean; atomic quantity decrement (`stock_quantity`) is deferred to Phase 6 (V2).

### 1.3 Non-Negotiable Business & Security Rules
1. **Price Ceiling:** Every sellable product must have a unit price strictly satisfying $\text{₨}1 \le \text{price} \le \text{₨}5,000$.
2. **Payment Method:** Cash on Delivery (COD) is the only active payment method.
3. **Zero Client Trust:** Client-submitted unit prices, line totals, subtotals, discounts, delivery fees, and stock flags must **never** be trusted; the server and database must recompute and enforce them.
4. **Atomic Order Creation:** Orders and order items must be created in a single atomic transaction via Supabase RPC with idempotency protection.
5. **Frictionless Public Shopping:** Public shoppers must never be required to log in or authenticate.
6. **Non-Enumerable Orders:** Customer order confirmation details must never be accessible by sequential ID or order number alone; a valid confirmation token is mandatory.
7. **Credential Isolation:** `SUPABASE_SERVICE_ROLE_KEY` and admin verification helpers must remain strictly server-only (`server-only` package or isolated server modules) and never leak into client bundles or logs.

---

## 2. Agent Operating Rules & Guardrails

### Before Writing Code
1. **Inspect First:** Read existing route handlers, Supabase clients, validation schemas, and SQL migrations before proposing changes. Reuse established patterns and utilities.
2. **Preserve UX & Design:** Do not alter the Tailwind v4 visual tokens, typography scale, RTL/LTR ergonomics, accessibility attributes, or mobile layouts unless required by a bug fix.
3. **Strict TypeScript:** Never introduce `any`, `@ts-ignore`, `@ts-expect-error`, or silent `catch {}` blocks.
4. **Minimal Blast Radius:** Complete one phase at a time with small, reviewable changes.
5. **Secret Hygiene:** Never read, print, commit, or hardcode values from `.env`, `.env.local`, or `.env.production`.

### Mandatory Post-Change Validation Loop
After every code modification, run the following commands in order and include the exact output summary in your report:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

> **Note:** If binaries are missing, run `npm ci` first. Never run `npm audit fix --force` blindly without inspecting breaking version jumps.

---

## 3. Step-by-Step Implementation Phases

---

### Phase 0 — Reproducible Local Baseline, Font Self-Hosting & Dependency Hardening

#### Objective
Eliminate external network dependencies during `next build`, resolve critical/high `npm audit` vulnerabilities, and migrate from deprecated `middleware` to Next.js 16 `proxy`.

#### Step-by-Step Tasks
1. **Verify Git & Secret Hygiene:**
   ```bash
   git status --short
   git check-ignore -v .env .env.local .env.production
   ```
   Verify that all referenced local product/UI assets exist under `public/images`.
2. **Eliminate Google Fonts Network Build Failure:**
   - Replace `next/font/google` imports for `Inter` and `Outfit` with bundled local `.woff2` font files using `next/font/local` (stored under `src/app/fonts/` or `public/fonts/`), **or** configure a resilient local-first font stack that preserves the exact CSS variables (`--font-inter`, `--font-outfit`) expected by Tailwind CSS v4.
   - Do not degrade the visual typography.
3. **Remediate Dependency Vulnerabilities (1 Critical, 8 High):**
   - Run `npm audit` and classify advisories into runtime (`dependencies`) vs build/dev (`devDependencies`).
   - Upgrade `next` (and matching `eslint-config-next` / `@next/*` packages) to the latest patched Next.js 16.x release that resolves the critical advisory while keeping React 19 compatibility intact.
   - Safely update other vulnerable packages via targeted `npm install <pkg>@<patched-version>` or `npm update`.
   - Remove any unused packages that inflate the attack surface.
4. **Address Next.js 16 `middleware` $\rightarrow$ `proxy` Deprecation:**
   - Inspect the current `middleware.ts`.
   - If the installed Next.js 16 version supports `proxy.ts`, migrate `middleware.ts` to `proxy.ts` (using the official codemod `npx @next/codemod@latest middleware-to-proxy .` or manual rename exporting `proxy`), ensuring:
     - Supabase auth session refresh continues to work seamlessly.
     - Public storefront routes remain unrestricted.
     - Protected `/admin` routes redirect unauthenticated users cleanly.
     - Static assets (`_next/static`, `_next/image`, `favicon.ico`, `images/*`) remain excluded in `config.matcher`.

#### Phase 0 Acceptance Gate
- [ ] `npm ci` succeeds cleanly.
- [ ] `npm audit --omit=dev` reports **0 critical** and **0 high** vulnerabilities (or any remaining dev-only advisory is explicitly documented with justification).
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npx tsc --noEmit` passes with 0 type errors.
- [ ] `npm run build` succeeds completely offline/without external Google Fonts access and without `middleware` deprecation warnings.

---

### Phase 1 — Environment & Configuration Hardening

#### Objective
Make environment configuration fail-fast, self-documenting, and leak-proof across local, staging, and production environments.

#### Step-by-Step Tasks
1. **Synchronize `.env.local.example`:**
   Ensure `.env.local.example` documents every required variable with clear comments categorizing them as **Public (Browser-Safe)** vs **Server-Only (Secret)**:
   ```env
   # Public Browser Variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567

   # Server-Only Secrets (NEVER expose to client)
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_EMAILS=admin@5000shop.pk
   ```
   *(If `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is supported as a fallback, explicitly document the fallback precedence in code and comments).*
2. **Centralized Env Validation:**
   - Audit or create a centralized environment validator (e.g., `src/lib/env.ts`).
   - Validate required variables at startup/request time with clear, actionable server error messages if a variable is missing or malformed.
   - Ensure `ADMIN_EMAILS` is parsed cleanly (trimmed, lowercased, comma-separated) and is **only** used to authorize an already-authenticated Supabase user session—never as a standalone auth bypass.
3. **Log & Bundle Audit:**
   - Search the codebase for `console.log`, `console.error`, and logger calls. Redact or remove any statement that could output confirmation tokens, service keys, full customer street addresses, or raw phone numbers in production logs.
   - Verify that no client component (`"use client"`) imports server environment helpers or `SUPABASE_SERVICE_ROLE_KEY`.

#### Phase 1 Acceptance Gate
- [ ] Missing required env vars throw descriptive server-side errors without exposing sensitive values.
- [ ] `NEXT_PUBLIC_SITE_URL` powers all canonical URLs, OpenGraph tags, `sitemap.ts`, `robots.ts`, and order confirmation links.
- [ ] Client bundle inspection confirms zero leakage of `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_EMAILS`.

---

### Phase 2 — Supabase Database, RLS & Atomic RPC Verification

#### Objective
Prove that migrations `001`–`003` and `seed.sql` apply cleanly to a real Supabase database and that RLS policies, constraints, and `SECURITY DEFINER` RPCs enforce all business rules at the database layer.

#### Step-by-Step Tasks
1. **Static & Live Audit of Migrations (`001`, `002`, `003`):**
   Apply in exact order against the target Staging/Dev Supabase project:
   1. `supabase/migrations/001_featured_products_migration.sql`
   2. `supabase/migrations/002_orders_and_atomic_rpc.sql`
   3. `supabase/migrations/003_catalog_sku_and_stock_policy.sql`
   4. `supabase/seed.sql` *(Staging/Dev only — never run unreviewed seed data on Production)*.
2. **Defensive RPC & Constraint Hardening:**
   Inspect the SQL definitions in `002` and `003`. If any gap exists, write a new forward migration (`004_rpc_security_hardening.sql`) to guarantee:
   - `products.price` has a `CHECK (price > 0 AND price <= 5000)` constraint.
   - `products.sku` is `NOT NULL` and `UNIQUE`.
   - Every `SECURITY DEFINER` RPC explicitly sets `SET search_path = public` to prevent search-path hijacking.
   - The order creation RPC validates internally:
     - Non-empty items array and valid quantities ($1 \le \text{qty} \le 10$).
     - Referenced products exist and have `in_stock = true`.
     - Unit prices and line totals are fetched/recomputed from `public.products` inside PostgreSQL (ignoring any client-supplied price).
     - Idempotency key collisions return the existing order record rather than inserting a duplicate.
   - The order confirmation lookup RPC requires **both** the order identifier and the matching secret `confirmation_token`.
3. **Programmatic Verification Script:**
   Create a repeatable verification script (e.g., `scripts/verify-supabase.ts` runnable via `npx tsx scripts/verify-supabase.ts`) that connects to the configured Supabase instance and automatically verifies:
   - All 5 canonical categories exist.
   - All seeded products have valid slugs, SKUs, image paths, and prices $\le \text{₨}5,000$.
   - Anonymous client (`ANON_KEY`) **can** read active catalog items.
   - Anonymous client (`ANON_KEY`) **cannot** `SELECT`, `INSERT`, `UPDATE`, or `DELETE` directly on `orders` or `order_items` (RLS denies access).
   - Valid order RPC call creates exactly 1 order + matching `order_items`.
   - Re-sending the exact same `idempotency_key` returns the original order without duplicating rows.
   - Out-of-stock or invalid product IDs are rejected atomically.
   - Confirmation RPC succeeds with the valid token and fails with a wrong/empty token.

#### Phase 2 Acceptance Gate
- [ ] Migrations `001`–`003` (and `004` if needed) execute idempotently without errors.
- [ ] Automated Supabase verification script passes 100% of catalog, RLS, idempotency, and token checks.

---

### Phase 3 — Staging Deployment & End-to-End Flow Verification

#### Objective
Deploy the application to a live staging environment (e.g., Vercel Preview/Staging) connected to the verified Staging Supabase project, and validate the complete customer and admin lifecycle.

#### Step-by-Step Tasks
1. **Deploy Staging Environment:**
   - Configure all 6 required environment variables in the hosting provider.
   - Deploy and confirm the build succeeds and all public routes return `HTTP 200`.
2. **Execute Customer Checkout & Edge-Case Verification:**
   Verify via browser/Playwright and direct API requests against `/api/orders`:
   - **Happy Path:** Browse homepage $\rightarrow$ category $\rightarrow$ product detail $\rightarrow$ add to cart $\rightarrow$ reload page (verify `localStorage` persistence) $\rightarrow$ submit valid Pakistani checkout (valid `03XXXXXXXXX` / `+923XXXXXXXXX` mobile, valid province, valid address) $\rightarrow$ redirect to confirmation page with token.
   - **Tamper Resistance:** Send a `POST /api/orders` payload with manipulated `price: 1` or negative delivery fee; confirm server ignores client math and records true catalog price.
   - **Idempotency & Double-Submit:** Rapidly double-click submit or replay the exact request with the same idempotency key; confirm only one order is created.
   - **Validation Rejections:** Confirm clean `400`/`422` responses (and preserved client cart state) for:
     - Empty cart, quantity $\le 0$, decimal quantity, or quantity $> 10$.
     - Duplicate product IDs in a single payload.
     - Unknown product ID or out-of-stock product.
     - Invalid Pakistani phone number or unsupported province.
     - Oversized payload or malformed JSON.
   - **Confirmation Security:** Attempt to load the confirmation page or API without the token or with a random UUID; confirm `403`/`404` rejection.
3. **Execute Admin Portal & Authorization Verification:**
   - Attempt to visit `/admin` and call `PATCH /api/admin/orders/[id]` unauthenticated $\rightarrow$ confirm `401`/`307` redirect.
   - Authenticate with a Supabase user whose email is **not** in `ADMIN_EMAILS` $\rightarrow$ confirm `403 Forbidden` on both UI and API routes.
   - Authenticate with an allowlisted admin email $\rightarrow$ verify order dashboard list, status filters, search, pagination, and order detail view.
   - Update order status, payment status, courier name, tracking number, and admin notes $\rightarrow$ confirm persistence after reload and rejection of invalid enum values.
   - Ensure destructive status transitions (e.g., `cancelled`) require explicit confirmation in the UI.

#### Phase 3 Acceptance Gate
- [x] Staging URL is live, HTTPS is active, and canonical/OG metadata renders accurately.
- [x] All 16 customer checkout test cases and edge cases pass against live staging Supabase.
- [x] Admin authentication and allowlist authorization are strictly enforced on both pages and API routes.

---

### Phase 4 — Automated Testing Suite (Unit, API & Playwright E2E)

#### Objective
Replace manual regression checking with fast, deterministic automated tests covering money math, validation, API security, and user journeys.

#### Step-by-Step Tasks
1. **Configure Test Runners:**
   - Set up **Vitest** for fast unit and API route integration tests.
   - Set up **Playwright** for critical-path browser E2E tests.
   - Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`.
2. **Write Unit Tests (`src/**/__tests__/*.test.ts`):**
   - **Cart Logic:** Quantity clamping ($1\text{–}10$), item merge, removal, clear, and resilient recovery from corrupted `localStorage` JSON.
   - **Checkout & PK Validators:** Pakistani phone number normalization (`0300...` $\leftrightarrow$ `+92300...`), province enum validation, address length bounds.
   - **Pricing & Totals Engine:** Subtotal calculation, $\text{₨}5,000$ unit price ceiling assertion, delivery fee calculation, order number formatting.
3. **Write API & Authorization Integration Tests:**
   - `POST /api/orders`: Malformed JSON, schema validation errors, out-of-stock rejection, client price-tampering override, idempotent replay, and successful order creation.
   - `PATCH /api/admin/orders/[id]`: Unauthenticated (`401`), authenticated non-admin (`403`), invalid status enum (`400`), and valid admin update (`200`).
4. **Write Playwright E2E Smoke Suite (`e2e/*.spec.ts`):**
   - Storefront browsing (Homepage $\rightarrow$ Category $\rightarrow$ Product Page).
   - Add to cart, reload page, verify persistence, and validate checkout form error messages.
   - Full mocked/staged COD checkout submission $\rightarrow$ order confirmation display.
   - Admin route guard redirect for unauthenticated visitors.

#### Phase 4 Acceptance Gate
- [x] `npm test` runs non-interactively and passes 100% of unit and API integration tests.
- [x] `npm run test:e2e` passes all Playwright specs without requiring production secrets.

---

### Phase 5 — CI/CD Quality Automation (GitHub Actions)

#### Objective
Enforce automated quality gates on every push and pull request so broken builds, type errors, test regressions, or high-severity vulnerabilities can never be merged.

#### Step-by-Step Tasks
1. **Create `.github/workflows/ci.yml`:**
   Configure a GitHub Actions workflow triggered on `push` (to `main`/`master`) and `pull_request` that executes:
   1. `actions/checkout@v4` & `actions/setup-node@v4` (Node LTS with npm cache).
   2. `npm ci`
   3. `npm run lint`
   4. `npx tsc --noEmit`
   5. `npm test` (Vitest unit & API tests)
   6. `npm run build` (using safe dummy/mock public env vars so build succeeds without exposing secrets)
   7. `npm audit --omit=dev --audit-level=high`
2. **Secret Isolation in CI:**
   Ensure `SUPABASE_SERVICE_ROLE_KEY` is never exposed to untrusted fork pull requests.

#### Phase 5 Acceptance Gate
- [x] `.github/workflows/ci.yml` is valid and all steps pass locally when simulated in exact sequence.

---

### Phase 6 — V2 Quantity-Based Inventory & Oversell Protection *(Conditional)*

> **Execution Gate:** Only execute Phase 6 if explicitly instructed to transition from boolean (`in_stock`) availability to unit-quantity inventory tracking before launch. Otherwise, mark as deferred to Post-Launch V2 and proceed to Phase 7.

#### Step-by-Step Tasks
1. **Schema Migration (`004_quantity_inventory.sql` or `005_...`):**
   - Add `stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)` to `public.products`.
   - Keep `in_stock` synchronized via a generated column or trigger (`stock_quantity > 0`).
2. **Atomic Row-Locking Order RPC:**
   - Update the order creation RPC to lock purchased product rows in deterministic `product_id` order (`SELECT ... FROM public.products WHERE id = ... FOR UPDATE`).
   - Verify `stock_quantity >= requested_quantity` for every item.
   - Decrement `stock_quantity` atomically within the same transaction; roll back the entire transaction if any item has insufficient stock.
3. **Cancellation & Return Stock Policy:**
   - Define and test whether transitioning an order to `cancelled` or `returned` automatically restores `stock_quantity` or requires explicit admin restock action.

#### Phase 6 Acceptance Gate
- [ ] Concurrent order requests for a product with `stock_quantity = 1` result in exactly 1 succeeded order and 1 clean out-of-stock rejection.

---

### Phase 7 — Final Production Launch Readiness Review

#### Objective
Perform the final pre-flight verification before switching `5000shop.pk` to live customer traffic.

#### Final Release Checklist
- **Catalog Integrity:**
  - [x] Production Supabase has migrations applied and contains only approved production catalog items (no demo/seed placeholders).
  - [x] Every product price satisfies $\text{₨}1 \le \text{price} \le \text{₨}5,000$, all SKUs are unique, and all product images resolve.
- **Customer Experience:**
  - [x] Mobile viewport responsiveness, cart persistence, COD terms, delivery charges, and WhatsApp support link (`NEXT_PUBLIC_WHATSAPP_NUMBER`) are verified.
- **Security & Abuse Protection:**
  - [x] RLS enabled and verified on all tables; `SUPABASE_SERVICE_ROLE_KEY` restricted to server runtime.
  - [x] Order confirmation tokens required for order lookup; rate-limiting / abuse protection evaluated on `POST /api/orders`.
- **Operations & Recovery:**
  - [x] Automated Supabase backups enabled, rollback procedure documented, and admin allowlist (`ADMIN_EMAILS`) finalized.

---

## 4. Mandatory Session Reporting Format

At the conclusion of **every** coding session or phase, output a structured status report using this exact template:

```markdown
### Session Execution Report — Phase [X]: [Phase Name]
1. **Tracker Status:** [Completed / In Progress / Blocked]
2. **Files Created or Modified:**
   - `path/to/file` — [Concise summary of change]
3. **Behavior Implemented & Verified:**
   - [Bullet points of exact technical changes]
4. **Validation Gate Output:**
   - `npm run lint`: [PASS / FAIL]
   - `npx tsc --noEmit`: [PASS / FAIL]
   - `npm test`: [PASS / FAIL / N/A]
   - `npm run build`: [PASS / FAIL]
   - `npm audit --omit=dev`: [0 critical, 0 high / Details]
5. **Blockers or Environment Limitations:**
   - [None, or exact description of missing credentials/network constraints]
6. **Next Immediate Phase:**
   - [Next phase number and first action item]
```