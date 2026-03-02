/* eslint-disable */
/* global WebImporter */

/**
 * Parser: teaser-featured
 * Base block: teaser
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--featured
 * Generated: 2026-02-27
 *
 * Source DOM structure:
 *   .teaser.cmp-teaser--featured
 *     .cmp-teaser
 *       .cmp-teaser__content
 *         p.cmp-teaser__pretitle ("Featured Article")
 *         h2.cmp-teaser__title
 *         .cmp-teaser__description (text)
 *         .cmp-teaser__action-container > a.cmp-teaser__action-link
 *       .cmp-teaser__image > .cmp-image > img
 *
 * Target: Teaser block (local) - 2 columns per row.
 *   Col 1: image
 *   Col 2: pretitle + heading + description + CTA link
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image img');
  const pretitle = element.querySelector('.cmp-teaser__pretitle, p.cmp-teaser__pretitle');
  const heading = element.querySelector('h2.cmp-teaser__title, h1, h2, h3');
  const descEl = element.querySelector('.cmp-teaser__description');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  // Col 1: image
  const imageCell = img ? [img] : [];

  // Col 2: pretitle + heading + description + CTA
  const contentCell = [];
  if (pretitle) contentCell.push(pretitle);
  if (heading) contentCell.push(heading);
  if (descEl) contentCell.push(descEl);
  if (ctaLink) contentCell.push(ctaLink);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'teaser-featured',
    cells,
  });
  element.replaceWith(block);
}
