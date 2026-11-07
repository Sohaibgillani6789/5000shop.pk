import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 request proxy (successor of the deprecated `middleware` convention).
 * Refreshes the Supabase auth session cookie and guards `/admin/*` routes.
 * All storefront routes remain public for guest shoppers.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public static assets)
     * - static file extensions (svg, png, jpg, jpeg, gif, webp, pdf, woff2)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|woff2)$).*)",
  ],
};
