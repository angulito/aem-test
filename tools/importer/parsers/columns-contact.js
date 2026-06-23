/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base block: columns.
 * Source: https://www.wknd-trendsetters.site/faq
 * Generated: 2026-06-10
 *
 * Layout: "Let's connect" two-column contact section.
 *   Column 1 - H2 heading ("Let's connect") + intro paragraph.
 *   Column 2 - .contact-items container with three labeled contact groups:
 *              Email (mailto:hello@fashionblog.com), Phone (tel:+15551239876),
 *              Address (101 Trend Ave, SF, CA). Each group = h3 label + value.
 *
 * Produces a `columns` block with a single content row whose cells are the
 * columns, matching the project's columns decorator
 * (`block.firstElementChild.children` = the columns of one row).
 * mailto:/tel: links and all headings are preserved as semantic HTML.
 */
export default function parse(element, { document }) {
  // Columns are the direct child <div>s of the grid layout.
  // Validated against source.html: section > .container > .grid-layout > div + div
  const grid = element.querySelector('.grid-layout')
    || element.querySelector('.container')
    || element;
  let columns = Array.from(grid.querySelectorAll(':scope > div'));
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // The contact-items container marks the contact-details column.
  const contactItems = element.querySelector('.contact-items');

  // Build one cell per column, preserving semantic HTML in source order.
  const columnCells = columns.map((col) => {
    // Contact-details column: keep the full .contact-items group intact.
    if (contactItems && col.contains(contactItems)) {
      return [contactItems];
    }
    // Text column: keep all direct child content (heading + intro paragraph).
    const childContent = Array.from(col.children);
    if (childContent.length > 0) return childContent;
    return Array.from(col.childNodes);
  });

  // The columns block expects all column cells within a single row.
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
