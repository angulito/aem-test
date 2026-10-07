/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-driver.
 * Base block: cards.
 * Source: https://www.abbvie.com/sustainability/environmental-social-and-governance.html
 * Selector: .container.cmp-container-xx-large.height-short + .grid.cmp-grid-custom
 *
 * Grid of material-driver topics (3 per row). Each item has an image, an eyebrow
 * category label, a short description paragraph, and a CTA link. Empty trailing
 * grid cells in the source are skipped.
 * Target: cards block, one row per card: [image, eyebrow + description + CTA].
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = element.querySelectorAll('.grid-row__col-with-4.grid-cell, .grid-cell');

  cards.forEach((card) => {
    const image = card.querySelector('.cmp-image__image, .cmp-image img, img');
    const eyebrow = card.querySelector('.cmp-header__text, .cmp-header span');
    const description = card.querySelector('.cmp-text p, .cmp-text-xx-large p, .text p');
    const ctaLink = card.querySelector('a.cmp-button, .button a, .internal-cta a');

    // Skip empty trailing cells (no image and no text).
    if (!image && !eyebrow && !description) return;

    const imageCell = image ? [image] : [];
    const bodyCell = [];

    if (eyebrow) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      p.append(strong);
      bodyCell.push(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      bodyCell.push(p);
    }
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || '';
      const txt = ctaLink.querySelector('.cmp-button__text, span');
      a.textContent = txt ? txt.textContent.trim() : ctaLink.textContent.trim();
      bodyCell.push(a);
    }

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-driver', cells });
  element.replaceWith(block);
}
