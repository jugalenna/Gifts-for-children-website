import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { GiftCard } from "@/components/GiftCard";
import { SearchBox } from "@/components/SearchBox";
import { AGE_GROUPS, SITE_NAME } from "@/lib/site";
import { SAMPLE_GIFTS } from "@/lib/sample-gifts";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  potentialAction: {
    "@type": "SearchAction",
    target: "/search?q={search_term_string}",
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
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {AGE_GROUPS.map((group) => (
            <li key={group.slug}>
              <Link
                href={`/age/${group.slug}`}
                className="flex h-full flex-col rounded-2xl bg-cloud p-4 transition hover:-translate-y-0.5 hover:bg-peach-light"
              >
                <span className="text-xl font-extrabold">{group.label}</span>
                <span className="mt-1 text-sm">{group.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
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
          <AffiliateDisclosure />
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_GIFTS.map((gift) => (
            <li key={gift.id}>
              <GiftCard gift={gift} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
