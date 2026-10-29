import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { AccountProvider } from "@/components/AccountProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gift Ideas for Kids | Gifts for Children Aged 0-10",
    template: "%s | Gift Ideas for Kids",
  },
  description:
    "Find the perfect gift for a child aged 0 to 10. Browse gift ideas by age and category, from baby toys to books, building sets and outdoor fun.",
};

export const viewport: Viewport = {
  themeColor: "#F4906B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <AccountProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AccountProvider>
      </body>
    </html>
  );
}
