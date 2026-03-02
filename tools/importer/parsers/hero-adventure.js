/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-adventure
 * Base block: hero
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--hero.cmp-teaser--imagebottom
 * Generated: 2026-02-27
 *
 * Source DOM structure:
 *   .teaser.cmp-teaser--hero.cmp-teaser--imagebottom
 *     .cmp-teaser
 *       .cmp-teaser__content
 *         h2.cmp-teaser__title
 *         .cmp-teaser__description (text)
 *         .cmp-teaser__action-container > a.cmp-teaser__action-link
 *       .cmp-teaser__image > .cmp-image > img
 *
 * Target: Hero block - 1 column, 2 rows.
 *   Row 1: background image (optional)
 *   Row 2: heading + description + CTA link
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image img');
  const heading = element.querySelector('h2.cmp-teaser__title, h1, h2, h3');
  const descEl = element.querySelector('.cmp-teaser__description');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  const cells = [];

  // Row 1: background image
  if (img) {
    cells.push([img]);
  }

  // Row 2: single cell with heading + description + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (descEl) contentCell.push(descEl);
  if (ctaLink) contentCell.push(ctaLink);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-adventure',
    cells,
  });
  element.replaceWith(block);
}
