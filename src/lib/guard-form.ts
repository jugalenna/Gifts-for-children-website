import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { FormState } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Runs a form's work on the server. An unexpected problem shows up as a
// message in the form (and in the hosting logs) instead of a blank error page.
export async function guardForm(work: () => Promise<FormState>): Promise<FormState> {
  try {
    return await work();
  } catch (error) {
    unstable_rethrow(error); // let redirects through
    console.error("Form action failed:", error);
    if (!isSupabaseConfigured()) {
      return { error: "Accounts aren't available right now. (For the site owner: the Supabase settings are missing.)" };
    }
    return { error: "Sorry, something went wrong on our side. Please try again in a moment." };
  }
}
