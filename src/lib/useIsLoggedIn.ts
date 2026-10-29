"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Whether someone is logged in, read in the browser so pages can stay
// pre-built. Only for display: account pages check on the server too.
export function useIsLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Logging in, out or deleting the account happens on the server, so check
  // the login cookies again after every page change.
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => setLoggedIn(Boolean(data.session)));
  }, [pathname]);

  return loggedIn;
}
