import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChildForm } from "@/components/ChildForm";
import { GiftCard } from "@/components/GiftCard";
import { GiftGrid } from "@/components/GiftGrid";
import { AddItemForm } from "@/components/wishlist/AddItemForm";
import { CustomItemCard, TakenStatus } from "@/components/wishlist/ParentItemParts";
import { SharePanel } from "@/components/wishlist/SharePanel";
import { ageLabel, CHILD_FIELDS, childName, currentAge, type Child } from "@/lib/children";
import { getGiftsByIds, getGiftsForAge } from "@/lib/gift-ideas";
import { absoluteUrl, ageGroupForYears, getAgeGroup } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CUSTOM_ITEM_FIELDS, customKey, giftKey, sharePath, type CustomItem } from "@/lib/wishlists";
import { removeChild, updateChild } from "../actions";

export const metadata: Metadata = {
  title: "Gift List",
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  added: "Child added. Add gift ideas with “Add to a child's list”, or add your own items below.",
  updated: "Changes saved.",
  shared: "Sharing is on. Copy the link and send it to family and friends.",
  "new-link": "New link made. The old link no longer works.",
  unshared: "Sharing is off. The link no longer works.",
  "item-added": "Item added to the list.",
  "item-removed": "Item removed from the list.",
  available: "That item is available again.",
};

const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

export default function ChildPage({ params, searchParams }: PageProps<"/account/children/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Link href="/account" className={`text-sm ${linkClass}`}>
        ‹ Back to my account
      </Link>
      <Suspense fallback={<p className="mt-6">Loading the gift list…</p>}>
        <ChildDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ChildDetails({ params, searchParams }: PageProps<"/account/children/[id]">) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  // Row level security means this only finds the child if it belongs to the
  // logged-in adult; anything else is "not found".
  const { data: child } = await supabase
    .from("children")
    .select(`${CHILD_FIELDS}, share_token`)
    .eq("id", id)
    .maybeSingle<Child & { share_token: string | null }>();
  if (!child) notFound();

  const [{ data: customRows }, { data: reservedRows }] = await Promise.all([
    supabase.from("custom_items").select(CUSTOM_ITEM_FIELDS).eq("child_id", id).order("created_at", { ascending: false }),
    supabase.rpc("list_reserved", { p_child_id: id }),
  ]);
  const customItems = (customRows ?? []) as CustomItem[];
  const reserved = new Set((reservedRows ?? []) as string[]);
  const takenStatus = (itemKey: string) =>
    reserved.has(itemKey) ? <TakenStatus childId={child.id} itemKey={itemKey} /> : undefined;

  const { data: rows } = await supabase
    .from("child_gifts")
    .select("gift_id")
    .eq("child_id", id)
    .order("created_at", { ascending: false });
  const listGifts = getGiftsByIds((rows ?? []).map((row) => row.gift_id as string));

  const age = currentAge(child);
  const name = childName(child);
  const group = getAgeGroup(ageGroupForYears(age) ?? "");
  const listIds = new Set(listGifts.map((gift) => gift.id));
  const ideas = group ? getGiftsForAge(group.slug).filter((gift) => !listIds.has(gift.id)) : [];

  const { notice } = await searchParams;
  const message = typeof notice === "string" ? NOTICES[notice] : undefined;

  return (
    <>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Gift list for {name}</h1>
      <p className="mt-2 text-lg">{ageLabel(age)}</p>
      {message && (
        <p role="status" className="mt-4 rounded-xl bg-peach-light p-3 font-semibold">
          {message}
        </p>
      )}
      {age > 10 && (
        <p className="mt-4 rounded-xl bg-cloud p-3">
          {name} is now older than 10. Our gift ideas are for ages 0 to 10, but you can keep this list as long as you
          like.
        </p>
      )}

      <section aria-labelledby="share-heading" className="mt-8">
        <h2 id="share-heading" className="text-2xl font-extrabold">
          Share this list
        </h2>
        <div className="mt-4">
          <SharePanel
            childId={child.id}
            name={name}
            shareUrl={child.share_token ? absoluteUrl(sharePath(child.share_token)) : null}
          />
        </div>
      </section>

      <section aria-labelledby="list-heading" className="mt-12">
        <h2 id="list-heading" className="text-2xl font-extrabold">
          On the list
        </h2>
        {listGifts.length + customItems.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {customItems.map((item) => (
              <li key={item.id}>
                <CustomItemCard childId={child.id} item={item} takenStatus={takenStatus(customKey(item.id))} />
              </li>
            ))}
            {listGifts.map((gift) => (
              <li key={gift.id}>
                <GiftCard gift={gift} status={takenStatus(giftKey(gift.id))} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            Nothing here yet. Tap &ldquo;Add to a child&apos;s list&rdquo; on any gift idea, or add your own item
            below.
          </p>
        )}
      </section>

      <section aria-labelledby="add-item-heading" className="mt-12 max-w-md">
        <h2 id="add-item-heading" className="text-2xl font-extrabold">
          Add your own item
        </h2>
        <p className="mt-2">Something specific in mind? Add it here, with a link to any shop.</p>
        <div className="mt-4 rounded-2xl bg-cloud p-5 sm:p-6">
          {/* A fresh, empty form after each item is added. */}
          <AddItemForm key={customItems.length} childId={child.id} />
        </div>
      </section>

      {group && ideas.length > 0 && (
        <section aria-labelledby="ideas-heading" className="mt-12">
          <h2 id="ideas-heading" className="text-2xl font-extrabold">
            Ideas for {group.label}
          </h2>
          <p className="mt-2">
            <Link href={`/age/${group.slug}`} className={linkClass}>
              See all gift ideas for {group.label}
            </Link>
          </p>
          <div className="mt-4">
            <GiftGrid gifts={ideas.slice(0, 4)} />
          </div>
        </section>
      )}

      <section aria-labelledby="edit-heading" className="mt-12 max-w-md">
        <h2 id="edit-heading" className="text-2xl font-extrabold">
          Edit or remove
        </h2>
        <details className="mt-4 rounded-2xl bg-cloud p-5">
          <summary className="cursor-pointer font-bold">Change nickname or age</summary>
          <div className="mt-4">
            <ChildForm
              action={updateChild.bind(null, child.id)}
              child={{ nickname: child.nickname, currentAge: age }}
              submitLabel="Save changes"
            />
          </div>
        </details>
        <details className="mt-4 rounded-2xl bg-cloud p-5">
          <summary className="cursor-pointer font-bold">Remove {name}</summary>
          <p className="mt-3">This removes {name} and their gift list. It can&apos;t be undone.</p>
          <form action={removeChild.bind(null, child.id)} className="mt-4">
            <button type="submit" className="w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink">
              Yes, remove {name} and their list
            </button>
          </form>
        </details>
      </section>
    </>
  );
}
