"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/auth";
import { MAX_CHILDREN, NICKNAME_MAX_LENGTH } from "@/lib/children";
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
}

export async function updateChild(childId: string, _prev: FormState, formData: FormData): Promise<FormState> {
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
}

export async function removeChild(childId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  // Their gift list goes too ("on delete cascade" in the database).
  await supabase.from("children").delete().eq("id", childId);
  redirect("/account?notice=child-removed");
}
