import Link from "next/link";

export type Topic = { slug: string; label: string; blurb: string };

// Tailwind needs full class names, so the wide-screen column counts are listed here.
const WIDE_COLUMNS: Record<number, string> = {
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

type TopicCardsProps = {
  topics: Topic[];
  basePath: string; // e.g. "/age" or "/category"
  currentSlug?: string;
};

export function TopicCards({ topics, basePath, currentSlug }: TopicCardsProps) {
  return (
    <ul className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${WIDE_COLUMNS[topics.length] ?? "lg:grid-cols-4"}`}>
      {topics.map((topic) => {
        const isCurrent = topic.slug === currentSlug;
        return (
          <li key={topic.slug}>
            <Link
              href={`${basePath}/${topic.slug}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex h-full flex-col rounded-2xl p-4 transition hover:-translate-y-0.5 hover:bg-peach-light ${isCurrent ? "bg-peach-light ring-2 ring-peach-dark" : "bg-cloud"}`}
            >
              <span className="text-xl font-extrabold">{topic.label}</span>
              <span className="mt-1 text-sm">{topic.blurb}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
