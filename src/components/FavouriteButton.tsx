"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "@/components/AccountProvider";

export function FavouriteButton({ giftId, giftName }: { giftId: string; giftName: string }) {
  const { loggedIn, favourites, toggleFavourite } = useAccount();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const saved = favourites.has(giftId);

  async function onClick() {
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    setFailed(!(await toggleFavourite(giftId)));
    setBusy(false);
  }

  const label = !loggedIn
    ? `Log in to save ${giftName}`
    : saved
      ? `Remove ${giftName} from saved gifts`
      : `Save ${giftName}`;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-pressed={loggedIn ? saved : undefined}
        aria-label={label}
        title={label}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 disabled:opacity-70"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" strokeWidth="2" stroke="#B4502D" fill={saved ? "#B4502D" : "none"}>
          <path
            strokeLinejoin="round"
            d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.9 1.2-1.8 2.8-2.9 4.8-2.9 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"
          />
        </svg>
      </button>
      <p role="status" className="sr-only">
        {failed ? "Sorry, that didn't save. Please try again." : ""}
      </p>
      {failed && (
        <p className="absolute inset-x-3 top-16 rounded-lg bg-white p-2 text-center text-sm font-semibold shadow-sm">
          Sorry, that didn&apos;t save. Please try again.
        </p>
      )}
    </>
  );
}
