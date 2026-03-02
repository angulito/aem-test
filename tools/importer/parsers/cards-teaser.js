/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-teaser
 * Base block: cards
 * Source: https://wknd.site/us/en.html
 * Selector: .image-list.list
 * Generated: 2026-02-27
 *
 * Source DOM structure:
 *   .image-list.list
 *     ul.cmp-image-list
 *       li.cmp-image-list__item (per card)
 *         article.cmp-image-list__item-content
 *           a.cmp-image-list__item-image-link
 *             .cmp-image-list__item-image > .cmp-image > img
 *           a.cmp-image-list__item-title-link
 *             span.cmp-image-list__item-title
 *           span.cmp-image-list__item-description
 *
 * Target: Cards block - 2 columns per row.
 *   Col 1: card image
 *   Col 2: bold title (as link) + description paragraph
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-image-list__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, .cmp-image img');
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Col 1: image
    const imageCell = img ? [img] : [];

    // Col 2: title (bold, as link) + description
    const contentCell = [];
    if (titleLink && titleSpan) {
      // Create bold wrapper for title text inside link
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.appendChild(strong);
      const titleP = document.createElement('p');
      titleP.appendChild(link);
      contentCell.push(titleP);
    }
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent.trim();
      contentCell.push(descP);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-teaser',
    cells,
  });
  element.replaceWith(block);
}
