import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, useId } from "react";
import { ListingDetails } from "@/components/directory/ListingCard";
import { OWN_LISTING_FIELDS, REVIEW_NOTE_MAX_LENGTH, type OwnListing } from "@/lib/directory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { reviewListing } from "../listings/actions";

// Only the site owner's account can use this page (see site_admins in
// supabase/migrations/004_directory.sql). Everyone else gets "not found".
export const metadata: Metadata = {
  title: "Review Listings",
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  approved: "Listing approved. It's now live in the directory.",
  declined: "Listing turned down. The business will see your note on their listings page.",
  failed: "Sorry, that didn't work. The listing may have been removed. Please try again.",
};

const linkClass = "font-semibold text-peach-dark underline underline-offset-4";
const solidButton = "w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink";

export default function ReviewPage({ searchParams }: PageProps<"/account/review">) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Link href="/account" className={`text-sm ${linkClass}`}>
        ‹ Back to my account
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Review listings</h1>
      <Suspense fallback={<p className="mt-6">Loading listings…</p>}>
        <ReviewListings searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ReviewListings({ searchParams }: Pick<PageProps<"/account/review">, "searchParams">) {
  const supabase = await createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("is_site_admin");
  if (!isAdmin) notFound();

  const { data } = await supabase
    .from("listings")
    .select(OWN_LISTING_FIELDS)
    .in("status", ["pending", "approved"])
    .order("updated_at");
  const listings = (data ?? []) as OwnListing[];
  const pending = listings.filter((listing) => listing.status === "pending");
  const approved = listings.filter((listing) => listing.status === "approved");

  const { notice } = await searchParams;
  const message = typeof notice === "string" ? NOTICES[notice] : undefined;

  return (
    <>
      {message && (
        <p role="status" className="mt-4 rounded-xl bg-peach-light p-3 font-semibold">
          {message}
        </p>
      )}

      <section aria-labelledby="pending-heading" className="mt-8">
        <h2 id="pending-heading" className="text-2xl font-extrabold">
          Waiting for approval ({pending.length})
        </h2>
        <p className="mt-2">
          Check that each one is a real business with something suitable for children, and that the description
          and links look right.
        </p>
        {pending.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {pending.map((listing) => (
              <li key={listing.id} className="rounded-2xl bg-cloud p-5">
                <ListingDetails listing={listing} headingLevel={3} />
                <form action={reviewListing.bind(null, listing.id, true)} className="mt-5">
                  <button type="submit" className={solidButton}>
                    Approve<span className="sr-only"> {listing.name}</span>
                  </button>
                </form>
                <DeclineForm listing={listing} summary="Turn down" button="Turn down this listing" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">Nothing to check right now.</p>
        )}
      </section>

      <section aria-labelledby="live-heading" className="mt-12">
        <h2 id="live-heading" className="text-2xl font-extrabold">
          Live in the directory ({approved.length})
        </h2>
        {approved.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {approved.map((listing) => (
              <li key={listing.id} className="rounded-2xl bg-cloud p-5">
                <ListingDetails listing={listing} headingLevel={3} />
                <DeclineForm listing={listing} summary="Take down" button="Take this listing down" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">No live listings yet.</p>
        )}
      </section>
    </>
  );
}

function DeclineForm({ listing, summary, button }: { listing: OwnListing; summary: string; button: string }) {
  const id = useId();
  return (
    <details className="mt-4 rounded-xl bg-white p-4">
      <summary className="cursor-pointer font-bold">
        {summary}
        <span className="sr-only"> {listing.name}</span>
      </summary>
      <form action={reviewListing.bind(null, listing.id, false)} className="mt-3 space-y-3">
        <div>
          <label htmlFor={id} className="mb-1 block font-semibold">
            Note to the business (optional)
          </label>
          <textarea
            id={id}
            name="note"
            rows={3}
            maxLength={REVIEW_NOTE_MAX_LENGTH}
            className="w-full rounded-xl border-2 border-cloud bg-white px-4 py-3 text-base focus:border-peach-dark focus:outline-none"
          />
          <p className="mt-1 text-sm">For example what to change. They&apos;ll see it on their listings page.</p>
        </div>
        <button type="submit" className={solidButton}>
          {button}
        </button>
      </form>
    </details>
  );
}
