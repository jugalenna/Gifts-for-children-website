/*
 * Shows a gift's price. Real prices must come live from the affiliate
 * network's feed/API, so nothing is hard-coded: until a price is passed in,
 * the visitor is told to check the price at the retailer.
 */

export type LivePrice = {
  amount: number;
  currency: string; // ISO 4217 code, e.g. "ZAR"
};

type PriceProps = {
  price?: LivePrice;
  retailer: string;
  locale?: string;
};

export function Price({ price, retailer, locale }: PriceProps) {
  if (!price) {
    return <p className="text-sm">Check the price at {retailer}</p>;
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);

  return <p className="text-lg font-bold">{formatted}</p>;
}
