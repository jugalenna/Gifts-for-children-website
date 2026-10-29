import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TopicCards } from "@/components/TopicCards";
import { AGE_GROUPS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gift Ideas by Age (0-10 Years)",
  description:
    "Browse gift ideas for children by age, from babies to 10 year olds. Pick an age group to find toys, books and gifts that suit them.",
  alternates: { canonical: "/age" },
};

export default function AgeIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/age", label: "Browse by age" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Gift ideas by age</h1>
      <p className="mt-3 max-w-2xl text-lg">
        Children change so much from year to year. Choose an age group to see
        gift ideas that match what they enjoy right now.
      </p>
      <div className="mt-8">
        <TopicCards topics={AGE_GROUPS} basePath="/age" />
      </div>
    </div>
  );
}
