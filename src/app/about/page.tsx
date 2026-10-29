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
    title: "Pick an age or a category",
    text: "Start with the child's age, or with what they love, such as books, building or the outdoors.",
  },
  {
    title: "Find an idea you like",
    text: "Each gift shows the age it suits, its category and a short description to help you decide.",
  },
  {
    title: "Buy from the shop",
    text: "Tap the button to visit the shop's website, where you can check the price and buy.",
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
          How we keep the site free
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          We don&apos;t sell anything ourselves and we never take payments.
          When you buy a gift through one of our links, the shop may pay us a
          small commission, at no extra cost to you. You can read exactly how
          this works in our{" "}
          <Link href="/affiliate-disclosure" className="font-semibold text-peach-dark underline underline-offset-4">
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="coming-heading" className="mt-12">
        <h2 id="coming-heading" className="text-2xl font-extrabold">
          Coming soon
        </h2>
        <p className="mt-3 text-lg leading-relaxed">
          We&apos;re working on free accounts for grown-ups, so you can:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          <li>save your favourite gift ideas to come back to later</li>
          <li>keep a gift list for each child you shop for</li>
        </ul>
      </section>

      <section aria-labelledby="start-heading" className="mt-12 rounded-2xl bg-peach-light p-6 text-center">
        <h2 id="start-heading" className="text-2xl font-extrabold">
          Ready to find a gift?
        </h2>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/age" className={buttonClass}>
            Browse by age
          </Link>
          <Link href="/category" className={buttonClass}>
            Browse by category
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
