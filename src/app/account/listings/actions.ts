"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/auth";
import { MAX_LISTINGS, readListingFields, REVIEW_NOTE_MAX_LENGTH } from "@/lib/directory";
import { guardForm } from "@/lib/guard-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SAVE_FAILED = "Sorry, we couldn't save that just now. Please try again.";

export async function addListing(_prev: FormState, formData: FormData): Promise<FormState> {
  return guardForm(async () => {
    const fields = readListingFields(formData);
    if ("error" in fields) return fields;

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/account/listings/new");
    // Everyone can read approved listings, so count only this account's own.
    const { count } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= MAX_LISTINGS) {
      return { error: `You can add up to ${MAX_LISTINGS} listings. Please remove one before adding another.` };
    }

    // The database fills in the account and marks it "pending" for approval.
    const { error } = await supabase.from("listings").insert(fields);
    if (error) return { error: SAVE_FAILED };

    redirect("/account/listings?notice=added");
  });
}

export async function updateListing(listingId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return guardForm(async () => {
    const fields = readListingFields(formData);
    if ("error" in fields) return fields;

    // Changing a listing sends it back for approval (done in the database).
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("listings").update(fields).eq("id", listingId);
    if (error) return { error: SAVE_FAILED };

    redirect("/account/listings?notice=updated");
  });
}

export async function removeListing(listingId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("listings").delete().eq("id", listingId);
  redirect("/account/listings?notice=removed");
}

// For the site owner. The database refuses anyone else.
export async function reviewListing(listingId: string, approve: boolean, formData: FormData): Promise<void> {
  const note = String(formData.get("note") ?? "").trim().slice(0, REVIEW_NOTE_MAX_LENGTH);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("review_listing", { p_id: listingId, p_approve: approve, p_note: note });
  redirect(`/account/review?notice=${data ? (approve ? "approved" : "declined") : "failed"}`);
}
