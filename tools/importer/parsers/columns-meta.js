/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-meta. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section:nth-of-type(1) .grid-layout.grid-gap-lg
 * Structure: 1 row, 2 columns — [image] | [heading + author/date meta].
 * Breadcrumbs are removed by the cleanup transformer; skipped here defensively too.
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  const children = [...element.querySelectorAll(':scope > div')];

  // Image column: child whose content is an image and has no heading
  const imageCol = children.find((c) => c.querySelector('img') && !c.querySelector('h1, h2, h3, h4'))
    || children[0];
  // Text column: child containing the heading
  const textCol = children.find((c) => c !== imageCol && c.querySelector('h1, h2, h3, h4'))
    || children.find((c) => c !== imageCol);

  const imageCell = [];
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) imageCell.push(img);
  }

  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3, h4');
    if (heading) textCell.push(heading);

    // Meta lines: each .flex-horizontal row of spans becomes one paragraph
    const metaRows = [...textCol.querySelectorAll('.flex-horizontal')]
      .filter((row) => !row.closest('.breadcrumbs'));
    metaRows.forEach((row) => {
      const parts = [...row.querySelectorAll('span')]
        .map((s) => s.textContent.trim())
        .filter(Boolean);
      if (parts.length) {
        const p = document.createElement('p');
        p.textContent = parts.join(' ');
        textCell.push(p);
      }
    });

    // Fallback: plain paragraphs if no flex meta rows exist
    if (!metaRows.length) {
      [...textCol.querySelectorAll('p')]
        .filter((p) => !p.closest('.breadcrumbs'))
        .forEach((p) => textCell.push(p));
    }
  }

  if (!imageCell.length && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[imageCell.length ? imageCell : '', textCell.length ? textCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-meta', cells });
  element.replaceWith(block);
}
