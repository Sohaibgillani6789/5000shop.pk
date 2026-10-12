"use client";

/**
 * Sanity Studio Configuration
 *
 * This file defines the embedded Sanity Studio that lives at /studio.
 * Admins can manage categories and products through a visual interface
 * without needing any database knowledge.
 *
 * Before deploying:
 * 1. Create a Sanity project at https://www.sanity.io/manage
 * 2. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "hazaartak-studio",
  title: "5 Hazaar Tak — Admin",

  projectId,
  dataset,

  // Must match the catch-all route path in App Router
  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Categories section
            S.listItem()
              .title("Categories")
              .icon(() => "📦")
              .child(
                S.documentTypeList("category")
                  .title("Categories")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.divider(),
            // Products section
            S.listItem()
              .title("All Products")
              .icon(() => "🏷️")
              .child(
                S.documentTypeList("product")
                  .title("Products")
                  .defaultOrdering([{ field: "title", direction: "asc" }])
              ),
            S.divider(),
            // Products grouped by category
            S.listItem()
              .title("Products by Category")
              .icon(() => "📂")
              .child(
                S.documentTypeList("category")
                  .title("Select Category")
                  .child((categoryId) =>
                    S.documentList()
                      .title("Products")
                      .filter('_type == "product" && category._ref == $categoryId')
                      .params({ categoryId })
                  )
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
