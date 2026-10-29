import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout, authLinkClass } from "@/components/auth/AuthLayout";
import { ChildForm } from "@/components/ChildForm";
import { addChild } from "../actions";

export const metadata: Metadata = {
  title: "Add a Child",
  robots: { index: false, follow: false },
};

export default function AddChildPage() {
  return (
    <AuthLayout
      title="Add a child"
      intro="Start a gift list for a child you shop for. We only need an age, and a nickname if you'd like one."
      footer={
        <Link href="/account" className={authLinkClass}>
          Back to my account
        </Link>
      }
    >
      <ChildForm action={addChild} submitLabel="Add child" />
    </AuthLayout>
  );
}
