/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-latest. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column cards): one row per card.
 *   - Cell 1: card image (mandatory)
 *   - Cell 2: text content — meta (tag + date), title heading, and a CTA link.
 * Each source card is an <a class="article-card"> wrapping the image and body.
 */
export default function parse(element, { document }) {
  // Each direct anchor is a single article card.
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return;

    const textCell = [];
    const meta = card.querySelector('.article-card-meta');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (meta) textCell.push(meta);

    // Preserve the card's link on the heading (the whole source card is a link),
    // without duplicating the heading text as a separate CTA.
    const href = card.getAttribute('href');
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      textCell.push(heading);
    }

    cells.push([img, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-latest', cells });
  element.replaceWith(block);
}
