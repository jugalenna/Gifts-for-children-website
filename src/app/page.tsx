import type { Metadata } from "next";
import Link from "next/link";
import { GiftGrid } from "@/components/GiftGrid";
import { SearchBox } from "@/components/SearchBox";
import { TopicCards } from "@/components/TopicCards";
import { AGE_GROUPS, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { featuredGifts } from "@/lib/gift-ideas";

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
            Thoughtful presents for children aged 0 to 10. Answer three quick
            questions and we&apos;ll suggest ideas they&apos;ll love.
          </p>
          <Link
            href="/gift-finder"
            className="mt-8 inline-block rounded-full bg-peach-dark px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-ink"
          >
            Find a gift in 3 questions
          </Link>
          <p className="mt-8 text-sm font-semibold">Or search for an idea</p>
          <div className="mt-3">
            <SearchBox />
          </div>
        </div>
      </section>

      <section aria-labelledby="age-heading" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 id="age-heading" className="text-2xl font-extrabold sm:text-3xl">
          Ideas by age
        </h2>
        <p className="mt-2">Pick an age group to see gifts that suit them.</p>
        <div className="mt-6">
          <TopicCards topics={AGE_GROUPS} basePath="/age" />
        </div>
      </section>

      <section aria-labelledby="popular-heading" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 id="popular-heading" className="text-2xl font-extrabold sm:text-3xl">
          Popular gift ideas
        </h2>
        <p className="mt-2">
          A few favourites for every age. Tap the heart to save one for later.
        </p>
        <div className="mt-6">
          <GiftGrid gifts={featuredGifts()} />
        </div>
      </section>
    </>
  );
}
