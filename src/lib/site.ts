export const SITE_NAME = "Gift Ideas for Kids";

// Set NEXT_PUBLIC_SITE_URL to the live address (e.g. https://www.example.com) when the site goes online.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export type AgeGroup = {
  slug: string;
  label: string;
  title: string;
  blurb: string;
  intro: string;
};

export const AGE_GROUPS: AgeGroup[] = [
  {
    slug: "0-1",
    label: "0-1 years",
    title: "Gift ideas for babies (0-1 years)",
    blurb: "Soft, safe toys for tiny hands",
    intro:
      "Babies learn through touch, sound and faces. Look for soft, washable toys, things to grasp and shake, and simple cloth or board books. Always check the age label and avoid small parts.",
  },
  {
    slug: "1-2",
    label: "1-2 years",
    title: "Gift ideas for 1 to 2 year olds",
    blurb: "Push, pull, stack and explore",
    intro:
      "Toddlers are on the move and love to copy what grown-ups do. Push-along toys, stacking and sorting games, chunky crayons and sturdy picture books are all great picks.",
  },
  {
    slug: "3-4",
    label: "3-4 years",
    title: "Gift ideas for 3 to 4 year olds",
    blurb: "Pretend play and first puzzles",
    intro:
      "Imaginations really take off at this age. Dress-up, play kitchens, simple puzzles, big building bricks and stories read together make gifts they will come back to again and again.",
  },
  {
    slug: "5-6",
    label: "5-6 years",
    title: "Gift ideas for 5 to 6 year olds",
    blurb: "Crafts, games and early reading",
    intro:
      "Starting school brings new skills and new interests. Craft kits, easy board games, first readers and outdoor toys help them practise what they are learning while having fun.",
  },
  {
    slug: "7-8",
    label: "7-8 years",
    title: "Gift ideas for 7 to 8 year olds",
    blurb: "Building, science and adventure",
    intro:
      "Curious and confident, 7 and 8 year olds enjoy a challenge. Building sets, science kits, chapter books and games with a bit of strategy are perfect for this age.",
  },
  {
    slug: "9-10",
    label: "9-10 years",
    title: "Gift ideas for 9 to 10 year olds",
    blurb: "Bigger projects and new hobbies",
    intro:
      "Older kids often have clear hobbies of their own. Gifts that grow a passion, such as bigger building projects, art supplies, sports gear or a series of books, tend to be the biggest hits.",
  },
];

export function getAgeGroup(slug: string): AgeGroup | undefined {
  return AGE_GROUPS.find((group) => group.slug === slug);
}

export type Category = {
  slug: string;
  label: string;
  title: string;
  blurb: string;
  intro: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "books",
    label: "Books",
    title: "Book gift ideas for kids",
    blurb: "Stories to share and keep",
    intro:
      "A good book is a gift that lasts. From soft cloth books for babies to picture books, first readers and chapter books, there is a story to suit every age and interest.",
  },
  {
    slug: "outdoor",
    label: "Outdoor",
    title: "Outdoor gift ideas for kids",
    blurb: "Fresh air, play and adventure",
    intro:
      "Help them get outside and moving. Think garden and sand play, balls and bikes, bug-hunting kits and anything that turns the back garden or park into an adventure.",
  },
  {
    slug: "creative",
    label: "Creative",
    title: "Creative gift ideas for kids",
    blurb: "Art, crafts and pretend play",
    intro:
      "Give their imagination room to grow. Art and craft supplies, dress-up, puppets and music makers let children make something that is all their own.",
  },
  {
    slug: "building",
    label: "Building",
    title: "Building toy gift ideas for kids",
    blurb: "Blocks, bricks and big projects",
    intro:
      "Building toys grow with a child, from big soft blocks for babies to chunky bricks for toddlers and detailed sets for older kids. They build patience and problem-solving too.",
  },
  {
    slug: "educational",
    label: "Educational",
    title: "Educational gift ideas for kids",
    blurb: "Learning that feels like play",
    intro:
      "The best learning toys don't feel like homework. Puzzles, science kits, counting and letter games, and early coding toys make it fun to explore how the world works.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

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
