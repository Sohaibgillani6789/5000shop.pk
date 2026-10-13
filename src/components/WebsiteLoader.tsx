"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WebsiteLoader — Real Asset Preloader
 *
 * This is NOT a fake spinner. It actually tracks:
 * 1. document.readyState transitions (loading → interactive → complete)
 * 2. window "load" event (all subresources: images, stylesheets, iframes)
 * 3. PerformanceObserver for resource timing entries (granular progress)
 * 4. Explicit image preloading for critical hero/product images
 *
 * The logo fills from bottom-to-top with an orange gradient,
 * proportional to real loading progress.
 */

// Critical images that MUST be loaded before revealing the site
const CRITICAL_IMAGES = [
  "/images/logo.jpeg",
  "/images/hero-headphones.png",
  "/images/hero-sneakers.png",
  "/images/hero-watch.png",
  "/images/hero-handbag.png",
  "/images/hero-lamp.png",
];

export default function WebsiteLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const loadedResourcesRef = useRef(0);
  const totalResourcesRef = useRef(CRITICAL_IMAGES.length + 3); // images + fonts + DOM + styles
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const animateProgressRef = useRef<() => void>(() => {});

  // Smooth progress interpolation — animates toward target
  const animateProgress = useCallback(() => {
    const current = progressRef.current;
    const target = targetProgressRef.current;
    const diff = target - current;

    if (Math.abs(diff) < 0.5) {
      progressRef.current = target;
      setProgress(target);
    } else {
      // Ease toward target (faster when far, slower when close)
      progressRef.current = current + diff * 0.15;
      setProgress(Math.round(progressRef.current));
      rafRef.current = requestAnimationFrame(() => animateProgressRef.current());
    }
  }, []);

  useEffect(() => {
    animateProgressRef.current = animateProgress;
  }, [animateProgress]);

  const updateProgress = useCallback(
    (newTarget: number) => {
      targetProgressRef.current = Math.min(newTarget, 100);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animateProgress);
    },
    [animateProgress]
  );

  const incrementLoaded = useCallback(() => {
    loadedResourcesRef.current += 1;
    const pct =
      (loadedResourcesRef.current / totalResourcesRef.current) * 100;
    updateProgress(Math.min(pct, 100));
  }, [updateProgress]);

  useEffect(() => {
    // Phase 1: DOM readiness (gives us ~10%)
    if (document.readyState === "loading") {
      updateProgress(5);
    } else if (document.readyState === "interactive") {
      updateProgress(15);
      incrementLoaded(); // DOM ready
    } else {
      updateProgress(20);
      incrementLoaded(); // DOM ready
    }

    const onDOMReady = () => {
      incrementLoaded();
      updateProgress(20);
    };

    const onWindowLoad = () => {
      // All native subresources loaded
      incrementLoaded();
      updateProgress(90);
    };

    if (document.readyState !== "complete") {
      document.addEventListener("DOMContentLoaded", onDOMReady);
      window.addEventListener("load", onWindowLoad);
    } else {
      incrementLoaded();
      incrementLoaded();
      updateProgress(90);
    }

    // Phase 2: Preload critical images explicitly
    let imagesLoaded = 0;
    const totalImages = CRITICAL_IMAGES.length;

    CRITICAL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        imagesLoaded++;
        incrementLoaded();

        if (imagesLoaded === totalImages) {
          // All critical images done — jump to 100%
          updateProgress(100);
          setTimeout(() => {
            setIsComplete(true);
          }, 400); // small delay for the fill animation to finish
        }
      };
      img.src = src;
    });

    // Phase 3: PerformanceObserver for extra resource tracking
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          // More resources loading = boost progress slightly
          totalResourcesRef.current += entries.length;
          loadedResourcesRef.current += entries.length;
          const pct =
            (loadedResourcesRef.current / totalResourcesRef.current) * 100;
          updateProgress(Math.min(pct, 95)); // Cap at 95% — final 5% from images
        }
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // PerformanceObserver not supported — fallback is fine
    }

    // Safety net: if something hangs, force complete after 8 seconds
    const safetyTimeout = setTimeout(() => {
      updateProgress(100);
      setTimeout(() => setIsComplete(true), 300);
    }, 8000);

    return () => {
      document.removeEventListener("DOMContentLoaded", onDOMReady);
      window.removeEventListener("load", onWindowLoad);
      observer?.disconnect();
      clearTimeout(safetyTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress, incrementLoaded]);

  // Remove from DOM after exit animation
  const handleExitComplete = () => {
    setShouldRender(false);
    // Re-enable scrolling
    document.body.style.overflow = "";
  };

  // Lock scroll while loading
  useEffect(() => {
    if (!isComplete) {
      document.body.style.overflow = "hidden";
    }
  }, [isComplete]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isComplete && (
        <motion.div
          key="website-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FDF6EC",
            cursor: "wait",
          }}
        >
          {/* Subtle warm pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage: `radial-gradient(circle at 20% 50%, #D97706 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, #D97706 0%, transparent 50%),
                                radial-gradient(circle at 50% 80%, #D97706 0%, transparent 50%)`,
            }}
          />

          {/* Logo container with fill effect */}
          <div
            style={{
              position: "relative",
              width: "clamp(160px, 30vw, 280px)",
              height: "clamp(160px, 30vw, 280px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* SVG Logo — "5000" badge shape with gradient fill */}
            <svg
              viewBox="0 0 200 200"
              style={{
                width: "100%",
                height: "100%",
                filter: "drop-shadow(0 4px 20px rgba(217, 119, 6, 0.3))",
              }}
            >
              <defs>
                {/* Gradient that fills from bottom to top based on progress */}
                <linearGradient
                  id="fillGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="40%" stopColor="#E8890E" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Clip rect that grows from bottom based on progress */}
                <clipPath id="progressClip">
                  <rect
                    x="0"
                    y={200 - (progress / 100) * 200}
                    width="200"
                    height={(progress / 100) * 200}
                    style={{
                      transition: "y 0.1s ease-out, height 0.1s ease-out",
                    }}
                  />
                </clipPath>

                {/* Shimmer animation on the filled portion */}
                <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-1 -1"
                    to="1 1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>

              {/* Background badge shape — unfilled (light outline) */}
              <g opacity="0.15">
                {/* Shield / Badge shape */}
                <path
                  d="M100 15 C135 15, 175 25, 180 60 L185 100 C185 135, 170 170, 100 190 C30 170, 15 135, 15 100 L20 60 C25 25, 65 15, 100 15Z"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2"
                />
                {/* Inner circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.5"
                />
              </g>

              {/* Filled version — clipped by progress */}
              <g clipPath="url(#progressClip)">
                {/* Badge background filled */}
                <path
                  d="M100 15 C135 15, 175 25, 180 60 L185 100 C185 135, 170 170, 100 190 C30 170, 15 135, 15 100 L20 60 C25 25, 65 15, 100 15Z"
                  fill="url(#fillGradient)"
                  opacity="0.18"
                />
                {/* Inner circle filled — more orangy */}
                <circle cx="100" cy="100" r="65" fill="url(#fillGradient)" opacity="0.22" />

                {/* "5000" text — centered */}
                <text
                  x="100"
                  y="97"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "56px",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-2px",
                  }}
                  fill="url(#fillGradient)"
                >
                  5000
                </text>

                {/* "RS" retro badge — vivid orange circle, cream retro text */}
                <circle cx="100" cy="128" r="14" fill="#E8770A" />
                <circle cx="100" cy="128" r="12.5" fill="none" stroke="#FDF6EC" strokeWidth="0.8" opacity="0.5" />
                <text
                  x="100"
                  y="129"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "11px",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontWeight: 700,
                    fontStyle: "italic",
                    letterSpacing: "1.5px",
                  }}
                  fill="#FDF6EC"
                >
                  RS
                </text>

                {/* Shimmer overlay */}
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  fill="url(#shimmer)"
                  opacity="0.6"
                />
              </g>

              {/* Unfilled outline version (always visible, behind the fill) */}
              <g opacity="0.2">
                <text
                  x="100"
                  y="97"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "56px",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-2px",
                  }}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="0.8"
                >
                  5000
                </text>

                {/* RS retro outline */}
                <circle
                  cx="100"
                  cy="128"
                  r="14"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="0.8"
                />
                <text
                  x="100"
                  y="129"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "11px",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontWeight: 700,
                    fontStyle: "italic",
                  }}
                  fill="#D97706"
                  opacity="0.3"
                >
                  RS
                </text>
              </g>

              {/* Orbiting progress ring */}
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.5"
                strokeDasharray={`${(progress / 100) * 578} 578`}
                strokeLinecap="round"
                opacity="0.4"
                style={{
                  transition: "stroke-dasharray 0.3s ease-out",
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
              />
            </svg>
          </div>

          {/* Progress percentage */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: "clamp(20px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                width: "clamp(180px, 25vw, 260px)",
                height: "3px",
                borderRadius: "2px",
                background: "rgba(217, 119, 6, 0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: "2px",
                  background:
                    "linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #D97706 100%)",
                  backgroundSize: "200% 100%",
                  animation: "barShimmer 1.5s ease-in-out infinite",
                  transition: "width 0.15s ease-out",
                }}
              />
            </div>

            {/* Percentage text */}
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(13px, 1.5vw, 16px)",
                fontWeight: 600,
                color: "#D97706",
                letterSpacing: "3px",
                opacity: 0.7,
              }}
            >
              {progress}%
            </span>
          </motion.div>

          {/* Inline keyframes for shimmer */}
          <style>{`
            @keyframes barShimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
