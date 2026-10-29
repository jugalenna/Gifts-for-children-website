import Link from "next/link";
import { AGE_GROUPS } from "@/lib/site";

export function AgeGroupCards({ currentSlug }: { currentSlug?: string }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {AGE_GROUPS.map((group) => {
        const isCurrent = group.slug === currentSlug;
        return (
          <li key={group.slug}>
            <Link
              href={`/age/${group.slug}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex h-full flex-col rounded-2xl p-4 transition hover:-translate-y-0.5 hover:bg-peach-light ${isCurrent ? "bg-peach-light ring-2 ring-peach-dark" : "bg-cloud"}`}
            >
              <span className="text-xl font-extrabold">{group.label}</span>
              <span className="mt-1 text-sm">{group.blurb}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
