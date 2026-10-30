# Gift Ideas for Kids

## New direction (decided October 2026) — read this first
The affiliate route is paused: the networks checked don't accept the owner's situation (lives in South Africa, not a South African citizen, no SA ID), and most expect a blog with regular content, which the owner doesn't want to write. The site is being turned into three connected features that don't depend on affiliate programmes:
1. **Gift-finder quiz** (front page): 3-4 questions (child's age, interests, budget) -> a short list of GENERAL gift ideas (e.g. "a balance bike", "a first chapter book series"), not branded products. Claude drafts the ideas; the owner reviews them. No shop links or prices on gift ideas.
2. **Shareable birthday wishlists**: a parent shares one private link to a child's list; items are gift ideas or anything the parent types in (with any shop link they like). Guests tap "I'll buy this" WITHOUT an account (optional first name). Parents see that an item is taken, NOT who took it.
3. **Global directory** of children's gift and party businesses (toy shops, venues, entertainers, cake makers) anywhere in the world: businesses submit a listing, the owner approves it, visitors filter by country and city. Paid listings come later; check what ID the payment provider needs first.
Built so far: the quiz (October 2026), the directory (October 2026; supabase/migrations/004_directory.sql, public page /directory, businesses manage listings at /account/listings with a free account (max 5, text only, no pictures), the owner approves at /account/review, which only accounts in the site_admins table can use; any edit sends a listing back for approval; types: toy & gift shops, party venues & entertainers, cakes & party supplies, classes & activities, other children's products & services) and shareable wishlists (October 2026; supabase/migrations/003_shared_wishlists.sql, private links at /list/<token>, guests reserve through database functions only, no guest names stored because parents never see who reserved, an undo code is kept in the guest's own browser).
Build order: quiz, then wishlists, then directory. The Privacy Policy and Terms were updated for shared wishlists and guest reservations on 30 October 2026 (published without expert review, by the owner's decision); the directory sections were added the same way when the directory was built. The Affiliate Disclosure page was removed on 30 October 2026 (the site has no affiliate links); bring it back from git history if affiliate links return.
The sections below describe the original affiliate plan. Its rules (disclosure, rel="sponsored", no invented products) still apply if affiliate links ever come back. The live site is gifts-for-children-website.vercel.app.

## What this site is
An affiliate website of gift ideas for children aged 0-10. We do NOT sell anything and we do NOT process payments. Each gift card shows an image, name, short description, and a button that sends the visitor to the official retailer's page (via our affiliate link). If they buy there, we earn a commission.

Main goal: rank in search engines for queries like "gift ideas for kids", "toys for 3 year olds", "birthday gifts for a 7 year old girl".

## Audience
Adults (parents, grandparents, aunts/uncles, friends) shopping for children. The site is NOT for children. Never target or collect data from under-18s.

## Brand
- Name: Gift Ideas for Kids
- Look: clean, modern, friendly, lots of white space
- Colours: peach #F4906B (primary), light peach #FFB399 (accent), white #FFFFFF (background), light grey #F3F3F3 (sections/cards), dark grey #4A4A4A (text)
- Font: Nunito (fall back to Poppins, then sans-serif)
- Logo: logo.svg in the repo root (use it in the header and as the favicon source)
- Tone: warm, helpful, simple words

## Pages
Home, Browse by age (0-1, 1-2, 3-4, 5-6, 7-8, 9-10), Browse by category (e.g. books, outdoor, creative, building, educational), Gift detail/search results, About, Contact, Login/Sign up, Account, Privacy Policy, Terms, Affiliate Disclosure (removed October 2026, see New direction).

## Features
1. Gift listings with image, name, age range, category, and an "outbound" affiliate link button.
2. Search and filters (age, category, price range).
3. Accounts: visitors can sign up and log in. Login unlocks saved wishlists/favourites and a gift list per child (see Open questions).
4. Prices shown in the visitor's local currency, based on their country (detect country from the hosting provider's request headers; let the visitor change it manually).
5. SEO-first: fast pages, clean URLs, titles/meta descriptions on every page, sitemap.xml, robots.txt, structured data, descriptive image alt text.

## Rules Claude must follow
- Never invent products, prices, or reviews. Use placeholder data clearly marked "SAMPLE" until real affiliate data is added.
- Every page that shows affiliate links must show a clear affiliate disclosure near the links, and affiliate links must use rel="sponsored nofollow noopener" and open in a new tab.
- Do not copy product images or text from retailers unless the affiliate program's terms allow it. Prefer images supplied by the affiliate network/feed.
- Prices: many affiliate programs only allow showing prices if fetched live from their official feed/API. Do not hard-code real prices. Build a price component that can be fed from an API later.
- Currency: show prices in the visitor's currency, but each retailer sells in specific countries, so link each visitor to a retailer that serves their country.
- Accounts are for adults only. Collect the minimum data (email + password via a trusted auth provider). Never store passwords ourselves.
- Never put secrets (API keys) in the code. Use environment variables and keep .env out of git.
- Mobile-first. Must work well on phones and tablets.
- Accessibility: good colour contrast, alt text, keyboard-friendly.
- Build one page or feature at a time, and explain what changed in plain language after each step.
- Ask before adding paid services or big dependencies.

## Tech choices (proposed, to be confirmed)
- Framework: Next.js (good for SEO), with TypeScript
- Hosting: Vercel. Decided October 2026: the free Hobby plan while the site is a private test with only SAMPLE links. Hobby is for non-commercial use only, so upgrade to Pro (about $20/month) BEFORE adding real affiliate links.
- Accounts + database: Supabase (email login, wishlists table). CONFIRMED October 2026 (see "Accounts plan")
- Styling: Tailwind CSS using the brand colours above
- Analytics: Google Search Console + a privacy-friendly analytics tool

## Accounts plan (decided October 2026)
- Login: email + password through Supabase Auth. Supabase stores passwords (hashed); we never see them.
- Data region: Europe (EU West, Ireland). Supabase has no African region, so the Privacy Policy must say data is stored overseas.
- Child's age: store the age (0-10) plus the date it was saved, and work out the current age from that. No birthday, surname or photo.
- Tables: favourites, children, child_gifts, all protected by row level security so each account sees only its own rows. Schema in supabase/migrations/ (run each file once, in order, in the Supabase SQL Editor). 002 adds delete_my_account(), which deletes the caller's own account and all its data. 003 adds sharing (children.share_token), custom_items and reservations. 004 adds site_admins, listings and review_listing() for the directory.
- Packages: @supabase/supabase-js and @supabase/ssr (approved).
- Emails (sign-up confirmation, password reset) need a separate email-sending service before launch; Supabase's built-in sender is for testing only. Service still to be chosen.
- Build order: 1) Supabase project set up by the owner, 2) sign up / log in / log out / reset password, 3) Account page incl. delete account, 4) favourites, 5) child gift lists, 6) Privacy Policy update and legal review before accounts go public.
- The login cookie is strictly necessary; the Privacy Policy must mention it before launch.
- Owner decision (October 2026): accounts stay switched on when the site goes online, before the Privacy Policy and Terms updates for accounts are approved.

## Open questions
- ~~What should logging in unlock?~~ DECIDED: logging in unlocks
  1. Saved wishlists / favourites (save any gift to come back to later).
  2. A gift list per child: the adult can add one list for each child they shop for, with an optional name and the child's age (0-10). Keep this minimal: no surname, birthday, photo or other details about the child.
- Which affiliate programs will be used (e.g. in South Africa and other countries)?
- ~~Which countries/currencies first?~~ DECIDED (October 2026): United States first (USD), then the United Kingdom (GBP), then South Africa (ZAR), which has few affiliate programmes.
- Will gift data be added by hand, by a spreadsheet, or by a product feed?

## Legal to-do (needs a qualified person to review)
Terms, Cookie notice.
- Affiliate Disclosure: APPROVED (October 2026), then REMOVED from the site on 30 October 2026 because there are no affiliate links. If it comes back, any change to the approved wording must be approved again before it goes live.
- Privacy Policy (POPIA and, for overseas visitors, GDPR): approved 29 October 2026 for the site WITHOUT accounts. On 30 October 2026 the page was updated for accounts, the login cookie, children on gift lists, storage in Ireland and the gift finder, following the reviewer's changes document, and PUBLISHED without a second review by the owner's decision (the reviewer's open questions in that document, e.g. POPIA and children's nicknames/ages, were not answered). Updated again on 30 October 2026, also without review, for shared gift lists and guest reservations (the Terms got a matching "Shared gift lists" section and lost the SAMPLE/affiliate wording). Updated again the same day, also without review, for business listings (the Terms got a matching "Business listings" section).
