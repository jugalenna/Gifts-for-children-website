import { GIFT_IDEAS, GIFT_SIZES, type GiftIdea, type GiftSize } from "@/lib/gift-ideas";
import { getAgeGroup, getCategory } from "@/lib/site";

// The quiz's answers, as they appear in the address so a result can be
// shared or bookmarked, e.g. /gift-finder?age=3-4&likes=books,creative&budget=small
export type FinderAnswers = {
  age?: string; // an age group slug
  likes?: string[]; // category slugs; an empty list means "not sure"
  budget?: GiftSize | "any";
};

export const RESULTS_SHOWN = 8;

export function readAnswers(params: URLSearchParams): FinderAnswers {
  const age = params.get("age") ?? "";
  const likes = params.get("likes");
  const budget = params.get("budget") ?? "";
  return {
    age: getAgeGroup(age) ? age : undefined,
    likes: likes === null ? undefined : likes.split(",").filter((slug) => getCategory(slug)),
    budget: budget === "any" || GIFT_SIZES.some((size) => size.value === budget) ? (budget as GiftSize | "any") : undefined,
  };
}

export function answersToQuery(answers: FinderAnswers): string {
  const params = new URLSearchParams();
  if (answers.age) params.set("age", answers.age);
  if (answers.likes) params.set("likes", answers.likes.join(","));
  if (answers.budget) params.set("budget", answers.budget);
  const query = params.toString().replaceAll("%2C", ",");
  return query ? `?${query}` : "";
}

/*
 * Ideas for the child's age, best matches first: two points for a category
 * they love, one for the chosen gift size. Ties keep the list's own order.
 */
export function findGifts(answers: FinderAnswers): GiftIdea[] {
  if (!answers.age) return [];
  const liked = new Set((answers.likes ?? []).map((slug) => getCategory(slug)?.label));

  return GIFT_IDEAS.filter((gift) => gift.ageGroups.includes(answers.age!))
    .map((gift, index) => ({
      gift,
      index,
      score: (liked.has(gift.category) ? 2 : 0) + (answers.budget === gift.size ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ gift }) => gift);
}
