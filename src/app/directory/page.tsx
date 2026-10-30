import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingDetails } from "@/components/directory/ListingCard";
import { DirectoryFilters, type CountryChoice, type DirectoryQuery } from "@/components/directory/DirectoryFilters";
import { countryName, isCountryCode } from "@/lib/countries";
import { isListingKind, kindLabel, LISTING_FIELDS, tidyCity, type Listing } from "@/lib/directory";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Directory of Children's Gift & Party Businesses",
  description: `Find toy shops, party venues, entertainers, cake makers and classes for children around the world, in the ${SITE_NAME} directory.`,
  alternates: { canonical: "/directory" },
};

const RESULTS_SHOWN = 200;
const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

type SearchParams = PageProps<"/directory">["searchParams"];

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function readQuery(searchParams: SearchParams): Promise<DirectoryQuery> {
  const params = await searchParams;
  const country = firstValue(params.country).toUpperCase();
  const type = firstValue(params.type);
  return {
    country: isCountryCode(country) ? country : "",
    city: country ? tidyCity(firstValue(params.city)).slice(0, 60) : "",
    type: isListingKind(type) ? type : "",
  };
}

export default function DirectoryPage({ searchParams }: PageProps<"/directory">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/directory", label: "Directory" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Children&apos;s gift &amp; party directory</h1>
      <p className="mt-3 max-w-2xl text-lg">
        Toy shops, party venues, entertainers, cake makers, classes and more, from around the world. Choose a
        country and city to find businesses near you.
      </p>
      <div className="mt-6 max-w-2xl rounded-2xl bg-peach-light p-5">
        <p>
          <strong>Run a business for children?</strong> Listing is free. Create a free account, add your details,
          and we&apos;ll check them before they go live.
        </p>
        <p className="mt-3">
          <Link href="/account/listings/new" className={linkClass}>
            List your business
          </Link>
        </p>
      </div>
      <Suspense fallback={<p className="mt-8">Loading the directory…</p>}>
        <DirectoryResults searchParams={searchParams} />
      </Suspense>
      <p className="mt-10 max-w-2xl text-sm">
        We check each listing before it appears, but we don&apos;t recommend or stand behind any business. Please
        make your own checks before you buy or book. See a problem with a listing? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}

// "50%_off" must match literally in a case-insensitive search.
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (character) => `\\${character}`);

async function DirectoryResults({ searchParams }: { searchParams: SearchParams }) {
  const query = await readQuery(searchParams);
  const supabase = await createSupabaseServerClient();

  // A logged-in business can also read its own unapproved listings, so always
  // ask for approved ones only.
  const { data: places } = await supabase.from("listings").select("country, city").eq("status", "approved");
  const countries = countryChoices((places ?? []) as { country: string; city: string }[]);

  let request = supabase.from("listings").select(LISTING_FIELDS).eq("status", "approved");
  if (query.country) request = request.eq("country", query.country);
  if (query.city) request = request.ilike("city", escapeLike(query.city));
  if (query.type) request = request.eq("kind", query.type);
  const { data, error } = await request.order("name").limit(RESULTS_SHOWN);
  const listings = (data ?? []) as Listing[];

  const where = [query.city, query.country && countryName(query.country)].filter(Boolean).join(", ");
  const what = query.type ? kindLabel(query.type) : "Businesses";

  return (
    <>
      <DirectoryFilters key={JSON.stringify(query)} countries={countries} query={query} />
      <section aria-labelledby="results-heading" className="pt-10">
        <h2 id="results-heading" className="text-2xl font-extrabold">
          {what}
          {where && ` in ${where}`}
        </h2>
        {error ? (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            Sorry, we couldn&apos;t load the directory just now. Please refresh the page to try again.
          </p>
        ) : listings.length > 0 ? (
          <>
            <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <li key={listing.id} className="rounded-2xl bg-cloud p-5">
                  <ListingDetails listing={listing} headingLevel={3} />
                </li>
              ))}
            </ul>
            {listings.length === RESULTS_SHOWN && (
              <p className="mt-4">Showing the first {RESULTS_SHOWN}. Choose a country or city to see more.</p>
            )}
          </>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            {countries.length === 0
              ? "The directory is brand new, so there are no businesses yet. Run one? Be the first to list it!"
              : "No businesses match yet. Try another city or type, or choose “All countries”."}
          </p>
        )}
      </section>
    </>
  );
}

// Countries that have listings, with their cities. Cities typed in different
// ways ("cape town", "Cape Town") count as one.
function countryChoices(places: { country: string; city: string }[]): CountryChoice[] {
  const byCountry = new Map<string, { count: number; cities: Map<string, string> }>();
  for (const { country, city } of places) {
    const entry = byCountry.get(country) ?? { count: 0, cities: new Map() };
    entry.count++;
    const key = city.toLocaleLowerCase("en");
    if (!entry.cities.has(key)) entry.cities.set(key, city);
    byCountry.set(country, entry);
  }
  return [...byCountry]
    .map(([code, { count, cities }]) => ({
      code,
      name: countryName(code),
      count,
      cities: [...cities.values()].sort((a, b) => a.localeCompare(b, "en")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}
