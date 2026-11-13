"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBagLoader from "./ShoppingBagLoader";

/**
 * WebsiteLoader
 *
 * Real asset & readiness tracker that feeds actual progress percentage (0 - 100)
 * directly into the ShoppingBagLoader's circular ring.
 *
 * Tracks:
 * - Document state (loading -> interactive -> complete)
 * - Self-hosted font set readiness (document.fonts.ready)
 * - Window load event
 * - PerformanceObserver for granular subresource metrics
 * - Smooth lerped progress transition up to 100%
 */
export default function WebsiteLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const progressRef = useRef(0);
  const targetProgressRef = useRef(15);
  const rafRef = useRef<number | null>(null);
  const animateRef = useRef<() => void>(() => {});

  const animateProgress = useCallback(() => {
    const current = progressRef.current;
    const target = targetProgressRef.current;
    const diff = target - current;

    if (Math.abs(diff) < 0.5) {
      progressRef.current = target;
      setProgress(target);
      if (target >= 100) {
        setTimeout(() => setIsDone(true), 280);
      }
    } else {
      progressRef.current = current + diff * 0.16;
      setProgress(Math.round(progressRef.current));
      rafRef.current = requestAnimationFrame(() => animateRef.current());
    }
  }, []);

  useEffect(() => {
    animateRef.current = animateProgress;
  }, [animateProgress]);

  const updateTarget = useCallback(
    (newVal: number) => {
      targetProgressRef.current = Math.min(100, Math.max(targetProgressRef.current, newVal));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => animateRef.current());
    },
    []
  );

  useEffect(() => {
    // Stage 1: Document readiness
    if (document.readyState === "loading") {
      updateTarget(20);
    } else if (document.readyState === "interactive") {
      updateTarget(45);
    } else {
      updateTarget(60);
    }

    const onDOMReady = () => updateTarget(45);
    const onWindowLoad = () => updateTarget(85);

    document.addEventListener("DOMContentLoaded", onDOMReady);
    window.addEventListener("load", onWindowLoad);

    // Stage 2: Fonts readiness
    if (typeof document !== "undefined" && "fonts" in document && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        updateTarget(75);
      });
    }

    // Stage 3: Granular subresource performance tracking
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          updateTarget(Math.min(92, targetProgressRef.current + entries.length * 3));
        }
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // Fallback if PerformanceObserver unsupported
    }

    // When everything is settled, complete to 100%
    const checkComplete = () => {
      if (document.readyState === "complete") {
        updateTarget(100);
      } else {
        window.addEventListener(
          "load",
          () => {
            updateTarget(100);
          },
          { once: true }
        );
      }
    };

    checkComplete();

    // Safety timeout: ensure page reveals within 3.5s max
    const safetyTimer = setTimeout(() => {
      updateTarget(100);
    }, 3500);

    return () => {
      document.removeEventListener("DOMContentLoaded", onDOMReady);
      window.removeEventListener("load", onWindowLoad);
      observer?.disconnect();
      clearTimeout(safetyTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTarget]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="app-shopping-bag-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.28, ease: "easeOut" },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            pointerEvents: isDone ? "none" : "auto",
          }}
        >
          <ShoppingBagLoader fullScreen progress={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
