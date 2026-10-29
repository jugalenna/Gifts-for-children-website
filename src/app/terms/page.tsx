import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalSummary, legalLinkClass } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/*
 * DRAFT wording. Before launch a qualified person should check it (CLAUDE.md
 * "Legal to-do"), in particular the liability wording against South Africa's
 * Consumer Protection Act, and the owner should add:
 * - the legal name of whoever runs the site;
 * - which country's law applies (not stated here until confirmed);
 * - a section on accounts before accounts go live.
 */

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms for using ${SITE_NAME}, including how our gift ideas, affiliate links and shop purchases work.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/terms" breadcrumb="Terms" written="29 October 2026">
      <LegalSummary>
        <li>{SITE_NAME} shares gift ideas. We don&apos;t sell anything.</li>
        <li>When you buy, you buy from the shop, and the shop&apos;s terms apply.</li>
        <li>Our ideas are suggestions. Always check age and safety details before you buy.</li>
        <li>Please use the site fairly and don&apos;t copy our content without asking.</li>
      </LegalSummary>

      <LegalSection id="agreeing" title="Using this site">
        <p>
          These terms apply when you use {SITE_NAME}. By using the site, you
          agree to them. If you don&apos;t agree, please don&apos;t use the
          site. The site is meant for adults (18 and over) who are shopping
          for children.
        </p>
      </LegalSection>

      <LegalSection id="ideas" title="Our gift ideas">
        <p>
          The gift ideas on this site are general suggestions to help you
          choose. They are not professional advice. Every child is different,
          so please use your own judgement about what is right for them.
        </p>
        <p>
          We try to keep information accurate and up to date, but products,
          prices and availability can change. Before you buy, always check
          the shop&apos;s product details, the age guidance, and any safety
          warnings, especially for babies and young children.
        </p>
        <p>
          Some gifts on the site are marked SAMPLE. These are examples to show
          how the site works and are not real products.
        </p>
      </LegalSection>

      <LegalSection id="buying" title="Buying from shops">
        <p>
          We don&apos;t sell products, take orders or handle payments. When
          you follow a link and buy something, your purchase is between you
          and that shop. The shop is responsible for the product, price,
          delivery, returns, refunds and customer service, and its own terms
          apply.
        </p>
        <p>
          Some of our links are affiliate links, which means a shop may pay us
          a commission if you buy. You can read how this works in our{" "}
          <Link href="/affiliate-disclosure" className={legalLinkClass}>
            affiliate disclosure
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="other-sites" title="Links to other websites">
        <p>
          Our site links to other websites that we don&apos;t control. We
          aren&apos;t responsible for their content, products, or how they
          handle your information. Please read their terms and privacy
          policies.
        </p>
      </LegalSection>

      <LegalSection id="content" title="Our content">
        <p>
          The words, design and logo on {SITE_NAME} belong to us or the people
          who gave us permission to use them. Product names, images and
          trademarks belong to their owners. You&apos;re welcome to share
          links to our pages, but please don&apos;t copy our content in bulk
          or present it as your own without asking us first.
        </p>
      </LegalSection>

      <LegalSection id="fair-use" title="Using the site fairly">
        <p>Please don&apos;t:</p>
        <ul>
          <li>try to break, overload or get unauthorised access to the site</li>
          <li>use automated tools to copy large parts of the site</li>
          <li>use the site for anything unlawful</li>
        </ul>
      </LegalSection>

      <LegalSection id="liability" title="Our responsibility to you">
        <p>
          We provide the site free of charge and &ldquo;as is&rdquo;. We
          can&apos;t promise it will always be available or free from errors.
          As far as the law allows, we are not responsible for any loss that
          comes from using the site or from products you buy from shops.
          Nothing in these terms limits any rights you have by law that
          can&apos;t be limited.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="Your privacy">
        <p>
          Our{" "}
          <Link href="/privacy" className={legalLinkClass}>
            privacy policy
          </Link>{" "}
          explains how we handle personal information.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these terms from time to time, for example when we add
          new features. The date at the top of the page shows when they last
          changed.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          If you have a question about these terms, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClass}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
