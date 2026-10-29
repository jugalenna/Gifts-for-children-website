import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Search engines may visit every page. Search result pages stay crawlable so
// search engines can see their "noindex" tag and leave them out of results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
