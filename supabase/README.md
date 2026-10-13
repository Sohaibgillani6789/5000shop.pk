# Supabase Database Migration & Verification Guide

This guide details how to execute and verify the database migration for **5 Hazaar Tak** (`5000shop.pk`).

---

## 1. How to Run the Migration in Supabase SQL Editor

1. Open your browser and navigate to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (`5000shop.pk`).
3. In the left navigation sidebar, click on **SQL Editor** (icon `>_`).
4. Click **New query** (or the `+` button in the upper-left of the editor).
5. Open [`supabase/migrations/001_featured_products_migration.sql`](./migrations/001_featured_products_migration.sql) in this repository and copy its entire contents.
6. Paste the SQL into the Supabase SQL Editor.
7. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`).
8. Verify that the query output indicates success: `Success. No rows returned` (or notifications regarding migrated rows).

> **Idempotency Note**: This migration script is safe to execute multiple times. It employs `IF NOT EXISTS` clauses, conditional PL/pgSQL metadata blocks, and `ON CONFLICT DO UPDATE/NOTHING` strategies to prevent duplicate errors or data corruption.

---

## 2. How to Verify the Database Setup

Run the following verification queries in the Supabase SQL Editor:

### A. Verify the `categories` Table
```sql
-- Check table structure and seeded core categories
SELECT id, name, slug, display_order, is_active
FROM public.categories
ORDER BY display_order ASC;
```
*Expected Result*: You should see the 5 core marketplace categories:
- `Mens & Womens Fashion` (`fashion`, order 1)
- `Apothecary` (`beauty`, order 2)
- `Tech Accents` (`electronics`, order 3)
- `Living Space` (`home`, order 4)
- `Accessories` (`accessories`, order 5)

### B. Verify the `products` Table & Migrated Data
```sql
-- Check that new columns exist, category_id is linked, and featured flag is set
SELECT
  p.id,
  p.title,
  p.slug,
  p.price,
  p.compare_at_price,
  c.name AS category_name,
  p.featured,
  p.in_stock,
  p.display_order,
  p.tags
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY p.display_order ASC;
```

### C. Verify Featured Products Query (Matching Homepage Fetch)
```sql
-- This replicates getFeaturedProducts() from src/lib/supabase/products.ts
SELECT
  id,
  title,
  slug,
  price,
  compare_at_price,
  category_id,
  image_url,
  description,
  featured,
  in_stock,
  display_order,
  tags
FROM public.products
WHERE featured = TRUE
  AND in_stock = TRUE
ORDER BY display_order ASC;
```

### D. Verify Row Level Security (RLS) & Policies
```sql
-- Verify RLS status on both tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products');

-- Verify public SELECT policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products');
```
*Expected Result*:
- Both tables have `rowsecurity = true`.
- `categories` has policy `"Allow public read active categories"` for `SELECT`.
- `products` has policy `"Allow public read in-stock products"` for `SELECT`.
- No public `INSERT`, `UPDATE`, or `DELETE` policies exist.

---

## 3. Required Environment Variables

The application requires only two standard public Supabase environment variables defined in `.env.local`:

```env
# Supabase Project URL (found in Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co

# Supabase Public / Anon API Key (found in Settings -> API)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-or-anon-key>
```

> **Security Guarantee**:
> - **No service-role key is used or needed**: The application relies strictly on the public publishable/anon key. Row Level Security (RLS) enforces that only active categories and in-stock products are queryable by anonymous/public visitors.
> - Administrative mutations (insertions/updates) must be performed either through the Supabase Dashboard or authenticated admin actions.

---

## 4. Rollback Safety & Column Retention Rationale

In accordance with zero-downtime database migration practices:
- **No old columns are dropped**: Legacy columns such as `category` (text), `is_featured` (boolean), `badge` (text), `subtitle`, `rating`, and `review_count` are intentionally retained in `public.products`.
- **Zero data loss**: Existing `image_url` paths and pricing details remain untouched.
- **Rollback safety**: Should a deployment rollback ever be required, older versions of the application code reading legacy fields can continue to operate without encountering missing column errors.
