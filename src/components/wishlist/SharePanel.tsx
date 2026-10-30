"use client";

import { useState, useSyncExternalStore } from "react";
import { setSharing } from "@/app/account/children/actions";

const buttonClass = "rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink";
const outlineClass = "rounded-full border-2 border-peach-dark px-6 py-3 font-bold text-peach-dark hover:bg-white";

// The phone's share sheet exists only in some browsers, and never on the server.
const noSubscribe = () => () => {};
const useCanShare = () =>
  useSyncExternalStore(noSubscribe, () => "share" in navigator, () => false);

type SharePanelProps = { childId: string; name: string; shareUrl: string | null };

export function SharePanel({ childId, name, shareUrl }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const canShare = useCanShare();

  async function copy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (!shareUrl) return;
    try {
      await navigator.share({ title: `Gift list for ${name}`, url: shareUrl });
    } catch {
      // The person closed the share sheet, or sharing isn't available.
    }
  }

  if (!shareUrl) {
    return (
      <div className="rounded-2xl bg-peach-light p-6">
        <p>
          Share {name}&apos;s list with family and friends. They can tap &ldquo;I&apos;ll buy this&rdquo; so nobody
          buys the same present twice. They don&apos;t need an account.
        </p>
        <form action={setSharing.bind(null, childId, true, "shared")} className="mt-4">
          <button type="submit" className={buttonClass}>
            Get a link to share
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-peach-light p-6">
      <p className="font-semibold">Anyone with this link can see {name}&apos;s list:</p>
      <p className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-sm">{shareUrl}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copy} className={buttonClass}>
          {copied ? "Copied!" : "Copy link"}
        </button>
        {canShare && (
          <button type="button" onClick={share} className={outlineClass}>
            Share…
          </button>
        )}
      </div>
      <p role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </p>
      <details className="mt-5">
        <summary className="cursor-pointer font-semibold">Stop sharing or make a new link</summary>
        <p className="mt-3 text-sm">
          A new link replaces the old one, so people with the old link can no longer open the list.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <form action={setSharing.bind(null, childId, true, "new-link")}>
            <button type="submit" className={`w-full ${outlineClass}`}>
              Make a new link
            </button>
          </form>
          <form action={setSharing.bind(null, childId, false, "unshared")}>
            <button type="submit" className={`w-full ${outlineClass}`}>
              Stop sharing
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
