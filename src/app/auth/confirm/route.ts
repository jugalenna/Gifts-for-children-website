import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/*
 * Links in sign-up and password reset emails land here. Supabase's default
 * emails send a "code"; customised email templates can send a "token_hash"
 * instead, which also works when the link is opened in a different browser.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createSupabaseServerClient();
  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  const destination = ok ? next : "/login?notice=link-invalid";
  return NextResponse.redirect(new URL(destination, request.url));
}
