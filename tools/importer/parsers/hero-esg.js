/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the ESG hero. Emits a `hero-patient` block (reuses that block's CSS/JS).
 * Source: https://www.abbvie.com/sustainability/environmental-social-and-governance.html
 * Selector: .container.large-radius.cmp-container-full-width.height-default.no-bottom-margin
 *
 * Unlike the patients hero (image + content in one container), the ESG hero is split
 * across two sibling containers: this element holds the full-bleed background image,
 * and its next sibling (.overlap-predecessor) holds the H1 + intro paragraphs.
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector(
    'img.cmp-container__bg-image, img[class*="bg-image"], picture, img'
  );

  // Heading + intro live in the overlapping card, which is the next sibling container.
  const card = element.nextElementSibling;
  const heading = card ? card.querySelector('.cmp-title__text, h1, h2') : null;
  const paragraphs = card
    ? Array.from(card.querySelectorAll('.cmp-text p, .cmp-text')).filter((p) => p.textContent.trim())
    : [];

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));
  if (contentCell.length) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-patient', cells });
  element.replaceWith(block);
  // Remove the now-consumed sibling card so its content isn't duplicated.
  if (card) card.remove();
}
