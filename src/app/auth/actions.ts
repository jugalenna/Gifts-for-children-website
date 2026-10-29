"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { friendlyAuthError, passwordProblem, safeNextPath, type FormState } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Email links must come back to the address the visitor is using.
async function siteOrigin(): Promise<string> {
  return (await headers()).get("origin") ?? SITE_URL;
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!email) return { error: "Please enter your email address." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (formData.get("adult") !== "on") {
    return { error: "Please confirm you're 18 or over and agree to our Terms and Privacy Policy." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=/account`,
      // A record that the person confirmed they're an adult and accepted the terms.
      data: { confirmed_adult: true, accepted_terms_at: new Date().toISOString() },
    },
  });

  // For privacy, the same message shows whether or not the email already has
  // an account, so nobody can use this form to find out who has signed up.
  if (error && error.code !== "user_already_exists") return { error: friendlyAuthError(error.code) };
  return {
    success: `Nearly there! We've sent an email to ${email}. Click the link in it to confirm your address, then you can log in.`,
  };
}

export async function logIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendlyAuthError(error.code) };

  redirect(safeNextPath(text(formData, "next")));
}

export async function logOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login?notice=logged-out");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  if (!email) return { error: "Please enter your email address." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/auth/confirm?next=/account/password`,
  });
  if (error?.code === "over_email_send_rate_limit" || error?.code === "over_request_rate_limit") {
    return { error: friendlyAuthError(error.code) };
  }

  // Same message either way, so the form can't reveal who has an account.
  return {
    success: `If there's an account for ${email}, we've sent it a link to choose a new password. It may take a few minutes to arrive.`,
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== String(formData.get("confirm") ?? "")) {
    return { error: "The two passwords don't match. Please type them again." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: friendlyAuthError(error.code) };

  return { success: "Your password has been changed." };
}

export async function changeEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  if (!email) return { error: "Please enter your new email address." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=${encodeURIComponent("/account?notice=email-changed")}` },
  );
  if (error?.code === "email_exists") return { error: "That email address already has an account. Please use a different one." };
  if (error) return { error: friendlyAuthError(error.code) };

  return {
    success: `We've sent a confirmation link to ${email}. You may also get one at your current address: please click the link in each. Until then, keep using your current email to log in.`,
  };
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("understand") !== "on") {
    return { error: "Please tick the box to confirm you understand this can't be undone." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login?next=/account/delete");

  // Ask for the password again, so nobody can delete the account just by
  // picking up a device that was left logged in.
  const password = String(formData.get("password") ?? "");
  const { error: passwordError } = await supabase.auth.signInWithPassword({ email: user.email, password });
  if (passwordError) {
    return {
      error:
        passwordError.code === "invalid_credentials"
          ? "That password isn't right. Please try again."
          : friendlyAuthError(passwordError.code),
    };
  }

  // Deletes the account and, through the database, everything saved in it
  // (see supabase/migrations/002_delete_my_account.sql).
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: friendlyAuthError(undefined) };

  // The account no longer exists, so remove its login cookies here too.
  await supabase.auth.signOut({ scope: "local" });
  const cookieStore = await cookies();
  cookieStore
    .getAll()
    .filter(({ name }) => name.startsWith("sb-"))
    .forEach(({ name }) => cookieStore.delete(name));

  redirect("/goodbye");
}
