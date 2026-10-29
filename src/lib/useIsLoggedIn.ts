"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Whether someone is logged in, read in the browser so pages can stay
// pre-built. Only for display: account pages check on the server too.
export function useIsLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return loggedIn;
}
