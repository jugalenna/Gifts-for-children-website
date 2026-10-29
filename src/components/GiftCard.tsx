import Image from "next/image";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Price } from "@/components/Price";
import type { Gift } from "@/lib/sample-gifts";

export function GiftCard({ gift }: { gift: Gift }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-cloud">
      <div className="relative">
        <Image
          src={gift.imageUrl}
          alt={gift.imageAlt}
          width={400}
          height={300}
          className="h-auto w-full"
        />
        {gift.isSample && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-extrabold tracking-wide text-white">
            SAMPLE
          </span>
        )}
        <FavouriteButton giftId={gift.id} giftName={gift.name} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold leading-snug">
          {gift.isSample && <span className="sr-only">Sample gift: </span>}
          {gift.name}
        </h3>
        <p className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white px-2 py-1">Age {gift.ageRange}</span>
          <span className="rounded-full bg-white px-2 py-1">{gift.category}</span>
        </p>
        <p className="text-sm">{gift.description}</p>
        <div className="mt-auto pt-2">
          <Price retailer={gift.retailer} />
          <a
            href={gift.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="mt-3 block rounded-full bg-peach-dark px-4 py-2 text-center font-bold text-white hover:bg-ink"
          >
            View at {gift.retailer}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
