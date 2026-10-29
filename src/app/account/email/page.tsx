import type { Metadata } from "next";
import Link from "next/link";
import { ChangeEmailForm } from "@/components/auth/AuthForms";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Change Your Email",
  robots: { index: false, follow: false },
};

export default function ChangeEmailPage() {
  return (
    <AuthLayout
      title="Change your email"
      intro="We'll send a link to your new address to check it's yours."
      footer={
        <Link href="/account" className={authLinkClass}>
          Back to my account
        </Link>
      }
    >
      <ChangeEmailForm />
    </AuthLayout>
  );
}
