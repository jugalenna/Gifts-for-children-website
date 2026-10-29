import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Forgotten Password",
  description: "Get a link to choose a new password for your account.",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgotten your password?"
      intro="No problem. Enter your email address and we'll send you a link to choose a new one."
      footer={
        <p>
          Remembered it?{" "}
          <Link href="/login" className={authLinkClass}>
            Log in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
