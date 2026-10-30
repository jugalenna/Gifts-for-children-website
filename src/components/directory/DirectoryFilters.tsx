"use client";

import Form from "next/form";
import { useState } from "react";
import { LISTING_KINDS } from "@/lib/directory";

export type CountryChoice = { code: string; name: string; count: number; cities: string[] };
export type DirectoryQuery = { country: string; city: string; type: string };

const fieldClass =
  "w-full rounded-xl border-2 border-cloud bg-white px-4 py-3 text-base focus:border-peach-dark focus:outline-none";

// The city list follows the chosen country, so only real choices are offered.
export function DirectoryFilters({ countries, query }: { countries: CountryChoice[]; query: DirectoryQuery }) {
  const [country, setCountry] = useState(query.country);
  const cities = countries.find((choice) => choice.code === country)?.cities ?? [];

  return (
    <Form
      action="/directory"
      role="search"
      aria-label="Filter the directory"
      className="mt-6 grid gap-4 rounded-2xl bg-cloud p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
    >
      <div>
        <label htmlFor="directory-country" className="mb-1 block font-semibold">
          Country
        </label>
        <select
          id="directory-country"
          name="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className={fieldClass}
        >
          <option value="">All countries</option>
          {countries.map((choice) => (
            <option key={choice.code} value={choice.code}>
              {choice.name} ({choice.count})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="directory-city" className="mb-1 block font-semibold">
          City or town
        </label>
        {/* A new country starts with "All cities". */}
        <select
          key={country}
          id="directory-city"
          name="city"
          defaultValue={
            country === query.country
              ? (cities.find((city) => city.toLocaleLowerCase("en") === query.city.toLocaleLowerCase("en")) ?? "")
              : ""
          }
          disabled={cities.length === 0}
          className={`${fieldClass} disabled:opacity-60`}
        >
          <option value="">{country ? "All cities" : "Choose a country first"}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="directory-type" className="mb-1 block font-semibold">
          Type of business
        </label>
        <select id="directory-type" name="type" defaultValue={query.type} className={fieldClass}>
          <option value="">All types</option>
          {LISTING_KINDS.map((kind) => (
            <option key={kind.slug} value={kind.slug}>
              {kind.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink sm:col-span-2 lg:col-span-1"
      >
        Show businesses
      </button>
    </Form>
  );
}
