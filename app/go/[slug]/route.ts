import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  // Create a lightweight Supabase client for this route handler.
  // We avoid the shared createClient() because it calls cookies()
  // which can cause issues in route handlers. This route is public,
  // so anon key is fine.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op: this route never sets cookies
        },
      },
    }
  );

  // Look up the redirect link
  const { data: link } = await supabase
    .from("redirect_links")
    .select("id, destination")
    .eq("slug", slug)
    .single();

  if (!link) {
    // Slug not found → redirect to homepage
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  // Fire-and-forget: increment click count + log click details
  // We don't await these so the redirect is instant
  const referrer = request.headers.get("referer") || null;
  const referrerPath = referrer
    ? (() => {
        try {
          return new URL(referrer).pathname;
        } catch {
          return referrer;
        }
      })()
    : null;

  const userAgent = request.headers.get("user-agent") || null;

  // Hash the IP for privacy (SHA-256)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const ipHash = await hashIP(ip);

  // Ensure analytics are actually dispatched to the database.
  // We use Promise.allSettled so that if tracking fails for any reason,
  // the user is still successfully redirected.
  await Promise.allSettled([
    supabase.rpc("increment_click_count", { link_slug: slug }),
    supabase.from("redirect_clicks").insert({
      link_id: link.id,
      referrer_path: referrerPath,
      user_agent: userAgent,
      ip_hash: ipHash,
    }),
  ]);

  // 302 redirect with security headers
  const response = NextResponse.redirect(link.destination, 302);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, max-age=0"
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "_finlytic_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
