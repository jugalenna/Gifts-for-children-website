import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to see your saved gift ideas and gift lists.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Log in"
      intro="Welcome back! Log in to see your saved gifts and gift lists."
      footer={
        <p>
          New here?{" "}
          <Link href="/signup" className={authLinkClass}>
            Create a free account
          </Link>
        </p>
      }
    >
      {/* The form reads the address (e.g. ?next=/account), so it loads separately. */}
      <Suspense fallback={<p>Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
