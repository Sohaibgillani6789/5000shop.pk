import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./sanity.client";

/**
 * Sanity Image URL Builder
 *
 * Generates optimized image URLs from Sanity's CDN with:
 * - Automatic WebP/AVIF format negotiation
 * - On-the-fly resizing and cropping
 * - Hotspot-aware cropping (respects focal point set in Studio)
 */

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
