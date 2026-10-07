/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery
 * Base block: cards
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-08
 *
 * Source structure: A grid container (div.grid-layout.desktop-4-column) containing
 * child divs (div.utility-aspect-1x1), each with a single cover image.
 * This is a pure image gallery variant — no text, headings, or CTAs per card.
 *
 * Target structure: One row per card, each row containing just the image element.
 */
export default function parse(element, { document }) {
  // Each card item is a div.utility-aspect-1x1 containing an img.cover-image
  const cardItems = element.querySelectorAll(':scope > div.utility-aspect-1x1, :scope > div[class*="aspect"]');

  const cells = [];

  cardItems.forEach((item) => {
    const image = item.querySelector('img.cover-image, img');
    if (image) {
      cells.push([image]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
