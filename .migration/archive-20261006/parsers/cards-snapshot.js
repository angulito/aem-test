/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-snapshot. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column cards): one row per card.
 *   - Cell 1: card image (mandatory)
 *   - Cell 2: text content (title/description/CTA) — empty here, cards are image-only.
 * Images are present, so the standard image variant is used (not "no images").
 */
export default function parse(element, { document }) {
  // Each direct child div is a single card holding a cover image.
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return;

    // Text content cell: title / description / CTA if present, else empty.
    const textCell = [];
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const paras = Array.from(card.querySelectorAll('p'));
    const ctas = Array.from(card.querySelectorAll('a'));
    if (heading) textCell.push(heading);
    textCell.push(...paras);
    textCell.push(...ctas);

    cells.push([img, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-snapshot', cells });
  element.replaceWith(block);
}
