import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { authLinkClass } from "@/components/auth/AuthLayout";
import { ListingForm } from "@/components/directory/ListingForm";
import { COUNTRIES } from "@/lib/countries";
import { OWN_LISTING_FIELDS, STATUS_LABELS, type OwnListing } from "@/lib/directory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { removeListing, updateListing } from "../actions";

export const metadata: Metadata = {
  title: "Edit Listing",
  robots: { index: false, follow: false },
};

export default function EditListingPage({ params }: PageProps<"/account/listings/[id]">) {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <Link href="/account/listings" className={`text-sm ${authLinkClass}`}>
        ‹ Back to my listings
      </Link>
      <Suspense fallback={<p className="mt-6">Loading your listing…</p>}>
        <EditListing params={params} />
      </Suspense>
    </div>
  );
}

async function EditListing({ params }: Pick<PageProps<"/account/listings/[id]">, "params">) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Everyone can read approved listings, so also check it's this account's own.
  const { data: listing } = await supabase
    .from("listings")
    .select(OWN_LISTING_FIELDS)
    .eq("id", id)
    .eq("user_id", user?.id ?? "")
    .maybeSingle<OwnListing>();
  if (!listing) notFound();

  return (
    <>
      <h1 className="mt-4 text-3xl font-extrabold">Edit {listing.name}</h1>
      <p className="mt-3">
        Status: <strong>{STATUS_LABELS[listing.status]}</strong>
      </p>
      {listing.status === "approved" && (
        <p className="mt-2 rounded-xl bg-peach-light p-3">
          If you save changes, your listing comes off the directory until we approve it again.
        </p>
      )}
      <div className="mt-6 rounded-2xl bg-cloud p-5 sm:p-6">
        <ListingForm
          action={updateListing.bind(null, listing.id)}
          countries={COUNTRIES}
          listing={listing}
          submitLabel="Save and send for approval"
        />
      </div>
      <details className="mt-6 rounded-2xl bg-cloud p-5">
        <summary className="cursor-pointer font-bold">Remove this listing</summary>
        <p className="mt-3">This removes {listing.name} from the directory straight away. It can&apos;t be undone.</p>
        <form action={removeListing.bind(null, listing.id)} className="mt-4">
          <button type="submit" className="w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink">
            Yes, remove this listing
          </button>
        </form>
      </details>
    </>
  );
}
