import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_GROUPS, CATEGORIES } from "@/lib/site";

/*
 * Pages for unknown ages or categories (e.g. /age/99, /category/socks) must
 * answer with a real 404 status so search engines drop them. The page itself
 * can't do that once it has started streaming, so we check here first and
 * send unknown ones to a path that doesn't exist, which shows the normal
 * "page not found" with a 404.
 */
const KNOWN_SLUGS: Record<string, Set<string>> = {
  age: new Set(AGE_GROUPS.map((group) => group.slug)),
  category: new Set(CATEGORIES.map((category) => category.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (!KNOWN_SLUGS[section]?.has(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }
}

export const config = {
  matcher: ["/age/:slug+", "/category/:slug+"],
};
