/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro.
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/ (header.section.secondary-section)
 * Generated: 2026-06-03
 *
 * Source structure: a two-part grid inside the header.
 *  - Content column: h1.h1-heading, p.subheading, div.button-group > a.button (x2)
 *  - Image column: div.grid-layout > img.cover-image (x3 grouped cover images / banner)
 *
 * Output: hero block. Row 1 = grouped banner images. Row 2 = heading + subheading + CTAs.
 * Handles variations: missing images, single/multiple CTAs, heading level h1/h2.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — selectors validated against source.html
  const heading = element.querySelector('h1.h1-heading, h1, h2.h2-heading, h2, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, .subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const coverImages = Array.from(element.querySelectorAll('img.cover-image, img[class*="cover"]'));

  const cells = [];

  // Row 1 (optional): grouped banner cover images
  if (coverImages.length) {
    cells.push([coverImages]);
  }

  // Row 2: single content cell — heading, subheading, CTAs stacked (block-library order)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaLinks.length) contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
