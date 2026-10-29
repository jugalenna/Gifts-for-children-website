import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGE_GROUPS, CATEGORIES } from "@/lib/site";
import { supabaseConfig } from "@/lib/supabase/config";

/*
 * Runs before matching pages render, while a real status code or redirect is
 * still possible:
 * - unknown ages or categories (e.g. /age/99, /category/socks) get a real 404
 *   so search engines drop them;
 * - account pages refresh the login session and send visitors who aren't
 *   logged in to the login page.
 */
const KNOWN_SLUGS: Record<string, Set<string>> = {
  age: new Set(AGE_GROUPS.map((group) => group.slug)),
  category: new Set(CATEGORIES.map((category) => category.slug)),
};

export async function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");

  if (section === "account") return protectAccountPage(request);

  if (!KNOWN_SLUGS[section]?.has(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }
}

async function protectAccountPage(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = supabaseConfig();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([header, value]) => response.headers.set(header, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/age/:slug+", "/category/:slug+", "/account", "/account/:path*"],
};
