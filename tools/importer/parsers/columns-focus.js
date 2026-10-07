/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-focus
 * Base block: columns
 * Source: https://www.abbvie.com/science.html
 * Selector: .grid.cmp-grid-meganav (science page section 3 — ".grid.no-bottom-margin")
 * Generated: 2026-06-10
 *
 * Text-led columns layout (no large image): a text column (eyebrow + heading +
 * paragraph) beside two side-by-side columns of therapeutic-area link lists.
 *
 * Columns convention: the first row's cells map 1:1 to rendered columns. We emit
 * one content row with three cells (text column + link-list column + link-list
 * column), which the decorator renders as `columns-focus-3-cols`.
 */
export default function parse(element, { document }) {
  // Eyebrow / pretitle (e.g. "priorities")
  const eyebrow = element.querySelector('.cmp-header__text, .cmp-header span, .eyebrow');

  // Heading (e.g. "Core focus areas")
  const heading = element.querySelector('.cmp-title__text, h2, h3, h4');

  // Supporting paragraph — the text body that sits beside the link lists.
  // Prefer the inner <p>; fall back to the text wrapper, then any paragraph.
  const paragraph = element.querySelector('.cmp-text p')
    || element.querySelector('.cmp-text')
    || element.querySelector('p');

  // The two therapeutic-area link lists (each a ul.cmp-list)
  const lists = Array.from(element.querySelectorAll('.linklist .cmp-list, ul.cmp-list'));

  // Build the text column (eyebrow + heading + paragraph)
  const textCol = [];
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textCol.push(p);
  }
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCol.push(h);
  }
  if (paragraph) {
    textCol.push(paragraph);
  }

  // Build a clean link-list column from a source ul.cmp-list, keeping only the
  // anchor titles (dropping decorative icon/arrow spans and list nav controls).
  const buildListColumn = (sourceList) => {
    const ul = document.createElement('ul');
    sourceList.querySelectorAll(':scope > li').forEach((li) => {
      const link = li.querySelector('a[href]');
      if (!link) return;
      const titleEl = link.querySelector('.cmp-list__item-title');
      const title = (titleEl ? titleEl.textContent : link.textContent).trim();
      if (!title) return;
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = title;
      const item = document.createElement('li');
      item.append(a);
      ul.append(item);
    });
    return ul;
  };

  // Assemble the columns: text column followed by each link-list column.
  const columns = [];
  if (textCol.length) {
    columns.push(textCol);
  }
  lists.forEach((list) => {
    const col = buildListColumn(list);
    if (col.children.length) {
      columns.push(col);
    }
  });

  // Single content row; each entry is a rendered column.
  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-focus', cells });
  element.replaceWith(block);
}
