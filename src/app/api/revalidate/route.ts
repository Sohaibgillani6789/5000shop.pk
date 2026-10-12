import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity Webhook → Next.js ISR Revalidation
 *
 * This endpoint receives webhook POST requests from Sanity CMS
 * whenever a document is published, updated, or deleted.
 *
 * It extracts the document type and calls revalidateTag() to
 * invalidate only the cached data for that type — ensuring the
 * frontend stays fresh without requiring a full rebuild.
 *
 * Setup in Sanity:
 * 1. Go to https://www.sanity.io/manage → your project → API → Webhooks
 * 2. Create a webhook pointing to: https://yourdomain.com/api/revalidate
 * 3. Set the secret to match SANITY_WEBHOOK_SECRET in your .env.local
 * 4. Trigger on: Create, Update, Delete
 */

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const secret = request.headers.get("x-sanity-webhook-secret");
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    const { _type } = body;

    if (!_type) {
      return NextResponse.json(
        { message: "Missing _type in webhook payload" },
        { status: 400 }
      );
    }

    // Revalidate the cache tag matching the document type
    // This triggers ISR for all pages that use data tagged with this type
    revalidateTag(_type, "default");

    // Also revalidate related tags
    // e.g., when a category changes, products referencing it should refresh too
    if (_type === "category") {
      revalidateTag("product", "default");
    }

    console.log(`[Revalidation] Tag "${_type}" revalidated successfully`);

    return NextResponse.json({
      revalidated: true,
      type: _type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Revalidation] Error:", error);
    return NextResponse.json(
      { message: "Error processing webhook", error: String(error) },
      { status: 500 }
    );
  }
}

// Health check — GET returns status
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "Sanity CMS Revalidation Webhook",
    timestamp: new Date().toISOString(),
  });
}
