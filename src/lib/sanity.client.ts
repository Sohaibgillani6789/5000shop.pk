import { createClient } from "@sanity/client";

/**
 * Sanity Client
 *
 * Configured for server-side data fetching.
 * Uses CDN for read operations (fast, cached).
 * Uses API directly for mutations (real-time).
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-26";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN for fast, globally distributed reads
  useCdn: process.env.NODE_ENV === "production",
});

// Export config values for reuse across the app
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};
