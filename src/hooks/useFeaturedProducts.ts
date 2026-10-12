"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { getFeaturedProducts } from "@/lib/featuredProducts";

interface UseFeaturedProductsState {
  data: Product[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
}

interface UseFeaturedProductsReturn extends UseFeaturedProductsState {
  /** Call this manually to trigger a fetch. Safe to call multiple times — no auto-refetch loops. */
  fetch: () => Promise<void>;
}

/**
 * useFeaturedProducts — manual fetch hook.
 * Designed with no auto-fetch on mount to avoid aggressive refetch loops.
 * The consumer decides when to call `fetch()`.
 *
 * Usage:
 *   const { data, isLoading, error, fetch } = useFeaturedProducts();
 *   useEffect(() => { fetch(); }, []); // Call once on mount, your choice.
 */
export function useFeaturedProducts(limit = 10): UseFeaturedProductsReturn {
  const [state, setState] = useState<UseFeaturedProductsState>({
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  });

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const result = await getFeaturedProducts(limit);
    setState({
      data: result.data ?? [],
      isLoading: false,
      error: result.error,
      hasFetched: true,
    });
  }, [limit]);

  return { ...state, fetch };
}
