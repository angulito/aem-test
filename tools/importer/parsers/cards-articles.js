/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://www.wknd-trendsetters.site/ (homepage, section "Latest articles")
 * Generated: 2026-06-03
 *
 * Source structure: a 4-column grid (.grid-layout) of article cards. Each card is an
 * anchor `<a href class="article-card card-link">` wrapping:
 *   - an image container (.article-card-image > img.cover-image)
 *   - a body (.article-card-body) with a meta row (.article-card-meta: .tag + date span)
 *     and an H3 title (.h4-heading)
 *
 * The centered H2 + lead paragraph above the grid are default content handled separately,
 * so this parser only operates on the article-card grid.
 *
 * Target table (per cards-articles.js decorate): one row per card with two cells:
 *   [ image, body (linked title + meta) ]. The card link is preserved by wrapping the
 *   title in an anchor pointing to the card href.
 */
export default function parse(element, { document }) {
  // Collect the article cards. The grid lives inside the section; cards are the anchors.
  const cards = Array.from(
    element.querySelectorAll('a.article-card, a.card-link, .article-card'),
  );
  // De-duplicate in case overlapping selectors matched the same node.
  const uniqueCards = [...new Set(cards)];

  const cells = [];

  uniqueCards.forEach((card) => {
    // Image cell: keep the picture/img exactly as-is.
    const image = card.querySelector('.article-card-image img, picture, img');

    // Body cell: preserve meta (category tag + date) and the H3 title.
    const meta = card.querySelector('.article-card-meta');
    const title = card.querySelector('h3, .h4-heading, [class*="heading"]');

    // Preserve the card link: wrap the title text in an anchor to the card href.
    const href = card.getAttribute('href');
    let titleNode = title;
    if (title && href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = title.textContent.trim();
      // Keep the heading wrapper around the link to preserve semantics.
      const heading = document.createElement(title.tagName);
      heading.append(link);
      titleNode = heading;
    }

    const bodyCell = [];
    if (meta) bodyCell.push(meta);
    if (titleNode) bodyCell.push(titleNode);

    const imageCell = [];
    if (image) imageCell.push(image);

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
