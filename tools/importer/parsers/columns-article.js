/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-article
 * Base block: columns
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section:nth-of-type(1) .grid-layout.grid-gap-lg
 * Description: Two-column layout with image on left, article metadata (breadcrumbs, heading, author byline) on right.
 * Generated: 2026-06-08
 */
export default function parse(element, { document }) {
  // Column 1: Cover image
  const image = element.querySelector(':scope > div:first-child img.cover-image, :scope > div:first-child img');

  // Column 2: Article metadata content
  const contentDiv = element.querySelector(':scope > div:nth-child(2)');

  // Build column 1 cell
  const col1 = [];
  if (image) {
    col1.push(image);
  }

  // Build column 2 cell
  const col2 = [];
  if (contentDiv) {
    // Breadcrumbs
    const breadcrumbs = contentDiv.querySelector('.breadcrumbs');
    if (breadcrumbs) {
      col2.push(breadcrumbs);
    }

    // Heading
    const heading = contentDiv.querySelector('h2.h2-heading, h2, h1, h3');
    if (heading) {
      col2.push(heading);
    }

    // Author/date metadata - all remaining content divs after breadcrumbs and heading
    const metaDivs = contentDiv.querySelectorAll(':scope > div:not(.breadcrumbs)');
    metaDivs.forEach((metaDiv) => {
      // Skip empty divs, only include those with actual text content
      if (metaDiv.textContent.trim() && !metaDiv.querySelector('h1, h2, h3')) {
        col2.push(metaDiv);
      }
    });
  }

  // Build cells: one row with two columns
  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
