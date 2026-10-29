import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logOut } from "@/app/auth/actions";
import { GiftGrid } from "@/components/GiftGrid";
import { ACCOUNT_NOTICES } from "@/lib/auth";
import { getGiftsByIds } from "@/lib/sample-gifts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

const outlineButton =
  "block rounded-full border-2 border-peach-dark px-6 py-3 text-center font-bold text-peach-dark hover:bg-cloud";

export default function AccountPage({ searchParams }: PageProps<"/account">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">My account</h1>
      <Suspense fallback={<p className="mt-6">Loading your account…</p>}>
        <AccountDetails searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AccountDetails({ searchParams }: { searchParams: PageProps<"/account">["searchParams"] }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { notice } = await searchParams;
  const message = typeof notice === "string" ? ACCOUNT_NOTICES[notice] : undefined;
  const memberSince = new Date(user.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const { data: favouriteRows, error: favouritesError } = await supabase
    .from("favourites")
    .select("gift_id")
    .order("created_at", { ascending: false });
  const savedGifts = getGiftsByIds((favouriteRows ?? []).map((row) => row.gift_id as string));

  return (
    <>
      {message && (
        <p role="status" className="mt-6 rounded-xl bg-peach-light p-3 font-semibold">
          {message}
        </p>
      )}
      <p className="mt-3 text-lg">
        You&apos;re logged in as <strong className="break-all">{user.email}</strong>.
      </p>
      <p className="mt-1 text-sm">Member since {memberSince}</p>

      <section aria-labelledby="saved-heading" className="mt-10">
        <h2 id="saved-heading" className="text-2xl font-extrabold">
          Saved gifts
        </h2>
        {favouritesError ? (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            Sorry, we couldn&apos;t load your saved gifts just now. Please refresh the page to try again.
          </p>
        ) : savedGifts.length > 0 ? (
          <div className="mt-4">
            <GiftGrid gifts={savedGifts} />
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            You haven&apos;t saved any gifts yet. Tap the heart on any gift to save it here.{" "}
            <Link href="/age" className="font-semibold text-peach-dark underline underline-offset-4">
              Browse gift ideas by age
            </Link>
          </p>
        )}
      </section>

      <section aria-labelledby="lists-heading" className="mt-10 rounded-2xl bg-cloud p-6">
        <h2 id="lists-heading" className="text-xl font-extrabold">
          Gift lists for each child
        </h2>
        <p className="mt-2">Coming soon: keep a separate gift list for each child you shop for.</p>
      </section>

      <section aria-labelledby="settings-heading" className="mt-10">
        <h2 id="settings-heading" className="text-xl font-extrabold">
          Account settings
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/account/email" className={outlineButton}>
            Change email
          </Link>
          <Link href="/account/password" className={outlineButton}>
            Change password
          </Link>
          <form action={logOut}>
            <button type="submit" className="w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink">
              Log out
            </button>
          </form>
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="mt-10">
        <h2 id="privacy-heading" className="text-xl font-extrabold">
          Your data
        </h2>
        <p className="mt-2">
          We only keep your email address and what you choose to save here. Read our{" "}
          <Link href="/privacy" className="font-semibold text-peach-dark underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          to learn more.
        </p>
        <p className="mt-4">
          <Link href="/account/delete" className="font-semibold text-peach-dark underline underline-offset-4">
            Delete my account
          </Link>
        </p>
      </section>
    </>
  );
}
