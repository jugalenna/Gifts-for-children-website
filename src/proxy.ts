import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_GROUPS } from "@/lib/site";

/*
 * Pages for unknown ages (e.g. /age/99) must answer with a real 404 status so
 * search engines drop them. The page itself can't do that once it has started
 * streaming, so we check here first and send unknown ages to a path that
 * doesn't exist, which shows the normal "page not found" with a 404.
 */
const AGE_SLUGS = new Set(AGE_GROUPS.map((group) => group.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!AGE_SLUGS.has(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }
}

export const config = {
  matcher: "/age/:slug+",
};
