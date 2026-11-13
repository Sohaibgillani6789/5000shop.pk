# 5000shop.pk — 5 Hazaar Tak ("Everything Under ₨5,000")

> **Production E-Commerce MVP for the Pakistani Market**  
> Curated Fashion, Beauty, Electronics, Home, and Accessories — all strictly priced at or below ₨5,000 with Cash on Delivery (COD) nationwide.

---

## 1. System Overview & Core Business Rules

- **Brand Name**: 5 Hazaar Tak (5000shop.pk)
- **Market & Currency**: Pakistan (PKR / ₨)
- **Price Ceiling Guarantee**: Every product listed and sold MUST have a unit price less than or equal to ₨5,000 (`unit_price <= 5000`).
- **Payment Method**: Cash on Delivery (COD) exclusively for MVP.
- **Fixed Store Categories (5 Canonical Slugs)**:
  1. `fashion` — Mens & Womens Fashion
  2. `beauty` — Apothecary & Personal Care
  3. `electronics` — Everyday Smart Electronics & Tech Accents
  4. `home` — Living Space & Artisan Decor
  5. `accessories` — Timepieces, Bags & Daily Carry

---

## 2. Technology Stack

- **Framework**: [Next.js 16.3.3](https://nextjs.org) (App Router, Turbopack)
- **UI Library**: React 19 (`react@19.2.8`)
- **Language**: TypeScript 5 (Strict Mode, zero `any`)
- **Styling**: Tailwind CSS v4 (CSS-first token configuration in `src/app/globals.css`)
- **Database & Auth**: [Supabase](https://supabase.com) (`@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL with Row Level Security)
- **Motion & Interactions**: Framer Motion 13, Lenis Smooth Scroll, Embla Carousel
- **Icons**: Lucide React & Hugeicons

---

## 3. Architecture & Repository Layout

```
g:/hazaartak/
├── public/
│   └── images/                # Local verified catalog & brand assets
├── src/
│   ├── app/
│   │   ├── category/[slug]/   # Dynamic async category route (5 canonical slugs)
│   │   ├── product/[slug]/    # Dynamic async product detail route
│   │   ├── cart/              # Cart page
│   │   ├── layout.tsx         # Root layout with fonts, JSON-LD, smooth scroll
│   │   ├── page.tsx           # Home page with Hero, Showcase, Featured items
│   │   └── globals.css        # Tailwind v4 CSS variables & design tokens
│   ├── components/
│   │   ├── CategoryShowcase.tsx
│   │   ├── FeaturedProductsSection.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductActions.tsx # Purchase controls (Add to Cart, Buy Now)
│   │   ├── ProductCard.tsx    # Resilient card component with image error fallback
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── middleware.ts      # Safe session synchronization helper
│   │   └── supabase/
│   │       ├── client.ts      # Browser client (supports ANON & PUBLISHABLE keys)
│   │       ├── server.ts      # Server-side client with async cookieStore
│   │       ├── products.ts    # Database query layer with fallback dataset
│   │       └── types.ts       # Canonical Category & Product TypeScript interfaces
│   └── middleware.ts          # Root Next.js middleware with static asset bypass
├── supabase/
│   ├── migrations/            # Idempotent SQL migrations
│   │   └── 001_featured_products_migration.sql
│   ├── seed.sql               # Curated sample seed data mapped to /images/*
│   └── README.md              # Migration execution & verification instructions
├── .env.local.example         # Environment variable template
└── package.json
```

---

## 4. Local Development Setup

### 4.1 Prerequisites
- Node.js 20+ installed
- A free [Supabase](https://supabase.com) project or local Supabase CLI

### 4.2 Clone & Install Dependencies
```bash
git clone https://github.com/Sohaibgillani6789/5000shop.pk.git
cd 5000shop.pk
npm install
```

### 4.3 Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only
ADMIN_EMAILS=admin@5000shop.pk
NEXT_PUBLIC_WHATSAPP_NUMBER=923000000000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> Note: If using the new Supabase publishable key format, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is also supported.

### 4.4 Apply Supabase Database Migrations
1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Copy and run the contents of [`supabase/migrations/001_featured_products_migration.sql`](./supabase/migrations/001_featured_products_migration.sql).
4. Optionally seed sample products by running [`supabase/seed.sql`](./supabase/seed.sql).
5. For verification steps, consult [`supabase/README.md`](./supabase/README.md).

### 4.5 Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Build & Quality Assurance Scripts

```bash
# Run ESLint across all components and pages
npm run lint

# Compile production build with Turbopack and verify TypeScript types
npm run build

# Start production server
npm start
```

---

## 6. Security & Engineering Standards

1. **Async Dynamic APIs in Next.js 16**: Route `params` and `searchParams` are Promises. Always type as `params: Promise<{ slug: string }>` and `await params` before consumption.
2. **Server-Side Pricing Authority**: Never trust client-submitted prices, discounts, or delivery fees. All order subtotals and stock levels are verified server-side.
3. **Atomic Order Placement**: Multi-table insertions (`orders` and `order_items`) execute exclusively through atomic PostgreSQL RPC functions to prevent orphaned records.
4. **Non-Blocking Middleware**: Public shopping routes (`/`, `/category/*`, `/product/*`, `/cart`, `/checkout`, `/order-confirmation/*`) are guaranteed to never be blocked by authentication redirects.

---

## 7. Vercel Deployment & Mobile Testing

### 7.1 Prerequisites & Required Accounts
- **Node.js**: v20 LTS or newer
- **Package Manager**: `npm` (detected via `package-lock.json`)
- **Accounts**:
  - [Vercel](https://vercel.com) account (`sohaibs-projects-71ecb046/hazaartak`)
  - [Supabase](https://supabase.com) project with schema & `create_cod_order` RPC applied (`supabase/COMPLETE_STAGING_MIGRATION_BUNDLE.sql`)

### 7.2 Required Environment Variable Names (No Values)
Configure the following variables in Vercel (`Settings → Environment Variables`) across **Production**, **Preview**, and **Development** (or via `npx vercel env add <NAME>`):

| Variable Name | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Supabase project HTTPS endpoint |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` *(or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)* | Public (Client & Server) | Supabase public client key (enforced by Row-Level Security) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only Secret** | Supabase service-role key for `/api/orders` and `/admin` (`import 'server-only'`) |
| `ADMIN_EMAILS` | **Server-Only Secret** | Comma-separated allowlist of authorized admin emails for `/admin` |
| `NEXT_PUBLIC_SITE_URL` *(Optional)* | Public (Client & Server) | Canonical origin URL (defaults to `https://5000shop.pk` in production) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` *(Optional)* | Public (Client & Server) | International WhatsApp number without `+` (defaults to `923000000000`) |

### 7.3 Pre-Deployment Local Quality Gate
Always run the local baseline checks before deploying:
```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
node scripts/check-bundle-secrets.mjs
```

### 7.4 Creating a Preview Deployment
 Vercel natively detects Next.js (`next build`), so no custom `vercel.json` is needed:
```bash
# Link repository (first time only)
npx vercel link

# Create a Preview deployment
npx vercel deploy
```
> **Note on Preview URLs & Incognito Mobile Testing**: By default, Vercel enables **Vercel Authentication (Deployment Protection)** on branch/preview URLs (`https://hazaartak-<hash>-sohaibs-projects-71ecb046.vercel.app`). To open a Preview URL in an unauthenticated mobile incognito tab without promoting to production, either disable *Vercel Authentication* under **Project Settings → Deployment Protection** in the Vercel Dashboard, or test via the public production alias (`https://hazaartak.vercel.app`).

### 7.5 Promoting a Verified Deployment to Production
```bash
# Promote an existing verified preview deployment ID/URL to production:
npx vercel promote <deployment-url-or-id> --yes

# Or build and deploy directly to production:
npx vercel deploy --prod
```

### 7.6 Real Mobile Phone Testing Checklist
Open the deployed URL on a real phone over cellular or Wi-Fi:
1. Open `https://hazaartak.vercel.app` in a **private/incognito tab**.
2. Verify the first render is usable with **zero horizontal scrolling**.
3. Check narrow (`375px` width) and large (`430px` width) phone viewports in both **portrait** and **landscape** orientations.
4. Tap every primary navigation control (Navbar links, mobile menu drawer, Cart trigger) and category card.
5. Open a product detail page (`/product/chronograph-obsidian-watch`), tap **Add to Cart**, and verify the slide-over Cart Drawer.
6. Proceed to `/checkout` and test the **on-screen keyboard** with text/phone inputs and Cash on Delivery placement.
7. Verify all product images and self-hosted `Inter`/`Outfit` fonts load without `404` errors or layout overflow.
8. Confirm `/admin` redirects unauthenticated visitors to `/admin/login` without exposing private order data.

### 7.7 Verified Deployment Status
- **Production / Mobile-Shareable URL**: [https://hazaartak.vercel.app](https://hazaartak.vercel.app)
- **Preview Deployment URL**: `https://hazaartak-kix6q62ja-sohaibs-projects-71ecb046.vercel.app` *(protected by Vercel Authentication)*
- **Last Verified**: 2026-11-08

