# 🚨 AI Coding Agent Specification: `quickfix.md`

**Project Stack:** Next.js + Supabase + Tailwind CSS (E-Commerce Store)  
**Role:** Senior Full-Stack Next.js & Performance Engineer  
**Execution Mode:** Surgical Bug Fixing, Targeted UI Redesign, & Zero-Visual-Change Performance Optimization

---

## 🛑 STRICT GUARDRAILS (READ FIRST — DO NOT VIOLATE)

1. **DO NOT modify any unrelated files, components, routes, or database schemas.**
2. **DO NOT change the visual design, layout, colors, typography, or animations of the Home Page or any other page**, EXCEPT for the **5 Category Pages** redesign specified in Task 3.
3. **DO NOT break existing Supabase authentication, RLS policies, or checkout flows.**
4. **Preserve existing store branding:** Match the store's existing font family and primary accent colors where applicable while strictly adhering to the reference design for the 5 Category Pages.

---

## 🛠️ TASK 1: Fix Product Interactive Buttons (`+`, `-`, `Add to Cart`, `Buy Now`)

### Problem
On product cards and/or product detail pages, the quantity increment (`+`), quantity decrement (`-`), `Add to Cart`, and `Buy Now` buttons are unresponsive or failing to update state/navigate.

### Root Cause Diagnosis & Required Fixes
1. **Missing `'use client'` Directive:**
   - Inspect the Product Detail component, Quantity Selector component, and Product Card action components.
   - Ensure any component using `useState`, `useContext`, Zustand, or `onClick` handlers has `'use client'` at the very top of the file.
2. **Event Propagation Inside `<Link>` Tags:**
   - If `+`, `-`, `Add to Cart`, or `Buy Now` buttons are rendered inside a parent `<Link>` (e.g., on a product card), clicking them will trigger navigation or fail silently.
   - Add `e.preventDefault()` and `e.stopPropagation()` to all button `onClick` handlers, or move the interactive buttons outside the `<Link>` wrapper.
3. **Quantity (`+` / `-`) State Logic:**
   - Ensure local or global state initializes properly: `const [quantity, setQuantity] = useState<number>(1)`.
   - **Decrement (`-`):** `setQuantity((prev) => Math.max(1, prev - 1))` (disable button when `quantity <= 1`).
   - **Increment (`+`):** `setQuantity((prev) => (maxStock ? Math.min(maxStock, prev + 1) : prev + 1))` (respect Supabase product `stock` / `inventory` count if available).
   - Ensure `type="button"` is explicitly set on both `+` and `-` `<button>` elements so they do not accidentally submit a parent `<form>`.
4. **`Add to Cart` Button Logic:**
   - Wire the `onClick` handler to the store's Cart Context / Zustand store / Supabase cart mutation.
   - Pass the complete product payload along with the current `quantity` state (not a hardcoded `1`).
   - Provide visual feedback (e.g., existing toast notification or loading state) and ensure cart badge count in the Navbar updates immediately in real time.
5. **`Buy Now` Button Logic:**
   - Wire `onClick` to add the selected product and `quantity` to the cart (or direct checkout state), wait for state update/persistence, and immediately redirect using `useRouter()` from `next/navigation`:
     ```tsx
     const handleBuyNow = async (e: React.MouseEvent) => {
       e.preventDefault();
       e.stopPropagation();
       await addToCart(product, quantity);
       router.push('/checkout'); // Use the existing checkout route in the project
     };
     ```

---

## 🧭 TASK 2: Fix Navbar Glitch on the 5 Categories Section / Pages

### Problem
The Navbar works and renders properly on the Home Page (`/`), but exhibits visual/layout glitches on the 5 Categories section/pages.

### Root Cause Diagnosis & Required Fixes
1. **Compare Layout Wrappers:**
   - Inspect how the Navbar is mounted on the Home Page (`app/page.tsx` or `app/layout.tsx`) versus the 5 Category routes.
   - Ensure the Navbar is not being mounted twice on category pages or missing required context providers (e.g., CartProvider, AuthProvider).
2. **Fix Stacking Context & Positioning (`z-index` / `sticky` / `fixed`):**
   - Check if the Category pages or category section wrappers have CSS properties like `overflow-x: hidden`, `transform`, or `filter` on a parent container that breaks `position: fixed` or `position: sticky` on the Navbar.
   - Ensure the Navbar has a consistent high stacking index (e.g., `z-50`), explicit background (`bg-white/95` or store theme background), and that category page main containers have matching top padding (`pt-[navbar-height]`) so content does not overlap or jump underneath the Navbar.
3. **Fix Active Route / Dropdown State Reset:**
   - If the Navbar has a category dropdown, mobile drawer, or active indicator that stays stuck or glitches when switching between the 5 categories, add a `useEffect` listening to `usePathname()` to cleanly close open menus/drawers upon route change.

---

## 🎨 TASK 3: Redesign the 5 Category Pages (Expert Clean Grid — Reference Match)

### Objective
Redesign the 5 Category Pages so they are clean, fast, modern, and match the exact layout and card structure of the reference design while staying consistent with the store's color palette.

### Exact UI / UX Specification (Match Reference Image)

#### 1. Page Container & Section Header
- **Background:** Clean solid light/white background (`bg-white`).
- **Container:** Centered max-width container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10`).
- **Header Divider & Title:**
  - A full-width horizontal flex container (`flex items-center justify-center gap-6 mb-8`).
  - Left and right horizontal accent lines (`flex-1 h-[1.5px] bg-orange-400/80` or the store's primary accent color).
  - Centered Category Title in bold uppercase tracking (`text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-neutral-900 whitespace-nowrap`).

#### 2. Responsive 4-Column Product Grid
- Use a clean responsive CSS Grid:
  ```tsx
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
  ```

#### 3. Product Card Component Structure
Each card inside the 5 Category pages must follow this minimal, high-conversion structure:
- **Card Wrapper:**
  - `group relative flex flex-col justify-between bg-white border border-neutral-200/90 rounded-xl p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-md`
- **Top-Left Badge:**
  - Positioned at the top-left of the card (`self-start` or `absolute top-3.5 left-3.5 z-10`).
  - Solid black pill/badge (`bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded`).
  - Display `"DEAL"` (if discounted) or the category/featured tag from Supabase.
- **Product Image Container:**
  - Centered container (`relative w-full aspect-[4/3] my-4 flex items-center justify-center overflow-hidden bg-white`).
  - Use Next.js `<Image />` with `className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"` and proper `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"`.
- **Product Meta & Typography (Bottom Section):**
  - **Brand / Category Label (Optional/If available in DB):** Small uppercase muted text (`text-[11px] font-medium uppercase tracking-wide text-neutral-400 mb-1`).
  - **Product Title:** Bold, clean 2-line clamped title (`text-sm sm:text-[15px] font-bold text-neutral-900 leading-snug line-clamp-2 min-h-[2.5rem] mb-2.5`).
  - **Pricing & Discount Row:**
    - Flex row (`flex items-center flex-wrap gap-2 mt-auto`).
    - **Current / Sale Price:** Bold accent text (`text-base font-extrabold text-orange-500` or store primary accent).
    - **Original / Compare-at Price:** Muted strikethrough text (`text-xs font-medium text-neutral-400 line-through`), rendered if original price > sale price.
    - **Discount Percentage Badge:** Soft tinted pill (`bg-orange-50 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded`), automatically calculated as `Math.round(((originalPrice - price) / originalPrice) * 100)% OFF` when a discount exists.
- **Card Interactivity:**
  - Ensure clicking the card navigates smoothly to the product detail page, and if quick-action buttons (`Add to Cart` / `Buy Now`) are included on hover or bottom, they use the fixed handlers from **Task 1**.

---

## ⚡ TASK 4: Eliminate Home Page Scroll Lag & Optimize App Performance (ZERO Visual Changes)

### Problem
The Home Page lags and drops frames when scrolling after the website loads.

### Strict Constraint
**DO NOT alter the visual appearance, layout, colors, or design of the Home Page.** All optimizations must be under-the-hood engineering improvements.

### Required Performance Optimizations
1. **Audit & Fix Scroll Event Listeners:**
   - Search the Home Page and Navbar for `window.addEventListener('scroll', ...)` or Framer Motion `useScroll` hooks that trigger React state updates (`setState`) on every scroll tick.
   - Replace state-heavy scroll listeners with passive listeners (`{ passive: true }`), `requestAnimationFrame` throttling, or pure CSS (`sticky`, IntersectionObserver) so the Home Page does not re-render the component tree while scrolling.
2. **Optimize Heavy CSS Repaints During Scroll:**
   - Inspect fixed/sticky overlays, background blobs, or cards using heavy `backdrop-blur-*`, huge `blur-[100px]` filters, or complex `box-shadow` animations on scroll.
   - Add hardware acceleration hints (`transform-gpu`, `will-change-transform`) to animated/sticky elements so the browser composites layers on the GPU instead of repainting on the CPU during scroll.
3. **Next.js `<Image />` & Media Optimization:**
   - Convert any raw `<img>` tags on the Home Page to `next/image` (keeping exact CSS classes so visuals don't change).
   - Ensure **only** above-the-fold hero images have `priority` (or `loading="eager"`).
   - Ensure all below-the-fold product/category images use lazy loading (`loading="lazy"`) and have accurate `sizes` attributes so the browser doesn't decode massive 4K textures during scroll.
4. **Supabase Data Fetching & Component Rendering:**
   - Ensure Home Page Supabase queries run in parallel using `Promise.all([...])` rather than sequential waterfalls.
   - Memoize expensive product list maps or filter calculations using `useMemo` and `React.memo` where client components exist.
   - Use `next/dynamic` (with existing skeleton/loading fallback) for heavy below-the-fold client widgets if they block the main thread on initial load.

---

## ✅ FINAL VERIFICATION CHECKLIST FOR AI AGENT

Before completing your run, verify every item below:
- [ ] **Quantity Buttons (`+` / `-`):** Clicking `+` and `-` updates the quantity counter immediately without refreshing the page or triggering parent `<Link>` navigation.
- [ ] **Add to Cart:** Clicking `Add to Cart` adds the item with the selected quantity to the cart and updates the Navbar cart counter.
- [ ] **Buy Now:** Clicking `Buy Now` adds the item with the selected quantity and immediately redirects to the checkout page.
- [ ] **Navbar Stability:** Navigating across the Home Page and all 5 Category pages shows zero layout shift, overlap, or menu glitching in the Navbar.
- [ ] **5 Category Pages UI:** All 5 category pages use the clean 4-column bordered card layout, centered header with horizontal accent lines, top-left badge, contained product image, bold title, and formatted price/discount row matching the reference image.
- [ ] **Smooth 60fps Scrolling:** Scrolling down and up the Home Page immediately after load is buttery smooth with zero frame drops.
- [ ] **Zero Unintended Changes:** No other pages, styles, or features outside these instructions were altered.