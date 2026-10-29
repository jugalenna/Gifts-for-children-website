import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/AuthForms";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create a free account to save gift ideas and keep a gift list for each child you shop for.",
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create a free account"
      intro="Save your favourite gift ideas and keep a gift list for each child you shop for."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Log in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
