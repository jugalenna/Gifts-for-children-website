"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MAIN_NAV, SITE_NAME } from "@/lib/site";
import { useIsLoggedIn } from "@/lib/useIsLoggedIn";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const loggedIn = useIsLoggedIn();

  return (
    <header className="sticky top-0 z-40 border-b border-cloud bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={`${SITE_NAME} home`} className="shrink-0">
          <Image
            src="/logo.svg"
            alt={SITE_NAME}
            width={470}
            height={190}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-cloud px-4 py-2 font-semibold md:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            {menuOpen ? "✕" : "☰"}
          </span>
          Menu
        </button>

        <nav
          id="main-menu"
          aria-label="Main"
          className={`${menuOpen ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-cloud bg-white md:static md:block md:border-0 md:bg-transparent`}
        >
          <ul className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:gap-6 md:p-0">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-2 py-2 font-semibold hover:text-peach-dark"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={loggedIn ? "/account" : "/login"}
                className="mt-2 block rounded-full bg-peach-dark px-5 py-2 text-center font-bold text-white hover:bg-ink md:mt-0"
                onClick={() => setMenuOpen(false)}
              >
                {loggedIn ? "My account" : "Log in"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
