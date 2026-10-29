import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TopicCards } from "@/components/TopicCards";
import { CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gift Ideas by Category",
  description:
    "Browse gift ideas for kids by category: books, outdoor toys, creative and craft gifts, building toys and educational gifts for children aged 0 to 10.",
  alternates: { canonical: "/category" },
};

export default function CategoryIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/category", label: "Categories" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Gift ideas by category</h1>
      <p className="mt-3 max-w-2xl text-lg">
        Know what they love? Pick a category to see gift ideas for children of
        all ages, from babies to 10 year olds.
      </p>
      <div className="mt-8">
        <TopicCards topics={CATEGORIES} basePath="/category" />
      </div>
    </div>
  );
}
