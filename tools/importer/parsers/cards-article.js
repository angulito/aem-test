/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/blog (Latest Articles grid)
 * Generated: 2026-06-11
 *
 * Target structure (from library example): N rows, 2 cells each:
 *   [cover image] | [category tag + date meta row, article title (H4/H3)]
 * Each card is a link (article-card.card-link). The card link is preserved
 * by wrapping the title text in an anchor to the article href.
 */
export default function parse(element, { document }) {
  // Each card is an anchor with class article-card / card-link.
  // Fallbacks cover variations where the card may not be a direct anchor.
  const cards = Array.from(
    element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > .article-card'),
  );

  const cells = [];

  cards.forEach((card) => {
    // INPUT EXTRACTION (validated against source.html)
    // Cover image lives in .article-card-image; fall back to any img in the card.
    const image = card.querySelector('.article-card-image img, img.cover-image, img');

    // Meta row: category tag + date.
    const meta = card.querySelector('.article-card-meta');

    // Article title (H3 with h4-heading class in source); allow heading-level variation.
    const title = card.querySelector('h3, h4, h2, [class*="heading"]');

    // Determine the card link href (the anchor itself, or any inner anchor).
    const href = card.matches('a[href]')
      ? card.getAttribute('href')
      : (card.querySelector('a[href]') ? card.querySelector('a[href]').getAttribute('href') : null);

    // Skip cards with no meaningful content.
    if (!image && !title && !meta) return;

    // OUTPUT: build the text cell (meta + title), matching library example.
    const textCell = [];
    if (meta) textCell.push(meta);

    if (title) {
      if (href) {
        // Preserve the card link by wrapping the title text in an anchor.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = title.textContent.trim();
        const heading = document.createElement('h4');
        heading.append(link);
        textCell.push(heading);
      } else {
        textCell.push(title);
      }
    }

    cells.push([image || '', textCell]);
  });

  // Empty-block guard: nothing extracted.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
