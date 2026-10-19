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
