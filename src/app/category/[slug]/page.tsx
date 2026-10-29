import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftGrid } from "@/components/GiftGrid";
import { TopicCards } from "@/components/TopicCards";
import { AGE_GROUPS, CATEGORIES, getCategory } from "@/lib/site";
import { getGiftsForCategory } from "@/lib/sample-gifts";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.intro,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const gifts = getGiftsForCategory(category.label);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/category", label: "Categories" },
          { href: `/category/${category.slug}`, label: category.label },
        ]}
      />

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{category.title}</h1>
      <p className="mt-3 max-w-2xl text-lg">{category.intro}</p>

      <section aria-labelledby="gifts-heading" className="pt-10">
        <h2 id="gifts-heading" className="text-2xl font-extrabold">
          {category.label} gift ideas
        </h2>
        {gifts.length > 0 ? (
          <>
            <p className="mt-2">
              These are <strong>SAMPLE</strong> gifts to show how the page
              will look. Real gift ideas are coming soon.
            </p>
            <div className="mt-4">
              <GiftGrid gifts={gifts} />
            </div>
          </>
        ) : (
          <p className="mt-4 rounded-2xl bg-cloud p-6">
            We&apos;re still choosing gifts for this category. In the meantime,{" "}
            <Link href="/" className="font-semibold text-peach-dark underline underline-offset-4">
              see our popular gift ideas
            </Link>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="other-categories-heading" className="pt-14">
        <h2 id="other-categories-heading" className="text-2xl font-extrabold">
          All categories
        </h2>
        <div className="mt-6">
          <TopicCards topics={CATEGORIES} basePath="/category" currentSlug={category.slug} />
        </div>
      </section>

      <section aria-labelledby="ages-heading" className="pt-14">
        <h2 id="ages-heading" className="text-2xl font-extrabold">
          Shop by age
        </h2>
        <div className="mt-6">
          <TopicCards topics={AGE_GROUPS} basePath="/age" />
        </div>
      </section>
    </div>
  );
}
