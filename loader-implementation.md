# Shopping Bag Loader Implementation

## 1. Overview
`ShoppingBagLoader` is a lightweight, high-performance, 3D-inspired shopping bag loader engineered for Next.js 16 (App Router) using TypeScript, Framer Motion, and scoped CSS/SVG geometry.

It matches the exact 3D visual reference on a pure `#FFFFFF` canvas with **no text underneath**:
- **Angled 3D Orange Shopping Bag**: Trapezoidal front face (`#FF9E2C` → `#EE6802` → `#DF5200`) with a 3D extruded left side gusset (`#F16E08` → `#BC3B00`), vertical gusset fold crease, top-left specular bevel highlight, and recessed handle sockets.
- **Dual 3D Tubular Handles**: Creamy-ivory front handle (`#FFFFFF` → `#FDF0E0` with warm peach underside shading) and a secondary peach-orange back handle arching behind the top edge.
- **True Depth-Sorted 3D Sweeping Orbit Ribbon**: Split into a background SVG layer (tapering cream-ivory tails behind the bag) and a foreground SVG layer (3D extruded orange ribbon with a translucent cream-white specular highlight passing across the front of the bag).
- **Two Floating 3D Glossy Orange Spheres**: Upper-left and lower-right 3D radial-shaded spheres bobbing gently in counter-phase.
- **Soft Warm Ambient Ground Shadow**: Multi-stop radial gradient shadow underneath that scales and modulates opacity in inverse phase with the bag's vertical float.

---

## 2. Actual Next.js App Loader Integration (Not Just an Overlay)

Instead of acting merely as a decorative overlay, `ShoppingBagLoader` is wired directly into Next.js App Router's native React `<Suspense>` streaming boundaries as well as initial document/font readiness:

1. **[src/app/loading.tsx](file:///g:/hazaartak/src/app/loading.tsx)**: Root Next.js App Router Suspense boundary for top-level server routes (`/`, `/cart`, `/checkout`, `/order-confirmation/[orderNumber]`, etc.).
2. **[src/app/product/[slug]/loading.tsx](file:///g:/hazaartak/src/app/product/%5Bslug%5D/loading.tsx)**: Native route Suspense loader when streaming or navigating to product pages.
3. **[src/app/category/[slug]/loading.tsx](file:///g:/hazaartak/src/app/category/%5Bslug%5D/loading.tsx)**: Native route Suspense loader when streaming or navigating to category pages.
4. **[src/components/WebsiteLoader.tsx](file:///g:/hazaartak/src/components/WebsiteLoader.tsx)**: Coordinates initial document (`window` load) and self-hosted font readiness (`document.fonts.ready`) with a non-blocking cap, eliminating the legacy 60fps `requestAnimationFrame` state loop.

---

## 3. Performance & Accessibility Guarantees

- **Zero React Re-Renders**: Wrapped in `React.memo` with zero `useState` updates during animation.
- **Compositor-Only Animations**: Animates strictly `transform` (`x`, `y`, `rotate`, `scaleX`, `scaleY`) and `opacity` via Framer Motion (`2.4s`, `easeInOut`, `repeat: Infinity`).
- **Zero External Assets or Heavy Filters**: No raster images, WebGL, Three.js, Canvas, or `filter: blur()`.
- **Accessibility**: Includes `role="status"`, `aria-live="polite"`, `aria-busy="true"`, `aria-label`, and full `prefers-reduced-motion` support (`useReducedMotion()` + `@media (prefers-reduced-motion: reduce)`).
