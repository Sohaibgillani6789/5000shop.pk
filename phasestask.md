Project: 5000shop.pk ("5 Hazaar Tak") — Production Ecommerce MVP Implementation Plan
1. System Role & Repository Context
The AI Coding Agent is operating inside the existing GitHub repository:
Sohaibgillani6789/5000shop.pk

Brand Name: 5 Hazaar Tak (5000shop.pk)

Market & Currency: Pakistan (PKR / ₨)

Core Business Rule: Every product sold on the store MUST have a unit price less than or equal to ₨5,000 (unit_price <= 5000).

Launch Payment Method: Cash on Delivery (cod) ONLY. Online payment gateways (JazzCash, Easypaisa, Card) must NOT be shown as active options in the MVP.

Store Categories (5 Fixed Slugs):

fashion (Fashion)

beauty (Beauty)

electronics (Electronics)

home (Home)

accessories (Accessories)

Active Tech Stack (Source of Truth)
Framework: Next.js 16.3.3 (App Router)

UI Library: React 19

Language: TypeScript (Strict Mode — zero any allowed)

Styling: Tailwind CSS v4 (CSS-first configuration in src/app/globals.css — do NOT create or rely on legacy Tailwind v3 config files unless already present)

Database & Auth: Supabase (@supabase/supabase-js, @supabase/ssr)

Animation & UI Primitives: Framer Motion, Embla Carousel, Lucide Icons

Existing Repository Files to Inspect First
src/app/page.tsx

src/app/category/[slug]/page.tsx

src/app/product/[slug]/page.tsx

src/components/ProductActions.tsx

src/components/ProductCard.tsx

src/components/FeaturedProductsSection.tsx

src/lib/supabase/products.ts

src/lib/supabase/types.ts

src/lib/supabase/server.ts

src/lib/supabase/client.ts

supabase/migrations/001_featured_products_migration.sql

supabase/seed.sql

.env.local.example

package.json

CRITICAL REPOSITORY WARNING:
project_report.md contains outdated references to Sanity CMS and non-existent files. Do NOT migrate to Sanity. The active implementation uses Supabase. Always treat the actual codebase on disk as the sole source of truth.

2. Non-Negotiable Engineering & Security Rules
Inspect Before Modifying: Read all relevant files in src/ and supabase/ before writing code.

Next.js 16 Async Dynamic APIs: In Next.js 16 App Router, params, searchParams, cookies(), and headers() are asynchronous Promises. Always type params: Promise<{ slug: string }> (or orderNumber, id) and await params before accessing properties.

React 19 Hydration Integrity: Never read window.localStorage synchronously during initial component render. Gate cart persistence hydration inside useEffect with an isHydrated state flag to prevent React 19 hydration mismatch errors.

Zero Client Trust for Pricing: Never accept price, subtotal, deliveryFee, discount, or total from the browser payload during order creation. The server MUST re-fetch product records from Supabase, verify in_stock status, verify price <= 5000, and compute all financial totals server-side.

Atomic Database Writes via RPC: PostgREST .from().insert() only executes against a single table per HTTP request. Never insert into orders and order_items via sequential .insert() calls in Node.js, as a failure on the second call creates orphaned orders. Always use the PostgreSQL PL/pgSQL RPC function create_order_with_items so both tables commit or roll back inside a single atomic transaction.

Secret Isolation: Never prefix the Supabase service-role key with NEXT_PUBLIC_. Only reference SUPABASE_SERVICE_ROLE_KEY inside server-only modules (import 'server-only' or Route Handlers/Server Actions).

Strict TypeScript: Do not use any or @ts-ignore. Define explicit interfaces in src/lib/ and keep src/lib/supabase/types.ts synchronized with database schemas.

Design & Accessibility Preservation: Preserve the existing visual aesthetic, color tokens, reduced-motion support (prefers-reduced-motion), keyboard navigation (Escape to close drawers, focus rings), and ARIA labels.

Minimal Dependencies: Check package.json first. Only add zod if it is not already installed. Do not install heavy UI libraries or state managers.

Phase Gate Verification: Run npm run lint and npm run build at the end of every phase. Fix all compiler, type, and lint errors before reporting completion.

3. Phased Execution Blueprint
EXECUTION GATE 1: Phase 1 & Phase 2 (Day 1 — Foundation & Cart)
Instruction to Agent: Execute ONLY Phase 1 and Phase 2 first, run npm run lint and npm run build, and output the Phase Deliverable Report before proceeding to Phase 3.

Phase 1 — Repository Audit & Catalog Cleanup
Route & Component Audit:

Inspect src/app/page.tsx, src/app/category/[slug]/page.tsx, src/app/product/[slug]/page.tsx, Navbar, ProductCard.tsx, and ProductActions.tsx.

Verify that all 5 category routes (fashion, beauty, electronics, home, accessories) and featured products render properly.

Static Asset Verification:

Check all image references in supabase/seed.sql and product components against files present in public/images/. Fix broken paths or provide a clean fallback image handler.

Middleware Verification:

Check whether src/lib/middleware.ts or src/middleware.ts exists and how it is wired.

Ensure public routes (/, /category/*, /product/*, /cart, /checkout, /order-confirmation/*) are NEVER blocked by authentication redirects.

Documentation & Environment Sync:

Update README.md to accurately document the Next.js 16 + Supabase architecture, local setup instructions, and migration steps.

Prepend a clear deprecation banner at the top of project_report.md noting that Sanity references are obsolete and Supabase is the active backend.

Update .env.local.example to include:env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only
ADMIN_EMAILS=admin@5000shop.pk
NEXT_PUBLIC_WHATSAPP_NUMBER=923000000000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

Verification: Run npm run lint and npm run build.

Phase 2 — Client-Side Cart with Hydration-Safe LocalStorage Persistence
Files to Create:

src/lib/cart/cart-types.ts

src/lib/cart/cart-utils.ts

src/components/cart/CartProvider.tsx

src/components/cart/CartDrawer.tsx

src/components/cart/CartItem.tsx

src/components/cart/CartSummary.tsx

src/app/cart/page.tsx

Data Model (src/lib/cart/cart-types.ts):

TypeScript
export interface CartItemType {
  productId: string;
  slug: string;
  title: string;
  price: number; // Display estimate only; server re-verifies on checkout
  imageUrl: string | null;
  quantity: number; // Integer between 1 and 10
}

export interface CartContextValue {
  items: CartItemType[];
  isHydrated: boolean;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItemType, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
Cart Rules & Logic (src/lib/cart/cart-utils.ts & CartProvider.tsx):

Storage key: 5000shop_cart_v1.

Enforce a hard maximum quantity of 10 per line item and minimum of 1 (decreasing below 1 removes the item).

Validate parsed JSON from localStorage defensively so corrupted browser storage never crashes the app. Never store secrets in localStorage.

Wrap the application layout in CartProvider and mount CartDrawer.

Component Integration:

Update Navbar to display a live cart badge (itemCount after isHydrated === true) that opens CartDrawer or navigates to /cart.

Refactor src/components/ProductActions.tsx and its parent callers (src/app/product/[slug]/page.tsx and src/components/ProductCard.tsx if applicable) to pass full product identity (productId, slug, title, price, imageUrl, inStock).

Wire Add to Cart to add the item and trigger visual confirmation / open CartDrawer.

Wire Buy Now to add the item and immediately navigate to /checkout (or /cart prior to Phase 5 completion).

Remove all "Coming Soon" placeholder messages from active cart buttons.

EXECUTION GATE 2: Phase 3 & Phase 4 (Day 2 — Database & Server Order Engine)
Phase 3 — Supabase Database Migration & Atomic Order RPC
Create supabase/migrations/002_orders_and_atomic_rpc.sql containing:

Table public.orders:

id UUID PRIMARY KEY DEFAULT gen_random_uuid()

order_number TEXT UNIQUE NOT NULL

confirmation_token UUID NOT NULL DEFAULT gen_random_uuid() (Used for secure, non-enumerable order confirmation lookups)

idempotency_key TEXT UNIQUE (Prevents accidental double-submit duplicate orders)

customer_name TEXT NOT NULL CHECK (char_length(trim(customer_name)) >= 2)

phone TEXT NOT NULL

email TEXT NULL

province TEXT NOT NULL

city TEXT NOT NULL

area TEXT NOT NULL

address TEXT NOT NULL CHECK (char_length(trim(address)) >= 5)

landmark TEXT NULL

postal_code TEXT NULL

delivery_notes TEXT NULL

subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)

delivery_fee NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0)

discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0)

total NUMERIC(10,2) NOT NULL CHECK (total >= 0)

payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod'))

payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))

order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'))

courier_name TEXT NULL

tracking_number TEXT NULL

admin_notes TEXT NULL

created_at TIMESTAMPTZ NOT NULL DEFAULT now()

updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

Table public.order_items:

id UUID PRIMARY KEY DEFAULT gen_random_uuid()

order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE

product_id UUID NULL REFERENCES public.products(id) ON DELETE SET NULL

product_title TEXT NOT NULL

product_slug TEXT NOT NULL

unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0 AND unit_price <= 5000)

quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 10)

line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)

image_url TEXT NULL

created_at TIMESTAMPTZ NOT NULL DEFAULT now()

Indexes & Triggers:

Create indexes on orders(order_number), orders(phone), orders(order_status), orders(created_at DESC), and order_items(order_id).

Add an updated_at trigger on public.orders.

Row Level Security (RLS):

Enable RLS on both public.orders and public.order_items (ALTER TABLE ... ENABLE ROW LEVEL SECURITY;).

Do NOT create any SELECT, UPDATE, or DELETE policies for anon. Anonymous users must never be able to list or mutate orders directly.

Create an atomic PL/pgSQL RPC function public.create_order_with_items(p_order JSONB, p_items JSONB) with SECURITY DEFINER SET search_path = public that:

Checks if an order with p_order->>'idempotency_key' already exists; if so, returns the existing id, order_number, and confirmation_token.

Inserts the parent row into public.orders.

Loops through p_items JSONB array and inserts each row into public.order_items.

Returns JSONB containing { id, order_number, confirmation_token, total, created_at }.

Create a second read-only RPC function public.get_order_confirmation(p_order_number TEXT, p_token UUID) with SECURITY DEFINER SET search_path = public that returns ONLY non-sensitive confirmation fields (order_number, customer_name, city, province, subtotal, delivery_fee, discount, total, payment_method, order_status, created_at, and item summaries) when BOTH order_number = p_order_number AND confirmation_token = p_token match.

Lock down function execution permissions carefully (REVOKE ALL ... FROM PUBLIC; GRANT EXECUTE ...).

Phase 4 — Server-Side Pricing, Pakistani Validation & Order Creation API
Files to Create:

src/lib/checkout/pricing.ts

src/lib/checkout/validation.ts

src/lib/orders/order-types.ts

src/lib/orders/create-order.ts

src/app/api/orders/route.ts

Centralized Pricing Configuration (src/lib/checkout/pricing.ts):

Define MAX_PRODUCT_PRICE_PKR = 5000, MAX_ITEM_QUANTITY = 10, and STANDARD_DELIVERY_FEE_PKR = 250 (or configurable flat rate in one constant).

Provide pure server functions to compute lineTotal = unitPrice * quantity, subtotal, deliveryFee, discount, and total = subtotal + deliveryFee - discount.

Pakistani Checkout Validation (src/lib/checkout/validation.ts):

Use zod to validate all checkout fields on the server:

customerName: trimmed string, 2–100 chars.

phone: transform input by stripping spaces, dashes, and parentheses; convert leading +92, 0092, or 92 to 0; validate against ^03([0-4][0-9]|55|64)[0-9]{7}$ (validates Pakistani mobile numbers across Jazz, Zong, Ufone, Telenor, and SCOM while rejecting PTCL landlines).

email: optional valid email or empty string transformed to null.

province: enum of ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Azad Jammu & Kashmir', 'Gilgit-Baltistan'].

city, area, address: required trimmed strings; landmark, postalCode, deliveryNotes: optional trimmed strings.

paymentMethod: literal 'cod'.

idempotencyKey: required UUID/string from client checkout session.

items: non-empty array of { productId: string, slug: string, quantity: number (int 1..10) }.

Authoritative Order Creation (src/lib/orders/create-order.ts & src/app/api/orders/route.ts):

Re-fetch all requested products from Supabase products table by ID/slug.

Reject request (400 Bad Request) if any product is missing, if in_stock === false, or if the database price > 5000 or price <= 0.

Generate a human-readable unique order_number (e.g., 5HT-YYMMDD-XXXX using cryptographic random alphanumeric characters).

Invoke supabase.rpc('create_order_with_items', ...) using a server-only Supabase client.

Return HTTP 201 Created with { orderId, orderNumber, confirmationToken, total }.

EXECUTION GATE 3: Phase 5 & Phase 6 (Day 3 — COD Checkout & Confirmation)
Phase 5 — Mobile-First Pakistani COD Checkout Page
Files to Create:

src/app/checkout/page.tsx

src/components/checkout/CheckoutForm.tsx

src/components/checkout/CustomerAddressForm.tsx

src/components/checkout/PaymentMethodSelector.tsx

UX & Functional Requirements:

Generate a unique idempotencyKey (crypto.randomUUID()) per checkout mount/cart state so accidental double-taps on mobile connections cannot create duplicate orders.

Render CustomerAddressForm with accessible <label> elements, proper autocomplete attributes, inputMode="tel" for the Pakistani phone field (with helper text e.g., 0300-1234567), and a Province <select> dropdown.

Render PaymentMethodSelector showing Cash on Delivery (Pay in cash when your parcel arrives) as the active selected option with a clear explanation of COD verification. Do NOT render active radio buttons for JazzCash, Easypaisa, or Cards.

Render an authoritative order summary sidebar showing line items, quantities, subtotal, delivery fee (imported from src/lib/checkout/pricing.ts), and total in ₨.

Disable the submit button with a loading indicator while the POST request to /api/orders is in flight.

Display field-level validation errors and top-level API errors clearly with role="alert".

Crucial: Call clearCart() ONLY after /api/orders returns a 201 success response, then immediately redirect via router.push(\/order-confirmation/${orderNumber}?token=${confirmationToken}`)`.

Phase 6 — Secure Order Confirmation Page
File to Create:

src/app/order-confirmation/[orderNumber]/page.tsx

Security & UX Requirements:

Await both params (orderNumber) and searchParams (token) using Next.js 16 async page props.

Query supabase.rpc('get_order_confirmation', { p_order_number: orderNumber, p_token: token }) on the server.

If the token is missing or invalid, render a safe generic message ("Order received. Please check your SMS/WhatsApp or contact support with your order number") without leaking any PII.

When valid, display:

Order Number badge (orderNumber)

Customer Name & Delivery City/Province (do NOT display full street address or unmasked phone number on the URL-accessible page)

Itemized summary & Total Amount (₨)

Payment Method (Cash on Delivery)

Estimated processing message

Pre-filled WhatsApp Support Action button linking to https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('Assalam-o-Alaikum! I just placed order ' + orderNumber + ' on 5 Hazaar Tak.')}

Navigation buttons back to Homepage (/) and Categories.

EXECUTION GATE 4: Phase 7 (Day 4 — Protected Admin Operations)
Phase 7 — Admin Authentication & Order Management Portal
Files to Create:

src/lib/supabase/admin.ts (Server-only client & admin auth verifier)

src/app/admin/login/page.tsx (Admin login screen via Supabase Auth)

src/app/admin/layout.tsx

src/app/admin/page.tsx

src/app/admin/orders/page.tsx

src/app/admin/orders/[id]/page.tsx

src/app/api/admin/orders/[id]/route.ts (or Server Action for updating order status, courier, tracking number, and admin notes)

Authentication & Authorization Architecture:

Use @supabase/ssr server client in src/app/admin/layout.tsx to call supabase.auth.getUser().

Verify that user.email is present in the comma-separated process.env.ADMIN_EMAILS allowlist (or user.app_metadata?.role === 'admin').

If unauthenticated or unauthorized, redirect to /admin/login. Never hardcode passwords in source code.

Admin Capabilities:

/admin/orders: Server-rendered table sorted by created_at DESC, filterable by order_status (pending, confirmed, processing, shipped, delivered, cancelled, returned) and searchable by order_number or phone.

/admin/orders/[id]: Full order inspection showing customer contact details (with click-to-WhatsApp and click-to-call links for COD verification), full delivery address + landmark, itemized line totals, and a mutation form to update order_status, payment_status, courier_name (e.g., TCS, Leopards, PostEx, Trax, CallCourier), tracking_number, and admin_notes.

EXECUTION GATE 5: Phase 8 & Phase 9 (Day 5 — Catalog, SEO & Production Polish)
Phase 8 — Catalog Integrity & Truthful Merchandising
Add or standardize SKU identifiers and document stock handling (in_stock boolean vs. quantity) in supabase/migrations/ or seed data.

Audit all product descriptions, category mappings, and image paths so no broken or misleading placeholders remain.

Add clear Shipping & COD Policy and Return Policy pages/links in the Footer and Product pages.

Compliance Rule: Remove any unverified marketing claims (such as "100% quality audited", "150+ cities", "24–48h dispatch", or "7-day return guarantee") unless explicitly configured by the business owner.

Phase 9 — SEO, Structured Data & Resilience
Create src/app/sitemap.ts and src/app/robots.ts (disallow /admin, /api, /checkout, /order-confirmation).

Add canonical URLs, OpenGraph metadata, and JSON-LD structured data (Organization on root/home and Product with priceCurrency: "PKR" and availability on /product/[slug]).

Add src/app/not-found.tsx, src/app/error.tsx, and skeleton loading states optimized for low-bandwidth mobile networks in Pakistan.

4. Mandatory Verification & Deliverable Reporting Protocol
At the completion of each Execution Gate, run:

Bash
npm run lint
npm run build
Then provide a structured Phase Deliverable Report containing:

Files Added: Exact paths of all newly created files.

Files Modified: Exact paths and summary of changes.

Database Migration Details: Tables, constraints, indexes, RLS policies, and RPC functions created.

User-Visible Behavior: Step-by-step walkthrough of what now works in the browser.

Security & Data Integrity Verification: Confirmation that prices are calculated server-side, RLS blocks anonymous reads/updates, and no service-role keys exist in client bundles.

Build & Test Output: Exact terminal output of npm run lint and npm run build plus manual test checklist verification.

Remaining Risks & Next Execution Gate: Any environment variables the human operator must populate before starting the next phase.

BEGIN NOW WITH EXECUTION GATE 1 (PHASE 1 AND PHASE 2 ONLY). DO NOT IMPLEMENT PHASE 3 YET.

## Risk Mitigation and Pre-Launch Operational Recommendations

Transitioning from autonomous code generation to a live Pakistani ecommerce storefront requires strict adherence to three operational safeguards across the five-day sprint cycle. First, prior to exposing the application to production traffic, database administrators must verify Row Level Security enforcement by executing `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';` in the Supabase SQL Editor to confirm that `rowsecurity = true` holds across `products`, `orders`, and `order_items`. Because `auth.uid()` evaluates to `NULL` when requests authenticate with `SUPABASE_SERVICE_ROLE_KEY`, all administrative mutations in Phase 7 must validate the operator's session and email allowlist via the `@supabase/ssr` cookie client before invoking any privileged database query or RPC function.

Second, operational workflows in Pakistan must account for the high Return-to-Origin (RTO) risk inherent to Cash on Delivery transactions, which frequently stem from unverified phone numbers or incomplete neighborhood addresses. The enhanced specification addresses this mechanism directly by embedding pre-filled WhatsApp confirmation actions into both the shopper's Order Confirmation screen in Phase 6 and the Admin Order Detail view in Phase 7, enabling dispatch staff to verify orders over WhatsApp on the normalized `03XXXXXXXXX` mobile number before transitioning an order from `pending` to `confirmed`. Finally, maintaining strict discipline at each of the five execution gates—requiring clean `npm run lint` and `npm run build` outputs before advancing—prevents compounding TypeScript or schema regressions and ensures the functional MVP launches on schedule within four days.