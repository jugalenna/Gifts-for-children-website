import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Account Deleted",
  robots: { index: false, follow: false },
};

export default function GoodbyePage() {
  return (
    <AuthLayout title="Your account has been deleted">
      <p>Your account and everything saved in it have been deleted. Thank you for using Gift Ideas for Kids.</p>
      <p className="mt-3">You&apos;re always welcome to keep browsing gift ideas without an account.</p>
      <Link
        href="/"
        className="mt-5 block rounded-full bg-peach-dark px-6 py-3 text-center font-bold text-white hover:bg-ink"
      >
        Back to gift ideas
      </Link>
    </AuthLayout>
  );
}
