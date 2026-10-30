import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";
import { ListingForm } from "@/components/directory/ListingForm";
import { COUNTRIES } from "@/lib/countries";
import { addListing } from "../actions";

export const metadata: Metadata = {
  title: "List Your Business",
  robots: { index: false, follow: false },
};

export default function NewListingPage() {
  return (
    <AuthLayout
      title="List your business"
      intro="Add your shop, venue or service to our free directory. We check every listing before it goes live."
      footer={
        <Link href="/account/listings" className={authLinkClass}>
          Back to my listings
        </Link>
      }
    >
      <ListingForm action={addListing} countries={COUNTRIES} submitLabel="Send for approval" />
    </AuthLayout>
  );
}
