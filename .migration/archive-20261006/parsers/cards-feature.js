/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: #section02 ~ .grid.cmp-grid-custom
 * Generated: 2026-06-08
 *
 * Source structure:
 *   div.grid.cmp-grid-custom
 *     div.grid-container > div.grid-row
 *       div.grid-row__col-with-4.grid-cell (repeated x3)
 *         div.image > div.cmp-image > img.cmp-image__image
 *         div.text.cmp-text-xx-large > div.cmp-text > p
 *         div.button.internal-cta > a.cmp-button > span.cmp-button__text
 *
 * Target: Cards block with one row per card.
 *   Each row: [image, description + CTA link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each card is in a grid-cell column
  const cardCells = element.querySelectorAll('.grid-row__col-with-4.grid-cell, .grid-cell');

  cardCells.forEach((card) => {
    // Extract image
    const image = card.querySelector('.cmp-image__image, .cmp-image img, img');

    // Extract description text
    const description = card.querySelector('.cmp-text p, .cmp-text-xx-large p, .text p');

    // Extract CTA link
    const ctaLink = card.querySelector('a.cmp-button, .button a, .internal-cta a');

    const imageCell = image ? [image] : [];
    const textCell = [];

    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent.trim();
      textCell.push(descEl);
    }

    if (ctaLink) {
      const linkEl = document.createElement('a');
      linkEl.href = ctaLink.getAttribute('href') || '';
      const buttonText = ctaLink.querySelector('.cmp-button__text, span');
      linkEl.textContent = buttonText ? buttonText.textContent.trim() : ctaLink.textContent.trim();
      textCell.push(linkEl);
    }

    // Only add the row if we have some content
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
