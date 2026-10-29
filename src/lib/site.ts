export const SITE_NAME = "Gift Ideas for Kids";

export type AgeGroup = {
  slug: string;
  label: string;
  blurb: string;
};

export const AGE_GROUPS: AgeGroup[] = [
  { slug: "0-1", label: "0-1 years", blurb: "Soft, safe toys for tiny hands" },
  { slug: "1-2", label: "1-2 years", blurb: "Push, pull, stack and explore" },
  { slug: "3-4", label: "3-4 years", blurb: "Pretend play and first puzzles" },
  { slug: "5-6", label: "5-6 years", blurb: "Crafts, games and early reading" },
  { slug: "7-8", label: "7-8 years", blurb: "Building, science and adventure" },
  { slug: "9-10", label: "9-10 years", blurb: "Bigger projects and new hobbies" },
];

export const MAIN_NAV = [
  { href: "/age", label: "Browse by age" },
  { href: "/category", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];
