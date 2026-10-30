import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${SITE_NAME} helps parents, grandparents and friends find thoughtful gift ideas for children aged 0 to 10, sorted by age and category.`,
  alternates: { canonical: "/about" },
};

const STEPS = [
  {
    title: "Answer three quick questions",
    text: "Tell us the child's age, what they love and how big a gift you have in mind. Or browse by age or category.",
  },
  {
    title: "Find an idea you like",
    text: "Each idea shows the ages it suits, its category, the size of gift and a short description.",
  },
  {
    title: "Save it for later",
    text: "With a free account, save ideas you like and keep a gift list for each child you shop for.",
  },
];

const buttonClass = "inline-block rounded-full bg-peach-dark px-6 py-3 text-center font-bold text-white hover:bg-ink";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">About {SITE_NAME}</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Choosing a present for a child can be harder than it sounds, especially
        when you don&apos;t see them every day. {SITE_NAME} brings together
        gift ideas for children from newborn to 10 years old, sorted by age and
        by what they enjoy, so you can find something they&apos;ll love without
        the guesswork.
      </p>
      <p className="mt-4 text-lg leading-relaxed">
        Our site is for the grown-ups who do the shopping: parents,
        grandparents, aunts, uncles and friends.
      </p>

      <section aria-labelledby="how-heading" className="mt-12">
        <h2 id="how-heading" className="text-2xl font-extrabold">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-cloud p-5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-light text-lg font-extrabold"
              >
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-1">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="money-heading" className="mt-12">
        <h2 id="money-heading" className="text-2xl font-extrabold">
          Free to use
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          {SITE_NAME} is free. We don&apos;t sell anything ourselves and we
          never take payments. Our ideas are general suggestions, so you can
          buy them from whichever shop suits you.
        </p>
      </section>

      <section aria-labelledby="coming-heading" className="mt-12">
        <h2 id="coming-heading" className="text-2xl font-extrabold">
          Coming soon
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          We&apos;re working on two new things:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          <li>birthday wishlists you can share with family, so nobody buys the same present twice</li>
          <li>a directory of toy shops, party venues and other children&apos;s businesses near you</li>
        </ul>
      </section>

      <section aria-labelledby="start-heading" className="mt-12 rounded-2xl bg-peach-light p-6 text-center">
        <h2 id="start-heading" className="text-2xl font-extrabold">
          Ready to find a gift?
        </h2>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/gift-finder" className={buttonClass}>
            Try the gift finder
          </Link>
          <Link href="/age" className={buttonClass}>
            Browse by age
          </Link>
        </div>
        <p className="mt-5">
          Got a question or an idea?{" "}
          <Link href="/contact" className="font-semibold underline underline-offset-4">
            Get in touch
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
