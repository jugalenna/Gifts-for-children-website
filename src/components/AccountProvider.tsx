"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, Suspense, use, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { CHILD_FIELDS, type Child } from "@/lib/children";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AccountContextValue = {
  loggedIn: boolean;
  favourites: ReadonlySet<string>;
  toggleFavourite: (giftId: string) => Promise<boolean>; // false if it couldn't be saved
  children: Child[];
  isOnList: (childId: string, giftId: string) => boolean;
  toggleListItem: (childId: string, giftId: string) => Promise<boolean>;
};

type ListItems = ReadonlySet<string>; // "childId:giftId"
const itemKey = (childId: string, giftId: string) => `${childId}:${giftId}`;

const AccountContext = createContext<AccountContextValue | null>(null);

/*
 * Who's logged in and which gifts they've saved, read in the browser so the
 * gift pages themselves can stay pre-built. Only for display: account pages
 * check on the server, and the database only ever returns the visitor's own
 * favourites.
 */
export function AccountProvider({ children: page }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [favourites, setFavourites] = useState<ReadonlySet<string>>(new Set());
  const [children, setChildren] = useState<Child[]>([]);
  const [listItems, setListItems] = useState<ListItems>(new Set());
  const loggedInRef = useRef(false);
  const router = useRouter();
  // Read when needed rather than with usePathname, which would stop pages
  // with addresses that aren't known in advance from being pre-built.
  const onAccountPage = () => window.location.pathname.startsWith("/account");

  const applySession = useCallback(async (hasSession: boolean) => {
    loggedInRef.current = hasSession;
    setLoggedIn(hasSession);
    if (!hasSession) {
      setFavourites(new Set());
      setChildren([]);
      setListItems(new Set());
      return;
    }
    // The database only ever returns this visitor's own rows.
    const supabase = getSupabaseBrowserClient();
    const [favouriteRows, childRows, itemRows] = await Promise.all([
      supabase.from("favourites").select("gift_id"),
      supabase.from("children").select(CHILD_FIELDS).order("created_at"),
      supabase.from("child_gifts").select("child_id, gift_id"),
    ]);
    setFavourites(new Set((favouriteRows.data ?? []).map((row) => row.gift_id as string)));
    setChildren((childRows.data ?? []) as Child[]);
    setListItems(new Set((itemRows.data ?? []).map((row) => itemKey(row.child_id, row.gift_id))));
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
  const onPageChange = useCallback(
    (pathname: string) => {
      if (!isSupabaseConfigured()) return;
      void getSupabaseBrowserClient()
        .auth.getSession()
        .then(({ data }) => {
          const hasSession = Boolean(data.session);
          // Children are added, renamed and removed on account pages, so reload there too.
          if (hasSession !== loggedInRef.current || (hasSession && pathname.startsWith("/account"))) {
            void applySession(hasSession);
          }
        });
    },
    [applySession],
  );

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
      if (onAccountPage()) router.refresh();
      return true;
    },
    [favourites, router],
  );

  const isOnList = useCallback((childId: string, giftId: string) => listItems.has(itemKey(childId, giftId)), [listItems]);

  const toggleListItem = useCallback(
    async (childId: string, giftId: string) => {
      const key = itemKey(childId, giftId);
      const adding = !listItems.has(key);
      const update = (add: boolean) =>
        setListItems((current) => {
          const next = new Set(current);
          if (add) next.add(key);
          else next.delete(key);
          return next;
        });

      update(adding);
      const table = getSupabaseBrowserClient().from("child_gifts");
      const { error } = adding
        ? await table.insert({ child_id: childId, gift_id: giftId })
        : await table.delete().eq("child_id", childId).eq("gift_id", giftId);

      if (error && error.code !== "23505") {
        update(!adding);
        return false;
      }
      if (onAccountPage()) router.refresh();
      return true;
    },
    [listItems, router],
  );

  return (
    <AccountContext value={{ loggedIn, favourites, toggleFavourite, children, isOnList, toggleListItem }}>
      <Suspense fallback={null}>
        <PageChangeWatcher onChange={onPageChange} />
      </Suspense>
      {page}
    </AccountContext>
  );
}

// Kept separate (and behind Suspense) because reading the address on pages
// like /account/children/[id] can only happen when someone visits.
function PageChangeWatcher({ onChange }: { onChange: (pathname: string) => void }) {
  const pathname = usePathname();
  useEffect(() => onChange(pathname), [pathname, onChange]);
  return null;
}

export function useAccount(): AccountContextValue {
  const value = use(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
