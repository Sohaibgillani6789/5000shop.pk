"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

/**
 * ScrollReset Component
 *
 * Synchronizes Next.js App Router client-side page transitions with Lenis
 * and the native browser DOM.
 *
 * Why this is necessary:
 * In Next.js App Router, the RootLayout persists across page navigations.
 * Because Lenis maintains its own internal virtual scroll state on `requestAnimationFrame`
 * (`targetScroll`, `animatedScroll`), navigating to another route (such as clicking
 * a category card from the Bento Showcase) leaves Lenis holding the previous page's
 * scroll offset (e.g. 1,200px down). Lenis will repeatedly re-apply that offset,
 * causing category and product pages to open scrolled rather than starting at the top.
 *
 * This component:
 * 1. Sets `window.history.scrollRestoration = 'manual'` to eliminate browser fighting.
 * 2. On every `pathname` change, immediately resets Lenis and DOM scroll to (0, 0),
 *    unless an explicit hash anchor exists in the URL.
 * 3. Re-verifies in `requestAnimationFrame` and a 60ms timer to guarantee the scroll
 *    remains firmly at top even after React 19 finishes DOM commit and image layout.
 * 4. Resets scroll when clicking a link that targets the same page without a hash.
 */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Disable native browser scroll restoration interference
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const resetToTop = useCallback(() => {
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [lenis]);

  useEffect(() => {
    // If there is an explicit hash target in the URL (e.g. /#categories), try to honor it
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const targetId = hash.replace("#", "");
      const checkAndScrollToHash = () => {
        const target = document.getElementById(targetId);
        if (target) {
          if (lenis) {
            lenis.scrollTo(target, { immediate: true, offset: -94 });
          } else {
            target.scrollIntoView();
          }
          return true;
        }
        return false;
      };

      if (checkAndScrollToHash()) return;

      const rafId = requestAnimationFrame(() => {
        if (!checkAndScrollToHash()) {
          resetToTop();
        }
      });
      return () => cancelAnimationFrame(rafId);
    }

    // Standard route transition without a hash — force scroll to top
    resetToTop();

    // Secondary execution on next animation frame (post-DOM commit)
    const rafId = requestAnimationFrame(() => {
      resetToTop();
    });

    // Tertiary execution after layout shift / font / image dimensions settle
    const timer = setTimeout(() => {
      resetToTop();
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, lenis, resetToTop]);

  // Handle clicking a link pointing to the exact same page (same pathname, no hash)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore pure intra-page anchor links like href="#categories"
      if (href.startsWith("#")) return;

      // Ignore external links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        try {
          const url = new URL(href);
          if (url.origin !== window.location.origin) return;
        } catch {
          return;
        }
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        if (
          targetUrl.pathname === window.location.pathname &&
          !targetUrl.hash &&
          targetUrl.search === window.location.search
        ) {
          resetToTop();
        }
      } catch {
        // Fallback: ignore malformed URLs
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, [resetToTop]);

  return null;
}

/**
 * Smooth Scroll Provider
 *
 * Wraps the entire app with Lenis for momentum-based smooth scrolling.
 * - lerp: 0.1 → luxurious, buttery glide without excessive latency
 * - syncTouch: false → preserves native compositor-thread touch scrolling on mobile devices
 * - autoRaf: true → auto requestAnimationFrame loop
 * - stopInertiaOnNavigate: true → cancels scroll inertia when navigating between pages
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        syncTouch: false,
        autoRaf: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}

/**
 * AnchorLink Component
 *
 * Replaces standard <a href="#section"> links with smooth Lenis scrollTo.
 * Prevents the jarring jump that Lenis would otherwise cause with native anchors.
 *
 * Custom easing: sharp acceleration → gentle deceleration
 */
interface AnchorLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  duration?: number;
}

// Custom easing: exponential decay — sharp start, gentle end
const customEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function AnchorLink({
  href,
  children,
  className,
  style,
  onClick,
  duration = 1.5,
}: AnchorLinkProps) {
  const lenis = useLenis();
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      // Extract target ID from href (e.g., "#categories" → "categories")
      const targetId = href.replace("#", "");
      const target = document.getElementById(targetId);

      if (target && lenis) {
        lenis.scrollTo(target, {
          duration,
          easing: customEasing,
          offset: -94, // Account for sticky header (announcement bar + navbar) height
        });
      } else if (!target) {
        router.push(`/${href}`);
      }

      // Call any additional onClick handler (e.g., close mobile menu)
      onClick?.();
    },
    [href, lenis, duration, onClick, router]
  );

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
