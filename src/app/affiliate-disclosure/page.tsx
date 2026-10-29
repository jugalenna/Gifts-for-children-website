import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DraftNotice } from "@/components/DraftNotice";
import { SITE_NAME } from "@/lib/site";

/*
 * DRAFT wording. Before launch a qualified person should check this page
 * (CLAUDE.md "Legal to-do"), and the owner should confirm:
 * - the "How we choose gifts" promises match how gifts are really chosen;
 * - the list of affiliate programmes, plus any wording a programme requires
 *   (some programmes insist on an exact sentence).
 */

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: `How ${SITE_NAME} earns money through affiliate links, what that means for you, and how we choose the gifts we show.`,
  alternates: { canonical: "/affiliate-disclosure" },
};

const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-2xl font-extrabold">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-lg leading-relaxed">{children}</div>
    </section>
  );
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Affiliate disclosure</h1>
      <DraftNotice written="29 October 2026" />

      <div className="mt-8 rounded-2xl bg-peach-light p-6">
        <h2 className="text-xl font-extrabold">The short version</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          <li>We don&apos;t sell anything. We share gift ideas and link to shops that sell them.</li>
          <li>Some of those links are affiliate links. If you buy after clicking one, the shop may pay us a small commission.</li>
          <li>You don&apos;t pay anything extra because of this.</li>
          <li>When you buy, you buy from the shop, so their prices, delivery, returns and terms apply.</li>
        </ul>
      </div>

      <Section id="what-is" title="What is an affiliate link?">
        <p>
          An affiliate link is a normal link to a shop&apos;s website with a
          small tag added, so the shop knows you came from {SITE_NAME}. If you
          buy something there, the shop may pay us a commission, which is a
          small share of the sale.
        </p>
        <p>
          This is how we keep {SITE_NAME} free to use. The commission comes
          from the shop. It is not added to the price you pay.
        </p>
      </Section>

      <Section id="which-links" title="Which links are affiliate links?">
        <p>
          The buttons on our gift cards, such as &ldquo;View at&nbsp;[shop
          name]&rdquo;, are affiliate links. They open the shop&apos;s website
          in a new tab. Wherever we show these buttons, we also show a short
          notice near them to remind you.
        </p>
        <p>
          Links to pages on our own site, such as age groups and categories,
          are not affiliate links.
        </p>
      </Section>

      <Section id="choosing" title="How we choose gifts">
        <p>
          We choose gift ideas because we think they would make good presents
          for the age shown, not because of how much commission a shop pays.
          Earning a commission does not change which gifts we show or what we
          say about them.
        </p>
        <p>
          Always check the shop&apos;s product details, age guidance and safety
          information before you buy, as products can change.
        </p>
      </Section>

      <Section id="buying" title="When you buy from a shop">
        <p>
          We don&apos;t take orders or payments. When you click through and buy
          something, you are buying directly from that shop. The shop is
          responsible for the price, stock, delivery, returns, refunds and
          customer service, and its own terms and privacy policy apply.
        </p>
        <p>
          Prices and availability can change at any time. The price shown on
          the shop&apos;s website when you buy is the one that counts.
        </p>
      </Section>

      <Section id="tracking" title="How the shop knows you came from us">
        <p>
          When you click an affiliate link, the shop or the affiliate network
          usually stores a small file called a cookie in your browser, or uses
          a similar method. This tells them the sale came from us. It is set by
          the shop or network, not by {SITE_NAME}, and their privacy policy
          explains how they use it.
        </p>
        <p>
          You can read more about how we handle your information in our{" "}
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      <Section id="programmes" title="Our affiliate programmes">
        <p>
          We are still choosing which affiliate programmes to join. We will
          list them here once we do.
        </p>
      </Section>

      <Section id="questions" title="Questions?">
        <p>
          If you have a question about this page or how we work, please{" "}
          <Link href="/contact" className={linkClass}>
            contact us
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
