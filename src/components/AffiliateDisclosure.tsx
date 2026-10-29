import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className="rounded-2xl border-2 border-peach-light bg-white p-4 text-sm"
    >
      <p>
        <strong>Affiliate disclosure:</strong> the buttons on these gifts are
        affiliate links. If you buy something after clicking one, we may earn a
        small commission from the retailer, at no extra cost to you. We
        don&apos;t sell anything ourselves.{" "}
        <Link href="/affiliate-disclosure" className="font-semibold text-peach-dark underline underline-offset-4">
          Read our full disclosure
        </Link>
        .
      </p>
    </aside>
  );
}
