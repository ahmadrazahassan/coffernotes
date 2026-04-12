import { headers } from "next/headers";

/** Set by middleware (`middleware.ts`) on every matched request. */
export async function getRequestPathname(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") || "/";
}
