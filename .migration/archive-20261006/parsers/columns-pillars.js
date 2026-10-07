/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-pillars.
 * Base block: columns.
 * Source: https://www.abbvie.com/sustainability/environmental-social-and-governance.html
 * Selector: .teaser-h2 + .grid.cmp-grid-custom
 *
 * Three-up grid; each column has an image plus a short bold-labelled paragraph
 * (Patients / Our People and Culture / Business Sustainability).
 * Target: one columns row with three cells, each [image, caption paragraph].
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll('.grid-row__col-with-4.grid-cell, .grid-cell');

  const rowCells = [];
  columns.forEach((col) => {
    const image = col.querySelector('.cmp-image__image, .cmp-image img, img');
    const caption = col.querySelector('.cmp-text p, .cmp-text, .text p');
    const cellContent = [];
    if (image) cellContent.push(image);
    if (caption) cellContent.push(caption);
    if (cellContent.length) rowCells.push(cellContent);
  });

  const cells = [rowCells];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-pillars', cells });
  element.replaceWith(block);
}
