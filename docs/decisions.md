# Latest approved RAYAX decisions

The current product page is the visual baseline. Do not reconstruct already approved parts from conversation history.

- Persian RTL, the nine supplied Estedad FD v7.3 TTF weights, official Phosphor icons and the supplied SVG logo. All assets are in `src/assets`.
- Minimum text size 12px. The earlier one-pass migration was 10→12 and 12→13; do not repeatedly increase already migrated sizes.
- Brand blue #2546F5, light surfaces #F1F5F8 and white, text #2E3344. Added navy accents and dark borders in product content were removed; the reference footer remains dark.
- Desktop header is sticky; the separate Snapp Pay banner scrolls away. Header and main content have the same max width, 1440px, on all pages. Menu weights are 600/700.
- Cart and profile panels open under the main header row, aligned to their own triggers. Mega menu opens under the navigation row.
- Adding a product directly opens the cart. Quantity controls are inside it; sample cap is five per configuration. All key-feature values are right-aligned, including LTR processor names.
- Old struck-through price is above the new price. Comparison is removed. Input focus uses a brand border without outline/offset.
- Product cards use the latest supplied reference: brand upper-left, centered picture, two-line title, category badge and blue price; the whole card opens details.
- Introduction is an authored article with banners, a local 12-second image-montage video and an expandable continuation. The quick-stat strip and visible Apple-site link are removed.
- Reviews have a summary sidebar, score distribution, helpful votes and more-results controls; buyer filter, sorting, sample labels and report controls are removed. Display scores with one yellow star and X/5. The star-rating form requires prototype sign-in.
- Login, prices, inventory, policies and sample reviews are demonstrative; there is no payment or authentication backend. Keep prototype disclosures in sign-in and checkout dialogs; remove helper/demo copy from the product page.
- Mobile: sticky two-row header (menu/logo/account/cart, then full-width search) with Snapp Pay below it. All dialogs are bottom sheets except the fullscreen gallery. The fixed purchase bar switches to configuration-aware quantity controls. Benefits, footer services and related products scroll horizontally without visible scrollbars; product tabs are edge-to-edge. Gallery has a light background and hides the image counter on mobile. One skewed footer rectangle spans its height.

- Product article paragraphs are 14px and justified, using the full article width. FAQ questions are 16px/600 and answers 14px/500. Technical values sit close to their keys and use weight 600. Purchase button is compact, with tighter old/new price spacing. Gallery surfaces are transparent.
- Home page uses the approved shared header/footer, dialogs, product-card styles and mobile navigation. Home-only sections and interactions are in home.html, home.css and 11-home.js. Both standalone and folder previews link home and product pages together.
