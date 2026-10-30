import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChildForm } from "@/components/ChildForm";
import { GiftGrid } from "@/components/GiftGrid";
import { ageLabel, CHILD_FIELDS, childName, currentAge, type Child } from "@/lib/children";
import { getGiftsByIds, getGiftsForAge } from "@/lib/gift-ideas";
import { ageGroupForYears, getAgeGroup } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { removeChild, updateChild } from "../actions";

export const metadata: Metadata = {
  title: "Gift List",
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  added: "Child added. Now tap “Add to a child's list” on any gift to start their list.",
  updated: "Changes saved.",
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
  const { data: child } = await supabase.from("children").select(CHILD_FIELDS).eq("id", id).maybeSingle<Child>();
  if (!child) notFound();

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

      <section aria-labelledby="list-heading" className="mt-8">
        <h2 id="list-heading" className="text-2xl font-extrabold">
          On the list
        </h2>
        {listGifts.length > 0 ? (
          <div className="mt-4">
            <GiftGrid gifts={listGifts} />
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-cloud p-6">
            Nothing here yet. Tap &ldquo;Add to a child&apos;s list&rdquo; on any gift to add it.
          </p>
        )}
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
