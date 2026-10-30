import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalSummary, legalLinkClass } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/*
 * DRAFT wording. Before launch a qualified person should check it (CLAUDE.md
 * "Legal to-do"), in particular the liability wording against South Africa's
 * Consumer Protection Act, and the owner should add:
 * - the legal name of whoever runs the site;
 * - which country's law applies (not stated here until confirmed).
 * The "Your account" section was added for accounts, and "Shared gift
 * lists" (30 October 2026) for shareable wishlists. The affiliate wording
 * was removed on 30 October 2026, when the site stopped using affiliate links.
 */

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms for using ${SITE_NAME}, including how our gift ideas, accounts and shared gift lists work.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/terms" breadcrumb="Terms" updated="30 October 2026">
      <LegalSummary>
        <li>{SITE_NAME} shares gift ideas. We don&apos;t sell anything.</li>
        <li>When you buy, you buy from the shop, and the shop&apos;s terms apply.</li>
        <li>If you share a gift list, anyone with the link can see it. Guests don&apos;t need an account to mark a gift.</li>
        <li>Our ideas are suggestions. Always check age and safety details before you buy.</li>
        <li>Please use the site fairly and don&apos;t copy our content without asking.</li>
        <li>Accounts are free and for adults only. You can delete yours at any time.</li>
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
          Our ideas describe kinds of gifts, such as &ldquo;a balance
          bike&rdquo;, not particular products, and we don&apos;t check what
          shops sell. Before you buy, always check the shop&apos;s product
          details, the age guidance, and any safety warnings, especially for
          babies and young children.
        </p>
      </LegalSection>

      <LegalSection id="buying" title="Buying from shops">
        <p>
          We don&apos;t sell products, take orders or handle payments, and
          shops don&apos;t pay us. When you buy something, your purchase is
          between you and that shop. The shop is responsible for the product,
          price, delivery, returns, refunds and customer service, and its own
          terms apply.
        </p>
      </LegalSection>

      <LegalSection id="other-sites" title="Links to other websites">
        <p>
          Our site may link to other websites that we don&apos;t control,
          including shop links that families add to their own gift lists. We
          don&apos;t check those links and aren&apos;t responsible for the
          websites&apos; content, products, or how they handle your
          information. Please read their terms and privacy policies.
        </p>
      </LegalSection>

      <LegalSection id="account" title="Your account">
        <p>
          You don&apos;t need an account to use {SITE_NAME}. A free account
          lets you save gift ideas and keep a gift list for each child you
          shop for.
        </p>
        <ul>
          <li>Accounts are only for adults (18 and over), one person per account.</li>
          <li>Please use an email address you can access, and keep your password to yourself.</li>
          <li>
            If you think someone else has used your account, change your
            password and let us know.
          </li>
        </ul>
        <p>
          <strong>Children on your lists:</strong> please only add what you
          need to tell your lists apart, such as a first name, nickname or
          initials, and an age. Don&apos;t add a child&apos;s surname,
          photo, address or other details.
        </p>
        <p>
          <strong>Your saved gifts:</strong> we may change or remove gift
          ideas from time to time. When that happens, they may disappear from
          your saved gifts and lists.
        </p>
        <p>
          <strong>Closing an account:</strong> you can delete your account at
          any time from your Account page. This deletes everything saved in
          it straight away and can&apos;t be undone. We may suspend or close
          an account that breaks these terms or puts the site or other people
          at risk. Where we can, we will email you first to explain why.
        </p>
        <p>
          We may change or stop offering accounts in future. If we stop, we
          will tell account holders by email in good time, so you can note
          down anything you&apos;ve saved.
        </p>
      </LegalSection>

      <LegalSection id="shared-lists" title="Shared gift lists">
        <p>
          You can share a child&apos;s gift list with family and friends
          through a private link. Anyone who has the link can see the list:
          the child&apos;s nickname (if you added one), their age and the
          items on it. So only send the link to people you trust, and
          don&apos;t post it publicly. You can make a new link or stop
          sharing at any time, and the old link stops working straight away.
        </p>
        <p>
          <strong>Items you add yourself:</strong> you are responsible for the
          items, notes and shop links you add. Please only add things that
          are suitable and lawful, and don&apos;t add personal details. We
          may remove items that break these terms.
        </p>
        <p>
          <strong>Guests:</strong> guests don&apos;t need an account. Tapping
          &ldquo;I&apos;ll buy this&rdquo; marks an item as taken, so others
          don&apos;t buy the same thing. It isn&apos;t an order or a promise,
          and nothing is bought through our site. Nobody, not even the family,
          sees who marked an item. A guest can undo it from the same browser,
          and the family can make an item available again.
        </p>
        <p>
          We do our best to keep lists working, but we can&apos;t promise that
          two people will never buy the same gift.
        </p>
      </LegalSection>

      <LegalSection id="content" title="Our content">
        <p>
          The words, design and logo on {SITE_NAME} belong to us or the people
          who gave us permission to use them. Brand names and trademarks
          belong to their owners. You&apos;re welcome to share
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
          <li>add harmful, misleading or unlawful items or links to a gift list</li>
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
