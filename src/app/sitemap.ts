import type { MetadataRoute } from "next";
import { AGE_GROUPS, CATEGORIES, absoluteUrl } from "@/lib/site";

/*
 * Every page we want search engines to find. Add new pages here when they are
 * built (e.g. /privacy, /terms). Search results (/search) are left out on
 * purpose because those pages are marked noindex.
 */
const PAGES = ["/", "/age", "/category", "/about", "/contact", "/affiliate-disclosure"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...PAGES,
    ...AGE_GROUPS.map((group) => `/age/${group.slug}`),
    ...CATEGORIES.map((category) => `/category/${category.slug}`),
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
