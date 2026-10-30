/*
 * General gift ideas (kinds of gift, not branded products), so no shop links
 * or prices. Drafted by Claude for the owner to review (see CLAUDE.md "New
 * direction"). Ids are stored in saved gifts and lists, so never change an id;
 * add a new idea instead.
 */

export type GiftSize = "small" | "medium" | "big";

export type GiftIdea = {
  id: string;
  name: string;
  description: string;
  ageGroups: string[]; // age group slugs, e.g. ["3-4", "5-6"]
  category: string; // a category label, e.g. "Books"
  size: GiftSize;
};

export const GIFT_SIZES: { value: GiftSize; label: string; hint: string }[] = [
  { value: "small", label: "Small gift", hint: "A little something or a party present" },
  { value: "medium", label: "Medium gift", hint: "A good birthday present" },
  { value: "big", label: "Big gift", hint: "A special present, or one to share" },
];

function idea(
  id: string,
  name: string,
  description: string,
  ageGroups: string[],
  category: string,
  size: GiftSize,
): GiftIdea {
  return { id, name, description, ageGroups, category, size };
}

export const GIFT_IDEAS: GiftIdea[] = [
  // Babies
  idea("cloth-crinkle-book", "Soft cloth or crinkle book", "Soft pages to touch, scrunch and chew, with bold pictures babies love to look at.", ["0-1"], "Books", "small"),
  idea("board-books", "A set of sturdy board books", "Thick pages that little hands can turn, with simple words and bright pictures to share.", ["0-1", "1-2"], "Books", "small"),
  idea("stacking-cups", "Stacking and nesting cups", "Stack them, nest them, knock them down. Great in the bath and the sandpit too.", ["0-1", "1-2"], "Educational", "small"),
  idea("soft-blocks", "Soft fabric building blocks", "Squishy first blocks for stacking and tumbling, with no hard edges.", ["0-1"], "Building", "medium"),
  idea("play-gym", "Baby play gym", "A soft mat with hanging toys to reach for, kick at and look up at during tummy time.", ["0-1"], "Educational", "big"),
  idea("baby-instruments", "Baby-safe musical instruments", "Shakers, a small drum or a xylophone made for little hands. Expect a happy noise.", ["0-1", "1-2"], "Creative", "medium"),
  idea("bath-toys", "Bath toys that pour and float", "Cups, boats and floating friends that make bath time more fun.", ["0-1", "1-2"], "Educational", "small"),
  idea("push-walker", "A sturdy push-along walker", "Something steady to hold while finding their feet. Choose one with a wide, stable base.", ["0-1", "1-2"], "Outdoor", "medium"),

  // Toddlers
  idea("shape-sorter", "Shape sorter", "Matching shapes to holes builds hand skills and patience, and it's very satisfying.", ["1-2"], "Educational", "small"),
  idea("chunky-crayons", "Chunky crayons and a big drawing pad", "Easy-grip crayons for first scribbles. Washable ones are kind to walls and parents.", ["1-2", "3-4"], "Creative", "small"),
  idea("ride-on-toy", "A sit-on ride-on toy", "Pushed along by little feet, indoors or out. A favourite for busy toddlers.", ["1-2"], "Outdoor", "big"),
  idea("big-bricks", "Big building bricks", "Large bricks that are easy to press together and too big to swallow.", ["1-2", "3-4"], "Building", "medium"),
  idea("lift-the-flap-books", "Lift-the-flap books", "Peekaboo surprises on every page keep toddlers turning and guessing.", ["1-2", "3-4"], "Books", "small"),
  idea("pull-along-toy", "A pull-along toy", "A friendly animal or cart on a string to take along on every walk round the house.", ["1-2"], "Outdoor", "small"),
  idea("tea-set", "A toy tea set or play food", "For tea parties, picnics and pretend cafés. Toddlers love to copy grown-ups.", ["1-2", "3-4"], "Creative", "medium"),
  idea("sand-toys", "Bucket, spade and sand toys", "For the beach, the sandpit or the garden. Simple, cheap and played with for years.", ["1-2", "3-4"], "Outdoor", "small"),

  // Pre-schoolers
  idea("dress-up-box", "A dress-up box", "Costumes, hats and capes for becoming anyone they like. Add a few of your old scarves too.", ["3-4", "5-6"], "Creative", "medium"),
  idea("play-kitchen", "A play kitchen", "Hours of cooking, serving and pretend shopping. A gift the whole family can share.", ["3-4", "5-6"], "Creative", "big"),
  idea("balance-bike", "A balance bike (with a helmet)", "No pedals, just balance. A gentle way to get ready for a real bike.", ["3-4"], "Outdoor", "big"),
  idea("chunky-jigsaws", "Chunky jigsaw puzzles", "Puzzles with 12 to 24 big pieces build patience and problem-solving.", ["3-4"], "Educational", "small"),
  idea("picture-books", "Picture books to read together", "Funny, gentle or adventurous stories for bedtime and cuddles on the sofa.", ["3-4", "5-6"], "Books", "small"),
  idea("magnetic-tiles", "Magnetic building tiles", "Flat tiles that click together into towers, houses and rockets. Loved for years.", ["3-4", "5-6", "7-8"], "Building", "big"),
  idea("wooden-train-set", "A wooden train set", "Tracks to build, bridges to cross and trains to push. Easy to add to over time.", ["3-4"], "Building", "big"),
  idea("modelling-dough", "Modelling dough set", "Squish, roll and cut out shapes. Comes with tools for making pretend food and animals.", ["3-4", "5-6"], "Creative", "small"),
  idea("puppet-theatre", "Puppets or a puppet theatre", "For putting on shows and telling their own stories to anyone who will watch.", ["3-4", "5-6"], "Creative", "medium"),

  // Ages 5 to 6
  idea("early-readers", "Early reader books", "Short, simple stories for children just starting to read by themselves.", ["5-6"], "Books", "small"),
  idea("craft-kit", "An arts and crafts kit", "Paints, stickers, glitter and card for making things to keep or give away.", ["5-6", "7-8"], "Creative", "medium"),
  idea("scooter", "A scooter (with a helmet)", "Fast, fun and good for getting to the park. Check the height suits the child.", ["5-6", "7-8"], "Outdoor", "big"),
  idea("family-board-game", "A simple family board game", "Games with short rules teach taking turns and how to win and lose kindly.", ["5-6", "7-8"], "Educational", "medium"),
  idea("starter-construction-set", "A beginner construction set", "Nuts, bolts and pieces for building cars and cranes that really move.", ["5-6"], "Building", "medium"),
  idea("bug-hunting-kit", "A bug-hunting kit", "A magnifying glass, a bug box and a field guide for exploring the garden.", ["5-6", "7-8"], "Outdoor", "small"),
  idea("atlas-or-globe", "A children's atlas or globe", "Find where family lives, where animals come from and where to go one day.", ["5-6", "7-8", "9-10"], "Educational", "medium"),
  idea("first-pedal-bike", "A first pedal bike (with a helmet)", "A big moment. Choose the right wheel size for their height.", ["5-6", "7-8"], "Outdoor", "big"),
  idea("marble-run", "A marble run", "Build the track, drop the marble, then build it differently. Contains small parts.", ["5-6", "7-8"], "Building", "medium"),

  // Ages 7 to 8
  idea("chapter-books", "The first books in a chapter book series", "An exciting series keeps confident readers coming back for the next one.", ["7-8", "9-10"], "Books", "small"),
  idea("science-kit", "A science experiment kit", "Safe experiments with crystals, slime or volcanoes to do at home with a grown-up.", ["7-8", "9-10"], "Educational", "medium"),
  idea("detailed-building-set", "A detailed building set", "A bigger set with instructions to follow, then rebuild into their own designs.", ["7-8", "9-10"], "Building", "big"),
  idea("sketching-set", "A drawing and sketching set", "Proper pencils, pens and a sketchbook for budding artists.", ["7-8", "9-10"], "Creative", "medium"),
  idea("card-or-strategy-game", "A card or strategy game", "Games that need a bit of thinking ahead. Good for family evenings.", ["7-8", "9-10"], "Educational", "small"),
  idea("kite", "A kite", "A breezy day, an open field and a kite. Simple outdoor fun.", ["5-6", "7-8", "9-10"], "Outdoor", "small"),
  idea("binoculars", "Binoculars for nature spotting", "Kid-sized binoculars for birds, wildlife and spying on the neighbours' cat.", ["7-8", "9-10"], "Outdoor", "medium"),

  // Ages 9 to 10
  idea("boxed-book-series", "A boxed set of a book series", "A whole series in one box, for readers who finish a book in a weekend.", ["9-10"], "Books", "medium"),
  idea("coding-kit", "A beginner coding robot or kit", "Learn to code by making a robot move, light up or solve a maze.", ["9-10"], "Educational", "big"),
  idea("model-kit", "A model-making kit", "Build a model car, plane or ship step by step. Some need glue and paint.", ["9-10"], "Building", "medium"),
  idea("sports-kit", "Kit for a sport they love", "A ball, racket, gloves or boots for the sport they're keen on right now.", ["9-10"], "Outdoor", "medium"),
  idea("hobby-craft-kit", "A hobby craft kit", "Jewellery making, sewing, knitting or weaving. A new skill to be proud of.", ["9-10"], "Creative", "medium"),
  idea("journal-and-pens", "A journal with nice pens", "For writing stories, keeping a diary or drawing comics.", ["9-10"], "Creative", "small"),
  idea("big-jigsaw", "A challenging jigsaw puzzle", "A 300 to 500 piece puzzle to work on over a few rainy afternoons.", ["9-10"], "Educational", "small"),
];

export function getGiftsForAge(ageSlug: string): GiftIdea[] {
  return GIFT_IDEAS.filter((gift) => gift.ageGroups.includes(ageSlug));
}

export function getGiftsForCategory(categoryLabel: string): GiftIdea[] {
  return GIFT_IDEAS.filter((gift) => gift.category === categoryLabel);
}

// Gifts in the order given; ids no longer in the list are skipped.
export function getGiftsByIds(ids: string[]): GiftIdea[] {
  return ids.flatMap((id) => GIFT_IDEAS.find((gift) => gift.id === id) ?? []);
}

// "Ages 3–6", from the gift's age groups.
export function ageRangeLabel(gift: GiftIdea): string {
  const bounds = gift.ageGroups.flatMap((slug) => slug.split("-").map(Number));
  return `Ages ${Math.min(...bounds)}–${Math.max(...bounds)}`;
}

export function sizeLabel(size: GiftSize): string {
  return GIFT_SIZES.find((option) => option.value === size)?.label ?? size;
}

// A spread of ideas for the home page: two from each age group.
export function featuredGifts(): GiftIdea[] {
  const ids = [
    "cloth-crinkle-book", "stacking-cups", "big-bricks", "tea-set",
    "dress-up-box", "magnetic-tiles", "craft-kit", "bug-hunting-kit",
    "science-kit", "kite", "coding-kit", "journal-and-pens",
  ];
  return getGiftsByIds(ids);
}
