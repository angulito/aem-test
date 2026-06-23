/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base block: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Layout: two-column side-by-side.
 *   Left column  - large 3:2 cover image.
 *   Right column - H2 heading, author byline ("By <name>"), and date/read-time meta.
 *
 * Note: breadcrumbs (.breadcrumbs) are intentionally excluded - they are
 * removed by the cleanup transformer, so we never extract them here.
 */
export default function parse(element, { document }) {
  // The two columns live inside the grid wrapper as direct child <div>s.
  const grid = element.querySelector('.grid-layout') || element;
  const columns = Array.from(grid.querySelectorAll(':scope > div'));

  // Left column: the large image.
  const image = element.querySelector('img.utility-aspect-3x2, .cover-image, img');

  // Right column: heading + byline + meta. Locate the column that holds the heading.
  const heading = element.querySelector('h2, h1, [class*="h2-heading"], [class*="heading"]');

  // Determine which source column is the text column (the one that is not the image column).
  let textColumn = null;
  if (heading) {
    textColumn = columns.find((col) => col.contains(heading)) || null;
  }

  // Build the right-column content, excluding breadcrumbs.
  const rightCell = [];
  if (heading) rightCell.push(heading);

  if (textColumn) {
    // Append the remaining content blocks (byline / meta) that follow the heading,
    // skipping any breadcrumbs element.
    Array.from(textColumn.children).forEach((child) => {
      if (child === heading) return;
      if (child.classList && child.classList.contains('breadcrumbs')) return;
      if (child.querySelector && child.querySelector('.breadcrumbs') === child) return;
      // Skip a child that IS the breadcrumbs container.
      if (child.matches && child.matches('.breadcrumbs')) return;
      rightCell.push(child);
    });
  }

  const leftCell = [];
  if (image) leftCell.push(image);

  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
