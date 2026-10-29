/*
 * SAMPLE data only. These are not real products: names, descriptions and
 * links are placeholders until real affiliate feed data is added.
 * Prices are deliberately left out (see components/Price.tsx).
 */

export type Gift = {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  affiliateUrl: string;
  retailer: string;
  isSample: boolean;
};

const SAMPLE_IMAGE = "/sample-gift.svg";
const SAMPLE_LINK = "https://example.com/sample-retailer";
const SAMPLE_RETAILER = "Sample retailer";

function sample(
  id: string,
  name: string,
  description: string,
  ageRange: string,
  category: string,
): Gift {
  return {
    id,
    name,
    description,
    ageRange,
    category,
    imageUrl: SAMPLE_IMAGE,
    imageAlt: `Placeholder image for the sample gift: ${name}`,
    affiliateUrl: SAMPLE_LINK,
    retailer: SAMPLE_RETAILER,
    isSample: true,
  };
}

export const SAMPLE_GIFTS: Gift[] = [
  sample("sample-1", "Soft fabric activity book", "A placeholder for a crinkly, touch-and-feel book for babies.", "0-1", "Books"),
  sample("sample-2", "Wooden stacking rings", "A placeholder for a simple stacking toy that builds hand skills.", "1-2", "Educational"),
  sample("sample-3", "Dress-up costume set", "A placeholder for a costume box that sparks pretend play.", "3-4", "Creative"),
  sample("sample-4", "Chunky building blocks", "A placeholder for a big-brick building set for small builders.", "3-4", "Building"),
  sample("sample-5", "Junior art kit", "A placeholder for crayons, paints and paper in one handy case.", "5-6", "Creative"),
  sample("sample-6", "Kids' garden tool set", "A placeholder for child-sized tools for digging and planting.", "5-6", "Outdoor"),
  sample("sample-7", "Science experiment kit", "A placeholder for safe, simple experiments to do at home.", "7-8", "Educational"),
  sample("sample-8", "Illustrated adventure book", "A placeholder for an exciting chapter book for confident readers.", "9-10", "Books"),
];
