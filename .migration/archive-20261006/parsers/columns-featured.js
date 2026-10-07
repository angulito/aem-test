/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html (.teaser.cmp-teaser--featured)
 * Generated: 2026-09-01
 *
 * Library structure (Columns): first row = block name; subsequent row has one
 * cell per visual column. This featured teaser is a side-by-side layout:
 * image (left column) + text content (right column: pretitle, title,
 * description, CTA).
 */
export default function parse(element, { document }) {
  // Left column: the teaser image.
  const img = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Right column: text content.
  const textCol = [];
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, a[href]');

  if (pretitle) textCol.push(pretitle);
  if (title) textCol.push(title);
  if (description) textCol.push(description);
  if (cta) textCol.push(cta);

  // Empty-block guard.
  if (!img && !textCol.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [img || '', textCol.length ? textCol : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
