import type { Metadata } from "next";
import { AgeGroupCards } from "@/components/AgeGroupCards";
import { GiftGrid } from "@/components/GiftGrid";
import { SearchBox } from "@/components/SearchBox";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { SAMPLE_GIFTS } from "@/lib/sample-gifts";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/search")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="bg-peach-light">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            Gift ideas for kids they&apos;ll love
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Thoughtful presents for children aged 0 to 10. Search for an idea,
            or start with the child&apos;s age.
          </p>
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </section>

      <section aria-labelledby="age-heading" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 id="age-heading" className="text-2xl font-extrabold sm:text-3xl">
          Shop by age
        </h2>
        <p className="mt-2">Pick an age group to see gifts that suit them.</p>
        <div className="mt-6">
          <AgeGroupCards />
        </div>
      </section>

      <section aria-labelledby="popular-heading" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 id="popular-heading" className="text-2xl font-extrabold sm:text-3xl">
          Popular gift ideas
        </h2>
        <p className="mt-2">
          These are <strong>SAMPLE</strong> gifts to show how the site will
          look. Real gift ideas are coming soon.
        </p>
        <div className="mt-4">
          <GiftGrid gifts={SAMPLE_GIFTS} />
        </div>
      </section>
    </>
  );
}
