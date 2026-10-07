/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-trip. Base: hero.
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--hero.cmp-teaser--imagebottom)
 * Generated: 2026-09-01
 *
 * Library structure (Hero): 1 column, 3 rows. Row 1 = block name.
 * Row 2 = background image. Row 3 = title (heading) + subheading + CTA.
 */
export default function parse(element, { document }) {
  // Background image.
  const img = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Content: title, description, CTA.
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = element.querySelector('.cmp-teaser__description, p');
  const cta = element.querySelector('.cmp-teaser__action-link, a[href]');

  // Empty-block guard.
  if (!img && !title && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image (single-column cell).
  if (img) cells.push([img]);

  // Row 3: content — all elements in one cell (single-column block).
  const contentCell = [];
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-trip', cells });
  element.replaceWith(block);
}
