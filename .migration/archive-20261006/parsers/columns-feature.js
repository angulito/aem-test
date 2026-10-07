/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-feature
 * Base block: columns
 * Source: https://www.abbvie.com/
 * Selector: .container.cmp-container-xxx-large.default-radius .grid.no-bottom-margin
 * Generated: 2026-06-08
 *
 * Two-column layout: image on left, text content (pretitle, heading, CTA) on right.
 * Standard columns block with side-by-side content.
 */
export default function parse(element, { document }) {
  // Column 1: Image
  const image = element.querySelector('.grid-row__col-with-5 .cmp-image__image, .grid-cell:first-child img');

  // Column 2: Text content (pretitle, heading, CTA)
  const contentCol = element.querySelector('.grid-row__col-with-6, .grid-cell:last-child');

  const pretitle = contentCol ? contentCol.querySelector('.cmp-header__text, .cmp-header span') : null;
  const heading = contentCol ? contentCol.querySelector('.cmp-title__text, h3, h2, h4') : null;
  const ctaLink = contentCol ? contentCol.querySelector('.cmp-button, a.cmp-button, .button a') : null;

  // Build column 1 content (image)
  const col1Content = [];
  if (image) {
    col1Content.push(image);
  }

  // Build column 2 content (pretitle + heading + CTA)
  const col2Content = [];
  if (pretitle) {
    col2Content.push(pretitle);
  }
  if (heading) {
    col2Content.push(heading);
  }
  if (ctaLink) {
    col2Content.push(ctaLink);
  }

  // Columns block: one row with each column as a separate cell
  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
