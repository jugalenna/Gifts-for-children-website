import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftGrid } from "@/components/GiftGrid";
import { AGE_GROUPS, CATEGORIES, getAgeGroup, getCategory } from "@/lib/site";
import { GIFT_IDEAS } from "@/lib/gift-ideas";
import { searchGifts, type SearchQuery } from "@/lib/search";

// Search result pages change with every search, so search engines are asked
// not to list them (they still follow the links to the real gift pages).
export const metadata: Metadata = {
  title: "Search Gift Ideas",
  description: "Search our gift ideas for children aged 0 to 10 by keyword, age and category.",
  robots: { index: false, follow: true },
};

type SearchParams = PageProps<"/search">["searchParams"];

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function readQuery(searchParams: SearchParams): Promise<SearchQuery> {
  const params = await searchParams;
  const age = firstValue(params.age);
  const category = firstValue(params.category);
  return {
    q: firstValue(params.q).slice(0, 100),
    age: getAgeGroup(age) ? age : "",
    category: getCategory(category) ? category : "",
  };
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/search", label: "Search" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Search gift ideas</h1>
      <Suspense fallback={<p className="mt-8">Finding gift ideas…</p>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const query = await readQuery(searchParams);
  const hasSearch = Boolean(query.q || query.age || query.category);
  const { gifts: results, ageOutOfRange } = hasSearch
    ? searchGifts(GIFT_IDEAS, query)
    : { gifts: [], ageOutOfRange: false };

  return (
    <>
      <SearchForm query={query} />

      <section aria-labelledby="results-heading" className="pt-10">
        <h2 id="results-heading" className="text-2xl font-extrabold">
          {hasSearch ? resultsHeading(results.length, query.q) : "What are you looking for?"}
        </h2>

        {!hasSearch && (
          <p className="mt-2">Type a few words, or choose an age or category, then press Search.</p>
        )}

        {hasSearch && results.length > 0 && (
          <>
            <div className="mt-4">
              <GiftGrid gifts={results} />
            </div>
          </>
        )}

        {hasSearch && results.length === 0 && (
          <div className="mt-4 rounded-2xl bg-cloud p-6">
            <p>
              {ageOutOfRange
                ? "Our gift ideas are for children aged 0 to 10. Try an age in that range."
                : "We couldn’t find a match. Try fewer or different words, or clear the filters."}
            </p>
            <p className="mt-3">
              You can also{" "}
              <Link href="/age" className="font-semibold text-peach-dark underline underline-offset-4">
                browse by age
              </Link>{" "}
              or{" "}
              <Link href="/category" className="font-semibold text-peach-dark underline underline-offset-4">
                browse by category
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </>
  );
}

function resultsHeading(count: number, q: string): string {
  const ideas = count === 0 ? "No gift ideas" : count === 1 ? "1 gift idea" : `${count} gift ideas`;
  return q ? `${ideas} for “${q}”` : ideas;
}

const fieldClass =
  "w-full rounded-xl border-2 border-cloud bg-white px-4 py-3 text-base focus:border-peach-dark focus:outline-none";

function SearchForm({ query }: { query: SearchQuery }) {
  return (
    // The key resets the fields to match the address after each new search.
    <Form key={JSON.stringify(query)} action="/search" role="search" className="mt-6 grid gap-4 rounded-2xl bg-cloud p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="search-q" className="mb-1 block font-semibold">
          Search
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query.q}
          placeholder="Try “books for a 5 year old”"
          className={`${fieldClass} placeholder:text-ink/80`}
        />
      </div>
      <div>
        <label htmlFor="search-age" className="mb-1 block font-semibold">
          Age
        </label>
        <select id="search-age" name="age" defaultValue={query.age} className={fieldClass}>
          <option value="">Any age</option>
          {AGE_GROUPS.map((group) => (
            <option key={group.slug} value={group.slug}>
              {group.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="search-category" className="mb-1 block font-semibold">
          Category
        </label>
        <select id="search-category" name="category" defaultValue={query.category} className={fieldClass}>
          <option value="">Any category</option>
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink sm:col-span-2 lg:col-span-1"
      >
        Search
      </button>
    </Form>
  );
}
