"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useAccount } from "@/components/AccountProvider";
import { childName } from "@/lib/children";

// Lets a logged-in adult put a gift on one or more of their children's lists.
export function AddToListButton({ giftId, giftName }: { giftId: string; giftName: string }) {
  const { loggedIn, children, isOnList, toggleListItem } = useAccount();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const panelId = useId();

  if (!loggedIn) return null;
  const listCount = children.filter((child) => isOnList(child.id, giftId)).length;

  async function toggle(childId: string) {
    setFailed(!(await toggleListItem(childId, giftId)));
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="w-full rounded-full border-2 border-peach-dark bg-white px-4 py-2 text-center text-sm font-bold text-peach-dark hover:bg-cloud"
      >
        {listCount > 0 ? `On ${listCount} ${listCount === 1 ? "list" : "lists"}` : "Add to a child's list"}
        <span className="sr-only">: {giftName}</span>
        <span aria-hidden="true"> {open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div id={panelId} className="mt-2 rounded-xl bg-white p-3 text-sm">
          {children.length === 0 ? (
            <p>
              <Link href="/account/children/new" className="font-semibold text-peach-dark underline underline-offset-4">
                Add a child
              </Link>{" "}
              first, then you can start their gift list.
            </p>
          ) : (
            <fieldset>
              <legend className="mb-2 font-semibold">Add {giftName} to the list for:</legend>
              <ul className="space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isOnList(child.id, giftId)}
                        onChange={() => toggle(child.id)}
                        className="h-5 w-5 shrink-0 accent-peach-dark"
                      />
                      <span>{childName(child)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}
          <p role="status" className={failed ? "mt-2 font-semibold" : "sr-only"}>
            {failed ? "Sorry, that didn't save. Please try again." : ""}
          </p>
        </div>
      )}
    </div>
  );
}
