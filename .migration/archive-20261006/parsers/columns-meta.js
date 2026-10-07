/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-meta. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column layout):
 *   - Left column: cover image
 *   - Right column: breadcrumbs, heading, author/meta details
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Left/media column: the child that holds the cover image.
  const mediaCol = columns.find((c) => c.querySelector('img.cover-image, img[class*="cover"]'))
    || columns[0];
  // Right/content column: the other child (breadcrumbs, heading, meta).
  const contentCol = columns.find((c) => c !== mediaCol && c.querySelector('h1, h2, h3, [class*="heading"]'))
    || columns.find((c) => c !== mediaCol)
    || columns[1];

  const leftCell = [];
  if (mediaCol) {
    const img = mediaCol.querySelector('img.cover-image, img[class*="cover"], img');
    if (img) leftCell.push(img);
  }

  const rightCell = [];
  if (contentCol) {
    const breadcrumbs = contentCol.querySelector('.breadcrumbs');
    const heading = contentCol.querySelector('h1, h2, h3, [class*="heading"]');
    if (breadcrumbs) rightCell.push(breadcrumbs);
    if (heading) rightCell.push(heading);
    // Author / date / read-time meta blocks (siblings after the heading).
    Array.from(contentCol.querySelectorAll(':scope > div')).forEach((div) => {
      if (div !== breadcrumbs && !div.contains(heading)) rightCell.push(div);
    });
  }

  // Empty-block guard.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-meta', cells });
  element.replaceWith(block);
}
