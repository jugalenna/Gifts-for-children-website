import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReserveButton } from "@/components/wishlist/ReserveButton";
import { ageLabel, currentAge } from "@/lib/children";
import { ageRangeLabel, getGiftsByIds, sizeLabel } from "@/lib/gift-ideas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { customKey, giftKey, isUuid, type SharedList } from "@/lib/wishlists";

// Shared lists are private: only people with the link should find them.
export const metadata: Metadata = {
  title: "A Shared Gift List",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function SharedListPage({ params }: PageProps<"/list/[token]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Suspense fallback={<p>Loading the gift list…</p>}>
        <SharedListContent params={params} />
      </Suspense>
    </div>
  );
}

async function SharedListContent({ params }: { params: PageProps<"/list/[token]">["params"] }) {
  const { token } = await params;
  if (!isUuid(token)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("get_shared_list", { p_token: token });
  const list = data as SharedList | null;
  if (!list) notFound();

  const name = list.nickname;
  const age = currentAge({ age: list.age, age_recorded_on: list.age_recorded_on });
  const reserved = new Set(list.reserved);
  const gifts = getGiftsByIds(list.gift_ids);
  const itemCount = gifts.length + list.custom_items.length;

  return (
    <>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{name ? `Gift list for ${name}` : "A birthday gift list"}</h1>
      <p className="mt-2 text-lg">{ageLabel(age)}</p>
      <div className="mt-6 max-w-2xl rounded-2xl bg-peach-light p-5">
        <p>
          <strong>Buying a present?</strong> Tap &ldquo;I&apos;ll buy this&rdquo; on the one you&apos;re getting, so
          nobody else buys the same thing. Nobody sees who chose what, not even the family.
        </p>
      </div>

      {itemCount === 0 ? (
        <p className="mt-8 rounded-2xl bg-cloud p-6">This list is empty for now. Please check back later.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.custom_items.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-2xl bg-cloud p-4">
                <h2 className="text-lg font-bold leading-snug break-words">{item.title}</h2>
                {item.note && <p className="mt-2 text-sm break-words">{item.note}</p>}
                {item.url && (
                  <p className="mt-2 text-sm">
                    {/* Added by the family, not checked by us. */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="nofollow ugc noopener noreferrer"
                      className="font-semibold text-peach-dark underline underline-offset-4"
                    >
                      See where to buy it
                      <span className="sr-only"> (opens a link added by the family, in a new tab)</span>
                    </a>
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <ReserveButton token={token} itemKey={customKey(item.id)} reserved={reserved.has(customKey(item.id))} />
                </div>
              </article>
            </li>
          ))}
          {gifts.map((gift) => (
            <li key={gift.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-cloud">
                <Image src={`/ideas/${gift.category.toLowerCase()}.svg`} alt="" width={400} height={240} className="h-auto w-full" />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h2 className="text-lg font-bold leading-snug">{gift.name}</h2>
                  <p className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-white px-2 py-1">{ageRangeLabel(gift)}</span>
                    <span className="rounded-full bg-white px-2 py-1">{sizeLabel(gift.size)}</span>
                  </p>
                  <p className="text-sm">{gift.description}</p>
                  <div className="mt-auto pt-2">
                    <ReserveButton token={token} itemKey={giftKey(gift.id)} reserved={reserved.has(giftKey(gift.id))} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-sm">
        Made with{" "}
        <Link href="/" className="font-semibold text-peach-dark underline underline-offset-4">
          Gift Ideas for Kids
        </Link>
        . Make your own free gift list for a child you shop for.
      </p>
    </>
  );
}
