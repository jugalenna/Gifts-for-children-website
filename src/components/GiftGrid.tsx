import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { GiftCard } from "@/components/GiftCard";
import type { Gift } from "@/lib/sample-gifts";

// Every grid of affiliate links comes with the disclosure right above it.
export function GiftGrid({ gifts }: { gifts: Gift[] }) {
  return (
    <>
      <AffiliateDisclosure />
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {gifts.map((gift) => (
          <li key={gift.id}>
            <GiftCard gift={gift} />
          </li>
        ))}
      </ul>
    </>
  );
}
