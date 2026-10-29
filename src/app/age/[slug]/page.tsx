import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgeGroupCards } from "@/components/AgeGroupCards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftGrid } from "@/components/GiftGrid";
import { AGE_GROUPS, getAgeGroup } from "@/lib/site";
import { getGiftsForAge } from "@/lib/sample-gifts";

export function generateStaticParams() {
  return AGE_GROUPS.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: PageProps<"/age/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const group = getAgeGroup(slug);
  if (!group) return {};

  return {
    title: group.title,
    description: group.intro,
    alternates: { canonical: `/age/${group.slug}` },
  };
}

export default async function AgeGroupPage({ params }: PageProps<"/age/[slug]">) {
  const { slug } = await params;
  const group = getAgeGroup(slug);
  if (!group) notFound();

  const gifts = getGiftsForAge(group.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/age", label: "Browse by age" },
          { href: `/age/${group.slug}`, label: group.label },
        ]}
      />

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{group.title}</h1>
      <p className="mt-3 max-w-2xl text-lg">{group.intro}</p>

      <section aria-labelledby="gifts-heading" className="pt-10">
        <h2 id="gifts-heading" className="text-2xl font-extrabold">
          Gift ideas for {group.label}
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
            We&apos;re still choosing gifts for this age. In the meantime,{" "}
            <Link href="/" className="font-semibold text-peach-dark underline underline-offset-4">
              see our popular gift ideas
            </Link>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="other-ages-heading" className="pt-14">
        <h2 id="other-ages-heading" className="text-2xl font-extrabold">
          All age groups
        </h2>
        <div className="mt-6">
          <AgeGroupCards currentSlug={group.slug} />
        </div>
      </section>
    </div>
  );
}
