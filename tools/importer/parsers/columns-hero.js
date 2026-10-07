/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > header.secondary-section .grid-layout.grid-gap-xxl
 * Structure: 1 row, 2 columns — [text (h1, subheading, CTAs)] | [image collage].
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  const children = [...element.querySelectorAll(':scope > div')];

  // Text column: the child containing the heading (fallback: first child)
  const textCol = children.find((c) => c.querySelector('h1, h2, h3')) || children[0];
  // Image column: the other child containing images (fallback: any child with images)
  const imageCol = children.find((c) => c !== textCol && c.querySelector('img'))
    || children.find((c) => c !== textCol);

  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3');
    const subheading = textCol.querySelector('p.subheading, p');
    const ctas = [...textCol.querySelectorAll('.button-group a, a.button')]
      .filter((a, i, arr) => arr.indexOf(a) === i);
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    textCell.push(...ctas);
  }

  const imageCell = imageCol ? [...imageCol.querySelectorAll('img')] : [];

  if (!textCell.length && !imageCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, imageCell.length ? imageCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
