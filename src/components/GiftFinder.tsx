"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GiftGrid } from "@/components/GiftGrid";
import { GIFT_SIZES } from "@/lib/gift-ideas";
import { answersToQuery, findGifts, readAnswers, RESULTS_SHOWN, type FinderAnswers } from "@/lib/gift-finder";
import { AGE_GROUPS, CATEGORIES, getAgeGroup, getCategory } from "@/lib/site";

const optionClass =
  "flex w-full flex-col rounded-2xl border-2 p-4 text-left transition hover:border-peach-dark focus-visible:border-peach-dark";
const primaryButton = "rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink disabled:opacity-60";
const linkClass = "font-semibold text-peach-dark underline underline-offset-4";

// How each category reads in a sentence: "children who love books and being creative".
const LIKE_WORDS: Record<string, string> = {
  books: "books",
  outdoor: "the outdoors",
  creative: "being creative",
  building: "building things",
  educational: "learning new things",
};

export function GiftFinder() {
  const router = useRouter();
  const answers = readAnswers(useSearchParams());
  const step = !answers.age ? 1 : !answers.likes ? 2 : !answers.budget ? 3 : 4;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move keyboard and screen reader focus to each new question.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function go(next: FinderAnswers) {
    router.push(`/gift-finder${answersToQuery(next)}`, { scroll: false });
  }

  if (step === 4) {
    return <Results answers={answers} headingRef={headingRef} onRestart={() => go({})} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold">Question {step} of 3</p>
      <div className="mt-2 h-2 rounded-full bg-cloud" aria-hidden="true">
        <div className="h-2 rounded-full bg-peach-dark transition-all" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {step === 1 && (
        <Question title="How old is the child?" headingRef={headingRef}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AGE_GROUPS.map((group) => (
              <li key={group.slug}>
                <button
                  type="button"
                  onClick={() => go({ age: group.slug })}
                  className={`${optionClass} h-full border-cloud bg-cloud`}
                >
                  <span className="text-lg font-extrabold">{group.label}</span>
                  <span className="mt-1 text-sm">{group.blurb}</span>
                </button>
              </li>
            ))}
          </ul>
        </Question>
      )}

      {step === 2 && (
        <LikesQuestion
          initial={answers.likes ?? []}
          headingRef={headingRef}
          onBack={() => go({})}
          onNext={(likes) => go({ ...answers, likes })}
        />
      )}

      {step === 3 && (
        <Question title="How big a gift are you looking for?" headingRef={headingRef}>
          <ul className="grid gap-3">
            {[...GIFT_SIZES, { value: "any" as const, label: "Not sure", hint: "Show me everything" }].map((size) => (
              <li key={size.value}>
                <button
                  type="button"
                  onClick={() => go({ ...answers, budget: size.value })}
                  className={`${optionClass} border-cloud bg-cloud`}
                >
                  <span className="text-lg font-extrabold">{size.label}</span>
                  <span className="mt-1 text-sm">{size.hint}</span>
                </button>
              </li>
            ))}
          </ul>
          <BackLink onClick={() => go({ age: answers.age })} />
        </Question>
      )}
    </div>
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function Question({ title, headingRef, children }: { title: string; headingRef: HeadingRef; children: ReactNode }) {
  return (
    <section className="mt-8" aria-labelledby="question-heading">
      <h2 id="question-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold focus:outline-none sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function LikesQuestion({
  initial,
  headingRef,
  onBack,
  onNext,
}: {
  initial: string[];
  headingRef: HeadingRef;
  onBack: () => void;
  onNext: (likes: string[]) => void;
}) {
  const [likes, setLikes] = useState<string[]>(initial);
  const toggle = (slug: string) =>
    setLikes((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));

  return (
    <Question title="What do they love?" headingRef={headingRef}>
      <fieldset>
        <legend className="mb-4">Pick as many as you like.</legend>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const checked = likes.includes(category.slug);
            return (
              <li key={category.slug}>
                <label
                  className={`${optionClass} cursor-pointer ${checked ? "border-peach-dark bg-peach-light" : "border-cloud bg-cloud"}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(category.slug)}
                      className="h-5 w-5 shrink-0 accent-peach-dark"
                    />
                    <span className="text-lg font-extrabold">{category.label}</span>
                  </span>
                  <span className="mt-1 pl-8 text-sm">{category.blurb}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => onNext(likes)} className={primaryButton}>
          {likes.length > 0 ? "Next" : "Not sure, show everything"}
        </button>
      </div>
      <BackLink onClick={onBack} />
    </Question>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`mt-6 block ${linkClass}`}>
      ‹ Back
    </button>
  );
}

function Results({ answers, headingRef, onRestart }: { answers: FinderAnswers; headingRef: HeadingRef; onRestart: () => void }) {
  const group = getAgeGroup(answers.age!)!;
  const gifts = findGifts(answers);
  const likes = (answers.likes ?? []).map((slug) => LIKE_WORDS[slug] ?? getCategory(slug)!.label.toLowerCase());
  const size = GIFT_SIZES.find((option) => option.value === answers.budget);

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold focus:outline-none sm:text-3xl">
        Ideas for a child aged {group.label.replace(" years", "")}
      </h2>
      <p className="mt-2 text-lg">
        {likes.length > 0 ? <>Best matches for children who love {listWords(likes)} come first</> : <>Ideas across every interest</>}
        {size ? <>, with {size.label.toLowerCase()}s near the top.</> : "."}
      </p>
      <div className="mt-6">
        <GiftGrid gifts={gifts.slice(0, RESULTS_SHOWN)} />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onRestart} className={primaryButton}>
          Start again
        </button>
        {gifts.length > RESULTS_SHOWN && (
          <Link href={`/age/${group.slug}`} className={`text-center ${linkClass}`}>
            See all {gifts.length} ideas for {group.label}
          </Link>
        )}
      </div>
    </section>
  );
}

// "books", "books and outdoor", "books, outdoor and creative"
function listWords(words: string[]): string {
  return words.length <= 1 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
}
