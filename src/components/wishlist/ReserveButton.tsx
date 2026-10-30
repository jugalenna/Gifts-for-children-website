"use client";

import { useState, useSyncExternalStore } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/*
 * "I'll buy this" for guests on a shared list. The release code that lets a
 * guest undo their choice is kept in this browser only, so only the person
 * who took an item can give it back.
 */
const storageKey = (token: string) => `wishlist:${token}`;

function readCodes(token: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(storageKey(token)) ?? "{}");
  } catch {
    return {};
  }
}

function writeCodes(token: string, codes: Record<string, string>) {
  try {
    localStorage.setItem(storageKey(token), JSON.stringify(codes));
  } catch {
    // Private browsing can block storage; the choice still counts, it just can't be undone here.
  }
}

const noSubscribe = () => () => {};

export function ReserveButton({ token, itemKey, reserved: initiallyReserved }: { token: string; itemKey: string; reserved: boolean }) {
  const [reserved, setReserved] = useState(initiallyReserved);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  // Whether this browser took the item earlier (read once it's in the browser).
  const savedCode = useSyncExternalStore(noSubscribe, () => readCodes(token)[itemKey] ?? null, () => null);
  const code = myCode ?? savedCode;
  const mine = reserved && code !== null;

  async function reserve() {
    setBusy(true);
    setMessage("");
    const { data, error } = await getSupabaseBrowserClient().rpc("reserve_item", { p_token: token, p_item_key: itemKey });
    setBusy(false);
    if (error) {
      setMessage("Sorry, that didn't work. Please try again.");
      return;
    }
    setReserved(true);
    if (data) {
      setMyCode(data);
      writeCodes(token, { ...readCodes(token), [itemKey]: data });
      setMessage("Thank you! It's marked as taken.");
    } else {
      setMessage("Sorry, someone has just said they'll buy this one.");
    }
  }

  async function undo() {
    if (!code) return;
    setBusy(true);
    const { data, error } = await getSupabaseBrowserClient().rpc("release_item", {
      p_token: token,
      p_item_key: itemKey,
      p_release_code: code,
    });
    setBusy(false);
    if (error || !data) {
      setMessage("Sorry, that didn't work. Please try again.");
      return;
    }
    const codes = readCodes(token);
    delete codes[itemKey];
    writeCodes(token, codes);
    setMyCode(null);
    setReserved(false);
    setMessage("Done. It's available again.");
  }

  return (
    <div>
      {mine ? (
        <div className="rounded-xl bg-peach-light p-3 text-center">
          <p className="font-bold">✓ You&apos;re buying this</p>
          <button type="button" onClick={undo} disabled={busy} className="mt-1 text-sm font-semibold underline underline-offset-4">
            Undo
          </button>
        </div>
      ) : reserved ? (
        <p className="rounded-xl bg-white p-3 text-center font-bold">Taken: someone is buying this</p>
      ) : (
        <button
          type="button"
          onClick={reserve}
          disabled={busy}
          className="w-full rounded-full bg-peach-dark px-4 py-3 font-bold text-white hover:bg-ink disabled:opacity-70"
        >
          {busy ? "Please wait…" : "I'll buy this"}
        </button>
      )}
      <p role="status" className="mt-2 text-center text-sm">
        {message}
      </p>
    </div>
  );
}
