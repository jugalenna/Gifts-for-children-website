// Shareable wishlists (see supabase/migrations/003_shared_wishlists.sql).

export type CustomItem = {
  id: string;
  title: string;
  url: string | null;
  note: string | null;
};

// What a guest sees on a shared list (from get_shared_list).
export type SharedList = {
  nickname: string | null;
  age: number;
  age_recorded_on: string;
  gift_ids: string[];
  custom_items: CustomItem[];
  reserved: string[];
};

export const CUSTOM_ITEM_FIELDS = "id, title, url, note";
export const TITLE_MAX_LENGTH = 100;
export const URL_MAX_LENGTH = 500;
export const NOTE_MAX_LENGTH = 200;
export const MAX_CUSTOM_ITEMS = 50;

// Reservations name items as "gift:<gift idea id>" or "custom:<custom item id>".
export const giftKey = (giftId: string) => `gift:${giftId}`;
export const customKey = (itemId: string) => `custom:${itemId}`;

export const sharePath = (token: string) => `/list/${token}`;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: string) => UUID.test(value);

// Accept "www.shop.com/item" as well as full addresses; only web links are allowed.
export function normaliseUrl(input: string): string | null | undefined {
  const value = input.trim();
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
