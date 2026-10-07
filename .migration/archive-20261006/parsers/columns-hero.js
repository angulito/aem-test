/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column layout):
 *   - Left column: heading + subheading + CTA buttons
 *   - Right column: cover images
 */
export default function parse(element, { document }) {
  // The block is a grid-layout with two direct children: a text column and an image column.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Left/content column: heading, subheading, buttons.
  const contentCol = columns[0];
  // Right/media column: the group that contains the cover images.
  const mediaCol = columns.find((c) => c.querySelector('img')) || columns[1];

  const leftCell = [];
  if (contentCol) {
    const heading = contentCol.querySelector('h1, h2, [class*="heading"]');
    const subheading = contentCol.querySelector('p, .subheading, [class*="subheading"]');
    const buttonGroup = contentCol.querySelector('.button-group');
    if (heading) leftCell.push(heading);
    if (subheading) leftCell.push(subheading);
    if (buttonGroup) {
      leftCell.push(buttonGroup);
    } else {
      leftCell.push(...contentCol.querySelectorAll('a.button, a[class*="button"]'));
    }
  }

  const rightCell = [];
  if (mediaCol) {
    rightCell.push(...mediaCol.querySelectorAll('img'));
  }

  // Empty-block guard.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
