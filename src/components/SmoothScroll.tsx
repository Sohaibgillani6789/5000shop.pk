"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useCallback } from "react";

/**
 * Smooth Scroll Provider
 *
 * Wraps the entire app with Lenis for momentum-based smooth scrolling.
 * - lerp: 0.1 → luxurious, buttery glide without excessive latency
 * - syncTouch: true → mirrors smooth scrolling on mobile touch devices
 * - autoRaf: true → auto requestAnimationFrame loop
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        syncTouch: true,
        autoRaf: true,
      }}
    >
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
      }

      // Call any additional onClick handler (e.g., close mobile menu)
      onClick?.();
    },
    [href, lenis, duration, onClick]
  );

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
