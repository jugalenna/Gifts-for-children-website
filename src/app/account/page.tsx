import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logOut } from "@/app/auth/actions";
import { GiftGrid } from "@/components/GiftGrid";
import { ACCOUNT_NOTICES } from "@/lib/auth";
import { ageLabel, CHILD_FIELDS, childName, currentAge, MAX_CHILDREN, type Child } from "@/lib/children";
import { getGiftsByIds } from "@/lib/gift-ideas";
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

  const { data: childRows } = await supabase
    .from("children")
    .select(`${CHILD_FIELDS}, child_gifts(count)`)
    .order("created_at");
  const children = (childRows ?? []) as (Child & { child_gifts: { count: number }[] })[];

  // Everyone can read approved listings, so count only this account's own.
  const [{ count: listingCount }, { data: isAdmin }] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.rpc("is_site_admin"),
  ]);
  const { count: pendingCount } = isAdmin
    ? await supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending")
    : { count: 0 };

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

      <section aria-labelledby="lists-heading" className="mt-10">
        <h2 id="lists-heading" className="text-2xl font-extrabold">
          Gift lists
        </h2>
        <p className="mt-2">Keep a separate gift list for each child you shop for.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {children.map((child) => {
            const giftCount = child.child_gifts[0]?.count ?? 0;
            return (
              <li key={child.id}>
                <Link
                  href={`/account/children/${child.id}`}
                  className="flex h-full flex-col rounded-2xl bg-cloud p-5 transition hover:-translate-y-0.5 hover:bg-peach-light"
                >
                  <span className="text-xl font-extrabold">{childName(child)}</span>
                  <span className="mt-1 text-sm">{ageLabel(currentAge(child))}</span>
                  <span className="mt-3 text-sm font-semibold">
                    {giftCount === 1 ? "1 gift" : `${giftCount} gifts`} on the list
                  </span>
                </Link>
              </li>
            );
          })}
          {children.length < MAX_CHILDREN && (
            <li>
              <Link
                href="/account/children/new"
                className="flex h-full min-h-28 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-peach-dark p-5 text-center font-bold text-peach-dark hover:bg-cloud"
              >
                <span aria-hidden="true" className="text-3xl leading-none">
                  +
                </span>
                Add a child
              </Link>
            </li>
          )}
        </ul>
      </section>

      <section aria-labelledby="business-heading" className="mt-10">
        <h2 id="business-heading" className="text-2xl font-extrabold">
          Business listings
        </h2>
        <p className="mt-2">
          Run a business for children? List it for free in our{" "}
          <Link href="/directory" className="font-semibold text-peach-dark underline underline-offset-4">
            directory
          </Link>
          .
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/account/listings" className={outlineButton}>
            {(listingCount ?? 0) > 0 ? `My listings (${listingCount})` : "List a business"}
          </Link>
          {isAdmin && (
            <Link href="/account/review" className={outlineButton}>
              Review listings{(pendingCount ?? 0) > 0 ? ` (${pendingCount} waiting)` : ""}
            </Link>
          )}
        </div>
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
