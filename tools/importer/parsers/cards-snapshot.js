/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-snapshot. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column
 * Structure: 2 columns, one row per card — [image] | [text (heading/description/CTA)].
 * Source cards are image-only (div.utility-aspect-1x1 > img), so the text cell is
 * padded with '' unless text is present.
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  // Primary: div.utility-aspect-1x1 wrappers; fallback: any direct child holding an image
  let items = [...element.querySelectorAll(':scope > .utility-aspect-1x1')];
  if (!items.length) {
    items = [...element.querySelectorAll(':scope > *')].filter((c) => c.querySelector('img') || c.tagName === 'IMG');
  }

  const cells = [];
  items.forEach((item) => {
    const img = item.tagName === 'IMG' ? item : item.querySelector('img');
    if (!img) return;

    const textCell = [];
    const heading = item.querySelector('h2, h3, h4, h5, h6');
    if (heading) textCell.push(heading);
    textCell.push(...item.querySelectorAll('p'));
    const link = item.querySelector('a[href]');
    if (link && !textCell.some((n) => n.contains(link))) textCell.push(link);

    cells.push([img, textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-snapshot', cells });
  element.replaceWith(block);
}
