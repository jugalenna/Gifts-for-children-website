import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ListingDetails } from "@/components/directory/ListingCard";
import { MAX_LISTINGS, OWN_LISTING_FIELDS, STATUS_LABELS, type OwnListing } from "@/lib/directory";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Business Listings",
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  added: "Thank you! Your listing has been sent for approval. We'll check it soon.",
  updated: "Changes saved. Your listing has been sent for approval again.",
  removed: "Your listing has been removed.",
};

const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

export default function MyListingsPage({ searchParams }: PageProps<"/account/listings">) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Link href="/account" className={`text-sm ${linkClass}`}>
        ‹ Back to my account
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">My business listings</h1>
      <Suspense fallback={<p className="mt-6">Loading your listings…</p>}>
        <MyListings searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function MyListings({ searchParams }: Pick<PageProps<"/account/listings">, "searchParams">) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/listings");

  // Everyone can read approved listings, so ask only for this account's own.
  const { data } = await supabase
    .from("listings")
    .select(OWN_LISTING_FIELDS)
    .eq("user_id", user.id)
    .order("created_at");
  const listings = (data ?? []) as OwnListing[];

  const { notice } = await searchParams;
  const message = typeof notice === "string" ? NOTICES[notice] : undefined;

  return (
    <>
      {message && (
        <p role="status" className="mt-4 rounded-xl bg-peach-light p-3 font-semibold">
          {message}
        </p>
      )}
      <p className="mt-3 text-lg">
        List your shop, venue or service in our free{" "}
        <Link href="/directory" className={linkClass}>
          directory
        </Link>
        . We check each listing before it goes live, and again after any change.
      </p>

      {listings.length > 0 && (
        <ul className="mt-6 space-y-4">
          {listings.map((listing) => (
            <li key={listing.id} className="rounded-2xl bg-cloud p-5">
              <p className="text-sm font-bold">
                <span
                  className={`rounded-full px-3 py-1 ${listing.status === "approved" ? "bg-peach-light" : "bg-white"}`}
                >
                  {STATUS_LABELS[listing.status]}
                </span>
              </p>
              {listing.status === "rejected" && listing.review_note && (
                <p className="mt-3">
                  <strong>Our note:</strong> {listing.review_note}
                </p>
              )}
              <div className="mt-3">
                <ListingDetails listing={listing} />
              </div>
              <p className="mt-4">
                <Link href={`/account/listings/${listing.id}`} className={linkClass}>
                  Edit or remove<span className="sr-only"> {listing.name}</span>
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}

      {listings.length < MAX_LISTINGS ? (
        <p className="mt-6">
          <Link
            href="/account/listings/new"
            className="inline-block rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink"
          >
            {listings.length > 0 ? "Add another listing" : "Add a listing"}
          </Link>
        </p>
      ) : (
        <p className="mt-6">You can have up to {MAX_LISTINGS} listings.</p>
      )}
    </>
  );
}
