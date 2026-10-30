"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/auth";
import { MAX_CHILDREN, NICKNAME_MAX_LENGTH } from "@/lib/children";
import { guardForm } from "@/lib/guard-form";
import { customKey, MAX_CUSTOM_ITEMS, normaliseUrl, NOTE_MAX_LENGTH, TITLE_MAX_LENGTH, URL_MAX_LENGTH } from "@/lib/wishlists";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ChildFields = { nickname: string | null; age: number };

function readChildFields(formData: FormData): ChildFields | { error: string } {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const age = Number(formData.get("age"));
  if (nickname.length > NICKNAME_MAX_LENGTH) {
    return { error: `Please keep the nickname to ${NICKNAME_MAX_LENGTH} characters or fewer.` };
  }
  if (!Number.isInteger(age) || age < 0 || age > 10) {
    return { error: "Please choose the child's age, from under 1 to 10." };
  }
  return { nickname: nickname || null, age };
}

const SAVE_FAILED = "Sorry, we couldn't save that just now. Please try again.";

export async function addChild(_prev: FormState, formData: FormData): Promise<FormState> {
  return guardForm(async () => {
    const fields = readChildFields(formData);
    if ("error" in fields) return fields;

    const supabase = await createSupabaseServerClient();
    const { count } = await supabase.from("children").select("id", { count: "exact", head: true });
    if ((count ?? 0) >= MAX_CHILDREN) {
      return { error: `You can add up to ${MAX_CHILDREN} children. Please remove one before adding another.` };
    }

    // The database fills in the account (user_id) and today's date.
    const { data, error } = await supabase.from("children").insert(fields).select("id").single();
    if (error || !data) return { error: SAVE_FAILED };

    redirect(`/account/children/${data.id}?notice=added`);
  });
}

export async function updateChild(childId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return guardForm(async () => {
    const fields = readChildFields(formData);
    if ("error" in fields) return fields;

    // A newly entered age counts from today.
    const today = new Date().toISOString().slice(0, 10);
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("children")
      .update({ ...fields, age_recorded_on: today })
      .eq("id", childId);
    if (error) return { error: SAVE_FAILED };

    redirect(`/account/children/${childId}?notice=updated`);
  });
}

export async function removeChild(childId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  // Their gift list goes too ("on delete cascade" in the database).
  await supabase.from("children").delete().eq("id", childId);
  redirect("/account?notice=child-removed");
}

// Sharing: turn on (or make a new link) or off. The database makes the token.
export async function setSharing(childId: string, on: boolean, notice: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("set_sharing", { p_child_id: childId, p_on: on });
  redirect(`/account/children/${childId}?notice=${notice}`);
}

export async function addCustomItem(childId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  return guardForm(async () => {
    const title = String(formData.get("title") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const url = normaliseUrl(String(formData.get("url") ?? ""));
    if (!title) return { error: "Please give the item a name." };
    if (title.length > TITLE_MAX_LENGTH) return { error: `Please keep the name to ${TITLE_MAX_LENGTH} characters or fewer.` };
    if (note.length > NOTE_MAX_LENGTH) return { error: `Please keep the note to ${NOTE_MAX_LENGTH} characters or fewer.` };
    if (url === undefined || (url && url.length > URL_MAX_LENGTH)) {
      return { error: "That link doesn't look right. Please paste the full web address, or leave it empty." };
    }

    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from("custom_items")
      .select("id", { count: "exact", head: true })
      .eq("child_id", childId);
    if ((count ?? 0) >= MAX_CUSTOM_ITEMS) {
      return { error: `You can add up to ${MAX_CUSTOM_ITEMS} of your own items to a list.` };
    }

    const { error } = await supabase.from("custom_items").insert({ child_id: childId, title, url, note: note || null });
    if (error) return { error: SAVE_FAILED };

    redirect(`/account/children/${childId}?notice=item-added`);
  });
}

export async function removeCustomItem(childId: string, itemId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("custom_items").delete().eq("id", itemId).eq("child_id", childId);
  await supabase.rpc("clear_reservation", { p_child_id: childId, p_item_key: customKey(itemId) });
  redirect(`/account/children/${childId}?notice=item-removed`);
}

// Make a taken item available again (the parent never sees who took it).
export async function clearReservation(childId: string, itemKey: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("clear_reservation", { p_child_id: childId, p_item_key: itemKey });
  redirect(`/account/children/${childId}?notice=available`);
}
