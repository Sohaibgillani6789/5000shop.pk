import { client } from "./sanity.client";

/**
 * Sanity Data Fetching Layer
 *
 * All GROQ queries are centralized here with proper cache tags.
 * Next.js uses these tags for Incremental Static Regeneration (ISR) —
 * when a document is updated in Sanity Studio, the webhook calls
 * revalidateTag() to invalidate only the affected data.
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  _type: "category";
  name: string;
  slug: { current: string };
  description?: string;
  image?: {
    asset: { _ref: string };
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  order?: number;
  color?: string;
}

export interface Product {
  _id: string;
  _type: "product";
  title: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number;
  category: Category;
  image: {
    asset: { _ref: string };
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  gallery?: Array<{
    asset: { _ref: string };
    alt?: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
  featured?: boolean;
  inStock?: boolean;
  tags?: string[];
}

// ────────────────────────────────────────────────────────────
// Fetch Helper (with Next.js cache tags)
// ────────────────────────────────────────────────────────────

type FetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
};

async function sanityFetch<T>({ query, params = {}, tags = [] }: FetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      tags,
      // Fallback revalidation every 60 seconds if webhook isn't configured
      revalidate: 60,
    },
  });
}

// ────────────────────────────────────────────────────────────
// GROQ Queries
// ────────────────────────────────────────────────────────────

/**
 * Fetch all categories, ordered by display order
 */
export async function getCategories(): Promise<Category[]> {
  return sanityFetch<Category[]>({
    query: `*[_type == "category"] | order(order asc) {
      _id,
      _type,
      name,
      slug,
      description,
      image {
        asset,
        alt,
        hotspot
      },
      order,
      color
    }`,
    tags: ["category"],
  });
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return sanityFetch<Category | null>({
    query: `*[_type == "category" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      description,
      image {
        asset,
        alt,
        hotspot
      },
      order,
      color
    }`,
    params: { slug },
    tags: ["category"],
  });
}

/**
 * Fetch all products with their category data expanded
 */
export async function getProducts(): Promise<Product[]> {
  return sanityFetch<Product[]>({
    query: `*[_type == "product" && inStock == true] | order(title asc) {
      _id,
      _type,
      title,
      slug,
      price,
      compareAtPrice,
      category->{
        _id,
        _type,
        name,
        slug,
        color
      },
      image {
        asset,
        alt,
        hotspot
      },
      gallery[] {
        asset,
        alt
      },
      description,
      featured,
      inStock,
      tags
    }`,
    tags: ["product", "category"],
  });
}

/**
 * Fetch products filtered by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return sanityFetch<Product[]>({
    query: `*[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(title asc) {
      _id,
      _type,
      title,
      slug,
      price,
      compareAtPrice,
      category->{
        _id,
        _type,
        name,
        slug,
        color
      },
      image {
        asset,
        alt,
        hotspot
      },
      description,
      featured,
      inStock,
      tags
    }`,
    params: { categorySlug },
    tags: ["product", "category"],
  });
}

/**
 * Fetch featured products for the homepage
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return sanityFetch<Product[]>({
    query: `*[_type == "product" && featured == true && inStock == true] | order(title asc)[0...10] {
      _id,
      _type,
      title,
      slug,
      price,
      compareAtPrice,
      category->{
        _id,
        _type,
        name,
        slug,
        color
      },
      image {
        asset,
        alt,
        hotspot
      },
      featured,
      inStock
    }`,
    tags: ["product", "category"],
  });
}

/**
 * Fetch a single product by slug (for future product detail pages)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityFetch<Product | null>({
    query: `*[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      price,
      compareAtPrice,
      category->{
        _id,
        _type,
        name,
        slug,
        color
      },
      image {
        asset,
        alt,
        hotspot
      },
      gallery[] {
        asset,
        alt
      },
      description,
      featured,
      inStock,
      tags
    }`,
    params: { slug },
    tags: ["product"],
  });
}
