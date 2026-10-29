import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-cloud">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-extrabold">{SITE_NAME}</p>
          <p className="mt-2 text-sm">
            Friendly gift ideas for children aged 0 to 10, chosen to help the
            grown-ups who shop for them. We don&apos;t sell anything ourselves.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:text-peach-dark hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs">
          As an affiliate, we may earn a commission when you buy through links
          on this site, at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}
