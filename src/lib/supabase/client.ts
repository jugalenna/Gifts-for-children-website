import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | undefined;

// One shared client in the browser, using the same login cookies as the server.
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const { url, key } = supabaseConfig();
    browserClient = createBrowserClient(url, key);
  }
  return browserClient;
}
