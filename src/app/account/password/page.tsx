import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/auth/AuthForms";
import { AuthLayout } from "@/components/auth/AuthLayout";

// Only reachable when logged in (see proxy.ts), including straight after
// following a "forgotten password" email link.
export const metadata: Metadata = {
  title: "Choose a New Password",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthLayout title="Choose a new password">
      <NewPasswordForm />
    </AuthLayout>
  );
}
