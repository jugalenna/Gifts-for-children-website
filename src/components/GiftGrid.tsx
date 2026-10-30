import { GiftCard } from "@/components/GiftCard";
import type { GiftIdea } from "@/lib/gift-ideas";

export function GiftGrid({ gifts }: { gifts: GiftIdea[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {gifts.map((gift) => (
        <li key={gift.id}>
          <GiftCard gift={gift} />
        </li>
      ))}
    </ul>
  );
}
