"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AccountContextValue = {
  loggedIn: boolean;
  favourites: ReadonlySet<string>;
  toggleFavourite: (giftId: string) => Promise<boolean>; // false if it couldn't be saved
};

const AccountContext = createContext<AccountContextValue | null>(null);

/*
 * Who's logged in and which gifts they've saved, read in the browser so the
 * gift pages themselves can stay pre-built. Only for display: account pages
 * check on the server, and the database only ever returns the visitor's own
 * favourites.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [favourites, setFavourites] = useState<ReadonlySet<string>>(new Set());
  const loggedInRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const applySession = useCallback(async (hasSession: boolean) => {
    loggedInRef.current = hasSession;
    setLoggedIn(hasSession);
    if (!hasSession) {
      setFavourites(new Set());
      return;
    }
    const { data } = await getSupabaseBrowserClient().from("favourites").select("gift_id");
    setFavourites(new Set((data ?? []).map((row) => row.gift_id as string)));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((event, session) => {
      // Load favourites when the login changes, not on every token refresh.
      if (event !== "TOKEN_REFRESHED") void applySession(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, [applySession]);

  // Logging in, out or deleting the account happens on the server, so check
  // the login cookies again after every page change.
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => {
        if (Boolean(data.session) !== loggedInRef.current) void applySession(Boolean(data.session));
      });
  }, [pathname, applySession]);

  const toggleFavourite = useCallback(
    async (giftId: string) => {
      const saving = !favourites.has(giftId);
      const update = (add: boolean) =>
        setFavourites((current) => {
          const next = new Set(current);
          if (add) next.add(giftId);
          else next.delete(giftId);
          return next;
        });

      update(saving); // show the change straight away
      const table = getSupabaseBrowserClient().from("favourites");
      const { error } = saving
        ? await table.insert({ gift_id: giftId })
        : await table.delete().eq("gift_id", giftId);

      // "23505" means it was already saved (e.g. in another tab), which is fine.
      if (error && error.code !== "23505") {
        update(!saving); // put it back as it was
        return false;
      }
      // The account page lists saved gifts, so refresh it after a change.
      if (pathname.startsWith("/account")) router.refresh();
      return true;
    },
    [favourites, pathname, router],
  );

  return <AccountContext value={{ loggedIn, favourites, toggleFavourite }}>{children}</AccountContext>;
}

export function useAccount(): AccountContextValue {
  const value = use(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
