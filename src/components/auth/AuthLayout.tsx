import type { ReactNode } from "react";

// A narrow, centred card for the sign up, log in and password pages.
export function AuthLayout({ title, intro, children, footer }: { title: string; intro?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-10">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {intro && <p className="mt-3 text-lg">{intro}</p>}
      <div className="mt-6 rounded-2xl bg-cloud p-5 sm:p-6">{children}</div>
      {footer && <div className="mt-6 text-center">{footer}</div>}
    </div>
  );
}

export const authLinkClass = "font-semibold text-peach-dark underline underline-offset-4";
