// The business directory (see supabase/migrations/004_directory.sql).
import { isCountryCode } from "@/lib/countries";
import { normaliseUrl } from "@/lib/wishlists";

export const LISTING_KINDS = [
  { slug: "shops", label: "Toy & gift shops" },
  { slug: "parties", label: "Party venues & entertainers" },
  { slug: "cakes", label: "Cakes & party supplies" },
  { slug: "classes", label: "Classes & activities" },
  { slug: "other", label: "Other children's products & services" },
] as const;

export type ListingKind = (typeof LISTING_KINDS)[number]["slug"];
export type ListingStatus = "pending" | "approved" | "rejected";

export const kindLabel = (slug: string) => LISTING_KINDS.find((kind) => kind.slug === slug)?.label ?? slug;
export const isListingKind = (slug: string): slug is ListingKind => LISTING_KINDS.some((kind) => kind.slug === slug);

// What visitors see (and all a guest is allowed to read).
export type Listing = {
  id: string;
  name: string;
  kind: ListingKind;
  description: string;
  country: string;
  city: string;
  website: string | null;
  email: string | null;
  phone: string | null;
};

// What the business (and the site owner) also see.
export type OwnListing = Listing & { status: ListingStatus; review_note: string | null; updated_at: string };

export const LISTING_FIELDS = "id, name, kind, description, country, city, website, email, phone";
export const OWN_LISTING_FIELDS = `${LISTING_FIELDS}, status, review_note, updated_at`;

export const NAME_MAX_LENGTH = 80;
export const DESCRIPTION_MAX_LENGTH = 300;
export const CITY_MAX_LENGTH = 60;
export const WEBSITE_MAX_LENGTH = 500;
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MAX_LENGTH = 30;
export const REVIEW_NOTE_MAX_LENGTH = 300;
export const MAX_LISTINGS = 5;

export const STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "Waiting for approval",
  approved: "Live in the directory",
  rejected: "Not approved",
};

// "  cape   town " -> "cape town"
export const tidyCity = (city: string) => city.trim().replace(/\s+/g, " ");

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^\+?[0-9 ()-]{6,30}$/;

type ListingFields = Omit<Listing, "id">;

// Checks a submitted listing form. The database checks the same rules again.
export function readListingFields(formData: FormData): ListingFields | { error: string } {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const name = text("name");
  const kind = text("kind");
  const description = text("description").replace(/\s+/g, " ");
  const country = text("country");
  const city = tidyCity(text("city"));
  const website = normaliseUrl(text("website"));
  const email = text("email");
  const phone = text("phone").replace(/\s+/g, " ");

  if (!name) return { error: "Please enter the name of the business." };
  if (name.length > NAME_MAX_LENGTH) return { error: `Please keep the name to ${NAME_MAX_LENGTH} characters or fewer.` };
  if (!isListingKind(kind)) return { error: "Please choose the type of business." };
  if (!description) return { error: "Please describe the business in a sentence or two." };
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return { error: `Please keep the description to ${DESCRIPTION_MAX_LENGTH} characters or fewer.` };
  }
  if (!isCountryCode(country)) return { error: "Please choose a country." };
  if (!city) return { error: "Please enter the city or town." };
  if (city.length > CITY_MAX_LENGTH) return { error: `Please keep the city to ${CITY_MAX_LENGTH} characters or fewer.` };
  if (website === undefined || (website && website.length > WEBSITE_MAX_LENGTH)) {
    return { error: "That website address doesn't look right. Please check it, or leave it empty." };
  }
  if (email && (email.length > EMAIL_MAX_LENGTH || !EMAIL.test(email))) {
    return { error: "That email address doesn't look right. Please check it, or leave it empty." };
  }
  if (phone && !PHONE.test(phone)) {
    return { error: "Please enter the phone number using only numbers, spaces, brackets, dashes and a + at the start." };
  }
  if (!website && !email && !phone) return { error: "Please add at least one way to contact the business." };
  if (formData.get("confirm") !== "on") {
    return { error: "Please confirm that the business is suitable for the directory." };
  }

  return { name, kind, description, country, city, website, email: email || null, phone: phone || null };
}
