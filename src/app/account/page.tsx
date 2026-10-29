import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logOut } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// A first version: step 3 of the accounts plan adds saved gifts, gift lists
// and deleting the account.
export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">My account</h1>
      <Suspense fallback={<p className="mt-6">Loading your account…</p>}>
        <AccountDetails />
      </Suspense>
    </div>
  );
}

async function AccountDetails() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  return (
    <>
      <p className="mt-3 text-lg">
        You&apos;re logged in as <strong className="break-all">{user.email}</strong>.
      </p>

      <section aria-labelledby="coming-heading" className="mt-8 rounded-2xl bg-peach-light p-6">
        <h2 id="coming-heading" className="text-xl font-extrabold">
          Coming soon
        </h2>
        <p className="mt-2">Saved gift ideas and a gift list for each child you shop for will appear here.</p>
      </section>

      <section aria-labelledby="settings-heading" className="mt-8">
        <h2 id="settings-heading" className="text-xl font-extrabold">
          Account settings
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account/password"
            className="rounded-full border-2 border-peach-dark px-6 py-3 text-center font-bold text-peach-dark hover:bg-cloud"
          >
            Change password
          </Link>
          <form action={logOut}>
            <button type="submit" className="w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink">
              Log out
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
