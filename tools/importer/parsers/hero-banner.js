/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner.
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/ (section.section.inverse-section)
 * Generated: 2026-06-03
 *
 * Source structure: full-bleed closing CTA banner.
 *  - img.cover-image.utility-overlay  -> full-bleed background image
 *  - div.overlay                      -> dark overlay (presentational, not extracted)
 *  - div.card-body.utility-text-on-overlay:
 *      h2.h1-heading                  -> overlaid white heading
 *      p.subheading                   -> subheading paragraph
 *      div.button-group > a.button    -> single "See more" CTA
 *
 * Output: hero block. Row 1 = background image. Row 2 = heading + subheading + CTA(s).
 * Handles variations: background as <img> or CSS background, single/multiple CTAs,
 * heading level h1/h2, missing subheading.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — selectors validated against the inverse-section source HTML

  // Background image: prefer the overlay/cover image; fall back to first <img>.
  let bgImage = element.querySelector(
    'img.cover-image.utility-overlay, img.utility-overlay, img.cover-image, img[class*="cover"]',
  ) || element.querySelector('img');

  // Fallback: capture a CSS background-image if no <img> is present.
  if (!bgImage) {
    const bgEl = Array.from(element.querySelectorAll('*')).find((el) => {
      const bg = el.style && el.style.backgroundImage;
      return bg && bg !== 'none' && /url\(/i.test(bg);
    });
    if (bgEl) {
      const match = bgEl.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/i);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        bgImage = img;
      }
    }
  }

  // Overlaid text content.
  const heading = element.querySelector(
    '.card-body h1, .card-body h2, h1.h1-heading, h1, h2.h1-heading, h2, [class*="heading"]',
  );
  const subheading = element.querySelector('.card-body p.subheading, .subheading, .card-body p, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 1 (optional): full-bleed background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: single content cell — heading, subheading, CTA(s) stacked (block-library order)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaLinks.length) contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
