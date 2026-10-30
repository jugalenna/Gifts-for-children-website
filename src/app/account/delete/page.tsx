import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccountForm } from "@/components/auth/AuthForms";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Delete Your Account",
  robots: { index: false, follow: false },
};

export default function DeleteAccountPage() {
  return (
    <AuthLayout
      title="Delete your account"
      intro={
        <>
          This deletes your account, your saved gifts, all your children&apos;s gift lists and any business listings
          straight away. It can&apos;t be undone.
        </>
      }
      footer={
        <Link href="/account" className={authLinkClass}>
          Keep my account and go back
        </Link>
      }
    >
      <DeleteAccountForm />
    </AuthLayout>
  );
}
