import { ageGroupForYears, getCategory } from "@/lib/site";
import type { GiftIdea } from "@/lib/gift-ideas";

export type SearchQuery = {
  q: string;
  age: string; // age group slug, or "" for any age
  category: string; // category slug, or "" for any category
};

// Words that don't help find a gift, e.g. in "gift ideas for a 5 year old".
const IGNORED_WORDS = new Set([
  "a", "an", "and", "the", "for", "of", "to", "with", "my", "our", "her", "his",
  "gift", "gifts", "idea", "ideas", "present", "presents", "toy", "toys",
  "kid", "kids", "child", "children", "boy", "boys", "girl", "girls",
  "year", "years", "yr", "yrs", "old", "olds", "age", "aged", "month", "months",
  "birthday", "christmas",
]);

// Words that mean an age group, e.g. "toys for a toddler".
const AGE_WORDS: Record<string, string> = {
  baby: "0-1",
  babies: "0-1",
  newborn: "0-1",
  toddler: "1-2",
  toddlers: "1-2",
};

// "books" and "book" should match each other.
function stem(word: string): string {
  return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
}

/*
 * Simple search over the gift list. A number like "5" or a word like "baby"
 * in the search text picks an age group; every other useful word must appear
 * in the gift's name, description or category.
 */
export type SearchResult = {
  gifts: GiftIdea[];
  ageOutOfRange: boolean; // e.g. "12 year old": we only cover ages 0-10
};

export function searchGifts(gifts: GiftIdea[], query: SearchQuery): SearchResult {
  let ageSlug = query.age;
  let ageOutOfRange = false;
  const textWords: string[] = [];

  for (const word of query.q.toLowerCase().split(/[^a-z0-9]+/)) {
    if (!word || IGNORED_WORDS.has(word)) continue;
    if (/^\d+$/.test(word)) {
      const group = ageGroupForYears(Number(word));
      if (group) ageSlug ||= group;
      else ageOutOfRange = true;
    } else if (AGE_WORDS[word]) {
      ageSlug ||= AGE_WORDS[word];
    } else {
      textWords.push(stem(word));
    }
  }

  const categoryLabel = getCategory(query.category)?.label;

  if (ageOutOfRange && !ageSlug) return { gifts: [], ageOutOfRange };

  const matches = gifts.filter((gift) => {
    if (ageSlug && !gift.ageGroups.includes(ageSlug)) return false;
    if (categoryLabel && gift.category !== categoryLabel) return false;

    const giftWords = `${gift.name} ${gift.description} ${gift.category}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map(stem);
    return textWords.every((word) => giftWords.some((giftWord) => giftWord.startsWith(word)));
  });

  return { gifts: matches, ageOutOfRange };
}
