import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalSummary, legalLinkClass } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/*
 * DRAFT wording describing the site as it is today: no accounts, no
 * analytics, no cookies of our own. It must be updated BEFORE accounts,
 * analytics or the country/currency feature go live.
 *
 * Before launch a qualified person should check it for POPIA and GDPR
 * (CLAUDE.md "Legal to-do"), and the owner should add:
 * - the legal name and address of whoever runs the site (POPIA asks for the
 *   identity and contact details of the "responsible party");
 * - the hosting provider's name once chosen;
 * - confirmation of how long emails are kept.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your personal information, what we collect, why, and the choices you have.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const email = (
    <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClass}>
      {CONTACT_EMAIL}
    </a>
  );

  return (
    <LegalPage title="Privacy policy" path="/privacy" breadcrumb="Privacy Policy" written="29 October 2026">
      <LegalSummary>
        <li>You can browse {SITE_NAME} without giving us any personal information.</li>
        <li>We don&apos;t sell anything, take payments or show adverts that track you.</li>
        <li>If you email us, we use your message only to reply to you.</li>
        <li>Shops you visit through our links have their own privacy policies.</li>
        <li>Our site is for adults. Please don&apos;t send us personal details about children.</li>
      </LegalSummary>

      <LegalSection id="who" title="Who we are">
        <p>
          {SITE_NAME} is a website of gift ideas for children aged 0 to 10,
          written for the adults who shop for them. In this policy,
          &ldquo;we&rdquo; and &ldquo;us&rdquo; means {SITE_NAME}. You can
          contact us about privacy at {email}.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="What we collect">
        <p>
          <strong>When you browse:</strong> you don&apos;t need to sign up or
          tell us anything to use the site. Like most websites, the company
          that hosts our site automatically records basic technical
          information when pages are requested, such as your IP address,
          browser type and the pages visited. This is used to keep the site
          running and secure.
        </p>
        <p>
          <strong>When you email us:</strong> we receive your email address,
          your name if you include it, and whatever you write in your message.
        </p>
        <p>
          <strong>Accounts:</strong> we don&apos;t offer accounts yet. When we
          do, we will update this policy before they go live to explain what
          information they use.
        </p>
      </LegalSection>

      <LegalSection id="use" title="How we use your information">
        <ul>
          <li>to reply to your messages and help with your questions</li>
          <li>to keep the site working, safe and secure</li>
          <li>to meet our legal obligations</li>
        </ul>
        <p>We don&apos;t sell your personal information, and we don&apos;t use it to send you marketing.</p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          Our site doesn&apos;t set its own cookies at the moment. When you
          click a link to a shop, that shop or its affiliate network may set
          cookies on its own website, for example to record that you came from
          us. Those cookies are controlled by them, so please check their
          privacy and cookie policies.{" "}
          <Link href="/affiliate-disclosure" className={legalLinkClass}>
            Read how affiliate links work
          </Link>
          .
        </p>
        <p>
          If we add cookies or visitor statistics in future, we will update
          this policy and ask for your consent where the law requires it.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children's privacy">
        <p>
          {SITE_NAME} is meant for adults, not children. We don&apos;t
          knowingly collect personal information from anyone under 18. Please
          don&apos;t send us personal details about a child, such as their full
          name, photo or address. If you think a child has sent us their
          details, contact us and we will delete them.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Who we share it with">
        <p>
          We only share personal information with services that help us run
          the site, such as our hosting and email providers, and only so they
          can provide that service. We will also share it if the law requires
          us to.
        </p>
        <p>
          Some of these providers may store information on servers outside
          your country, including outside South Africa. Where this happens,
          we rely on them to protect it in line with data protection law.
        </p>
      </LegalSection>

      <LegalSection id="keep" title="How long we keep it">
        <p>
          We keep emails only for as long as we need them to deal with your
          message, unless the law requires us to keep them for longer.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>
          Depending on where you live, data protection laws such as South
          Africa&apos;s Protection of Personal Information Act (POPIA) and the
          EU and UK GDPR give you rights over your personal information. These
          include the right to:
        </p>
        <ul>
          <li>ask what personal information we hold about you</li>
          <li>ask us to correct or delete it</li>
          <li>object to how we use it</li>
          <li>complain to a data protection authority</li>
        </ul>
        <p>
          To use any of these rights, email us at {email}. In South Africa,
          you can complain to the Information Regulator. Elsewhere, you can
          contact your local data protection authority.
        </p>
      </LegalSection>

      <LegalSection id="security" title="Keeping it safe">
        <p>
          We use trusted providers and take reasonable steps to protect your
          information. No website or email service can be completely secure,
          so please don&apos;t send us anything sensitive.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We will update this page when the way we handle personal
          information changes, for example when we add accounts. The date at
          the top of the page shows when it last changed.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
