import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { href: string; label: string };

// The last crumb is the current page and is shown as plain text.
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="underline underline-offset-4 hover:text-peach-dark">
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
