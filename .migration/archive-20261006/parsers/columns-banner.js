/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Base block: columns
 * Source: https://www.abbvie.com/patients.html
 * Selector: .container.overlap-predecessor.medium-radius.cmp-container-xx-large
 * Generated: 2026-06-09.
 *
 * Dark colored CTA banner laid out as two columns:
 *   - Left column: heading + supporting paragraph
 *   - Right column: CTA button/link
 * A spacer grid cell (.grid-row__col-with-2) sits between them and is ignored.
 */
export default function parse(element, { document }) {
  // Left column: heading + paragraph (col-with-7 in source, fallback to first content cell)
  const textCol = element.querySelector(
    '.grid-row__col-with-7, .grid-cell:first-child',
  );
  // Right column: CTA button (col-with-3 in source, fallback to a cell containing a link/button)
  const ctaCol = element.querySelector(
    '.grid-row__col-with-3, .grid-cell:last-child',
  );

  // Extract left-column content
  const heading = textCol
    ? textCol.querySelector('.cmp-title__text, h1, h2, h3, h4, h5')
    : element.querySelector('.cmp-title__text, h1, h2, h3, h4, h5');
  const paragraph = textCol
    ? textCol.querySelector('.cmp-text p, p')
    : element.querySelector('.cmp-text p, p');

  // Extract right-column CTA link
  const ctaLink = ctaCol
    ? ctaCol.querySelector('a.cmp-button, .button a, a')
    : element.querySelector('a.cmp-button, .button a');

  // Build left column cell content (heading + paragraph)
  const leftContent = [];
  if (heading) {
    leftContent.push(heading);
  }
  if (paragraph) {
    leftContent.push(paragraph);
  }

  // Build right column cell content (CTA)
  const rightContent = [];
  if (ctaLink) {
    rightContent.push(ctaLink);
  }

  // Columns block: one row, one cell per column (left text, right CTA)
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
