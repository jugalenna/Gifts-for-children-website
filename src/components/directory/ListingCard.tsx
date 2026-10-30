import { countryName } from "@/lib/countries";
import { kindLabel, type Listing } from "@/lib/directory";

const linkClass = "font-semibold text-peach-dark underline underline-offset-4 break-all";

// "https://www.toybox.co.za/shop" -> "toybox.co.za"
function siteLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// A business's details, as shown in the directory.
export function ListingDetails({ listing, headingLevel = 2 }: { listing: Listing; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <>
      <Heading className="text-xl font-extrabold leading-snug break-words">{listing.name}</Heading>
      <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-white px-2 py-1">{kindLabel(listing.kind)}</span>
        <span className="rounded-full bg-white px-2 py-1">
          {listing.city}, {countryName(listing.country)}
        </span>
      </p>
      <p className="mt-3 break-words">{listing.description}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {listing.website && (
          <li>
            {/* Added by the business. We check listings, but not every page they link to. */}
            <a href={listing.website} target="_blank" rel="nofollow ugc noopener" className={linkClass}>
              {siteLabel(listing.website)}
              <span className="sr-only"> (website, opens in a new tab)</span>
            </a>
          </li>
        )}
        {listing.email && (
          <li>
            <a href={`mailto:${listing.email}`} className={linkClass}>
              {listing.email}
            </a>
          </li>
        )}
        {listing.phone && (
          <li>
            <a href={`tel:${listing.phone.replace(/[^0-9+]/g, "")}`} className={linkClass}>
              {listing.phone}
            </a>
          </li>
        )}
      </ul>
    </>
  );
}
