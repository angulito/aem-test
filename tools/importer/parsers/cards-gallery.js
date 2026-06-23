/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery.
 * Base block: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Structure: a grid of 8 square (1:1) image-only cards. Each card is a single
 * image wrapped in a `div.utility-aspect-1x1`. The centered H2 heading and lead
 * paragraph above the grid are default content handled separately, so they are
 * intentionally NOT extracted here.
 *
 * Target table: block name row, then one row per card. Each card row has a
 * single cell containing the image element (image-only cards variant).
 */
export default function parse(element, { document }) {
  // Locate the image grid. Validated against source:
  //   <div class="grid-layout ...">
  //     <div class="utility-aspect-1x1"><img class="cover-image"></div> x8
  const grid = element.querySelector('.grid-layout:has(.utility-aspect-1x1)')
    || element.querySelector('.grid-layout');

  // Each card is a square aspect wrapper holding one image.
  let cardWrappers = Array.from((grid || element).querySelectorAll(':scope > .utility-aspect-1x1'));

  // Fallback: if wrappers were not found, collect the cover images directly.
  let imageNodes = cardWrappers
    .map((wrap) => wrap.querySelector('img'))
    .filter(Boolean);

  if (imageNodes.length === 0) {
    imageNodes = Array.from((grid || element).querySelectorAll('.utility-aspect-1x1 img, img.cover-image'));
  }

  const cells = [];
  // One row per image-only card.
  imageNodes.forEach((img) => {
    cells.push([img]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
