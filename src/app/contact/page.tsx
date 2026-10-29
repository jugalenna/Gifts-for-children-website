import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}. Suggest a gift idea, ask a question or tell us about a problem with the site.`,
  alternates: { canonical: "/contact" },
};

const REASONS = [
  "Suggest a gift idea you think we should include",
  "Ask a question about the site or how we work",
  "Tell us about a broken link or a problem with a page",
  "Talk to us about working together, if you're a shop or brand",
];

const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Contact us</h1>
      <p className="mt-4 text-lg leading-relaxed">
        We&apos;d love to hear from you. The easiest way to reach us is by
        email.
      </p>

      <div className="mt-8 rounded-2xl bg-peach-light p-6 text-center">
        <p className="font-semibold">Email us at</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-2 inline-block break-all text-xl font-extrabold underline underline-offset-4 hover:text-peach-dark sm:text-2xl"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-3 text-sm">We read every message and will reply as soon as we can.</p>
      </div>

      <section aria-labelledby="reasons-heading" className="mt-12">
        <h2 id="reasons-heading" className="text-2xl font-extrabold">
          You can write to us to
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          {REASONS.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="orders-heading" className="mt-12">
        <h2 id="orders-heading" className="text-2xl font-extrabold">
          Questions about an order?
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          We don&apos;t sell anything ourselves, so we can&apos;t see or change
          orders. For questions about delivery, returns, refunds or a product,
          please contact the shop you bought from. You can read more in our{" "}
          <Link href="/affiliate-disclosure" className={linkClass}>
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="privacy-heading" className="mt-12">
        <h2 id="privacy-heading" className="text-2xl font-extrabold">
          Keep it simple
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          Please don&apos;t send personal details about children, such as full
          names, photos or addresses. An age and a few words about what they
          enjoy are all we need to help. See our{" "}
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>{" "}
          for how we handle your messages.
        </p>
      </section>
    </div>
  );
}
