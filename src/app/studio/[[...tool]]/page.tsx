"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

/**
 * Embedded Sanity Studio
 *
 * Accessible at /studio — provides a full visual CMS interface
 * for managing categories and products without any SQL or database knowledge.
 *
 * The [[...tool]] catch-all route handles all Studio sub-routes
 * (e.g. /studio/structure, /studio/vision).
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
