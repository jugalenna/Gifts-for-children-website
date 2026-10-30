import Image from "next/image";
import type { ReactNode } from "react";
import { AddToListButton } from "@/components/AddToListButton";
import { FavouriteButton } from "@/components/FavouriteButton";
import { ageRangeLabel, sizeLabel, type GiftIdea } from "@/lib/gift-ideas";

// status: an optional note above the buttons, e.g. "Taken" on a shared wishlist.
export function GiftCard({ gift, status }: { gift: GiftIdea; status?: ReactNode }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-cloud">
      <div className="relative">
        {/* A picture of the category, so it adds nothing for screen readers. */}
        <Image
          src={`/ideas/${gift.category.toLowerCase()}.svg`}
          alt=""
          width={400}
          height={240}
          className="h-auto w-full"
        />
        <FavouriteButton giftId={gift.id} giftName={gift.name} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold leading-snug">{gift.name}</h3>
        <p className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white px-2 py-1">{ageRangeLabel(gift)}</span>
          <span className="rounded-full bg-white px-2 py-1">{gift.category}</span>
          <span className="rounded-full bg-white px-2 py-1">{sizeLabel(gift.size)}</span>
        </p>
        <p className="text-sm">{gift.description}</p>
        <div className="mt-auto pt-2">
          {status}
          <AddToListButton giftId={gift.id} giftName={gift.name} />
        </div>
      </div>
    </article>
  );
}
