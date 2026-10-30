import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftFinder } from "@/components/GiftFinder";

export const metadata: Metadata = {
  title: "Gift Finder: Find a Gift for a Child in 3 Questions",
  description:
    "Not sure what to buy? Answer three quick questions about the child's age, what they love and your budget, and get gift ideas for children aged 0 to 10.",
  alternates: { canonical: "/gift-finder" },
};

export default function GiftFinderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/gift-finder", label: "Gift finder" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Find a gift in 3 quick questions</h1>
      <p className="mt-3 max-w-2xl text-lg">
        Tell us a little about the child and we&apos;ll suggest ideas they&apos;ll love.
      </p>
      <div className="mt-8">
        {/* The quiz reads its answers from the address, so it loads separately. */}
        <Suspense fallback={<p>Loading the gift finder…</p>}>
          <GiftFinder />
        </Suspense>
      </div>
    </div>
  );
}
