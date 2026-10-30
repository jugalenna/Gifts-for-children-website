import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalSummary, legalLinkClass } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/*
 * PUBLISHED 30 October 2026 by the owner's decision, without a second review.
 * The reviewer approved the version without accounts (29 October 2026); this
 * one adds accounts, the login cookie, children on gift lists, storage in
 * Ireland and the gift finder, following the reviewer's changes document,
 * and drops the shop-link cookies (gift ideas no longer link to shops).
 * The reviewer's open questions in that document were not answered. Still to
 * add: the owner's legal name and address. See CLAUDE.md "Legal to-do".
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
    <LegalPage title="Privacy policy" path="/privacy" breadcrumb="Privacy Policy" updated="30 October 2026" approved>
      <LegalSummary>
        <li>
          You can browse {SITE_NAME} without giving us any personal information. If you create a free
          account, we keep your email address and what you choose to save, and you can delete it all at any
          time.
        </li>
        <li>We don&apos;t sell anything, take payments or show adverts that track you.</li>
        <li>If you email us, we use your message only to reply to you.</li>
        <li>The gift finder doesn&apos;t save your answers.</li>
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
          <strong>When you use the gift finder:</strong> your answers (the
          child&apos;s age group, what they love and the size of gift) appear
          only in the page&apos;s address, so you can go back or share the
          results. We don&apos;t save them, but like any page you visit, the
          address may appear in our hosting company&apos;s technical records.
        </p>
        <p>
          <strong>Accounts:</strong> if you create an account, we keep your
          email address, your password (scrambled, so we never see it), a
          record that you confirmed you are 18 or over and accepted our Terms,
          and the gifts, children and gift lists you save. See &ldquo;Your
          account&rdquo; below.
        </p>
      </LegalSection>

      <LegalSection id="account" title="Your account">
        <p>
          Accounts are free and only for adults. When you sign up, you confirm
          you are 18 or over and accept our Terms, and we keep a record of that
          with the date.
        </p>
        <p>
          Your account lets you save gifts and keep a gift list for each child
          you shop for. For each child you can add an optional nickname and
          their age. Each year we move the age up automatically, so we never
          need their birthday.
        </p>
        <p>
          Your account information is stored with Supabase, our database
          provider, on servers in Ireland. Other people using the site
          can&apos;t see what you have saved.
        </p>
        <p>
          You can change your email address or password, remove a child or a
          saved gift, or delete your whole account from your Account page at
          any time. Deleting your account removes everything in it straight
          away and can&apos;t be undone.
        </p>
      </LegalSection>

      <LegalSection id="use" title="How we use your information">
        <ul>
          <li>to run your account, and to keep the gifts, children and gift lists you save so you can come back to them</li>
          <li>to reply to your messages and help with your questions</li>
          <li>to keep the site working, safe and secure</li>
          <li>to meet our legal obligations</li>
        </ul>
        <p>We don&apos;t sell your personal information, and we don&apos;t use it to send you marketing.</p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          We set one kind of cookie: a login cookie that keeps you logged in
          after you sign in. It is only set when you log in, lasts up to 400
          days, and is removed when you log out. It is strictly necessary for
          accounts to work. While you sign up or reset your password, a second
          short-lived cookie checks the email link came from your browser. We
          don&apos;t use cookies for adverts or tracking.
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
        <p>
          If you keep a gift list for a child, we store only what you choose to
          add: an optional nickname and their age. We never ask for a
          child&apos;s surname, birthday, photo or address. You can remove a
          child, and everything on their list, at any time.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Who we share it with">
        <p>
          We only share personal information with services that help us run
          the site: Supabase, which stores accounts and saved lists and sends
          account emails (such as sign-up and password reset links); Vercel,
          which hosts the website; and our email provider, for messages you
          send us. They use it only to provide that service. We will also share
          it if the law requires us to.
        </p>
        <p>
          Account information is stored with Supabase on servers in Ireland, in
          the European Union, which is outside South Africa. Some of our
          providers may also handle information in other countries. Where this
          happens, we rely on them to protect it in line with data protection
          law.
        </p>
      </LegalSection>

      <LegalSection id="keep" title="How long we keep it">
        <p>
          We keep your account information until you delete your account or
          ask us to. Deleting your account removes your email address, saved
          gifts, children and gift lists straight away.
        </p>
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
          To use any of these rights, email us at {email}. If you have an
          account, you can also see and change what you&apos;ve saved on your
          Account page, change your email address or password, and delete
          your account and everything in it yourself. In South Africa,
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
          information changes. The date at the top of the page shows when it
          last changed.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
