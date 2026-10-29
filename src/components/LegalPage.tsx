import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DraftNotice } from "@/components/DraftNotice";

export const legalLinkClass = "font-semibold text-peach-dark underline underline-offset-4";

type LegalPageProps = {
  title: string;
  path: string;
  breadcrumb: string;
  written: string; // date the draft was written, e.g. "29 October 2026"
  children: ReactNode;
};

// Shared layout for the Privacy Policy, Terms and Affiliate Disclosure.
export function LegalPage({ title, path, breadcrumb, written, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: path, label: breadcrumb },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <DraftNotice written={written} />
      {children}
    </div>
  );
}

export function LegalSummary({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl bg-peach-light p-6">
      <h2 className="text-xl font-extrabold">The short version</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">{children}</ul>
    </div>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-2xl font-extrabold">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-lg leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
