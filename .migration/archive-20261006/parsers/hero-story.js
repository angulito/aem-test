/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-story. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (1-column hero, 3 rows total):
 *   - Row 1: block name (added by createBlock)
 *   - Row 2: background image (optional)
 *   - Row 3: content cell — title + subheading + CTA
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const buttonGroup = element.querySelector('.button-group');

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single cell), only if present.
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single cell holding all text/CTA elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (buttonGroup) {
    contentCell.push(buttonGroup);
  } else {
    contentCell.push(...element.querySelectorAll('a.button, a[class*="button"]'));
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-story', cells });
  element.replaceWith(block);
}
