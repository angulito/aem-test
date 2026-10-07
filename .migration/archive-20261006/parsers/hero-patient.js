/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-patient.
 * Base: hero.
 * Source: https://www.abbvie.com/patients.html
 * Selector: .container.large-radius.cmp-container-full-width.height-default
 *
 * Single static slide hero:
 *   Row 2 (div:first-child): full-bleed background image (Scene7 DM <img>; the DM
 *          transformer's afterTransform converts it to carrier anchors, so emit normally).
 *   Row 3: heading + intro paragraph (+ optional CTA if present).
 *
 * Generated: 2026-06-09
 */
export default function parse(element, { document }) {
  // Background image — full-bleed container background.
  // Validated against source: <img class="cmp-container__bg-image"> (Scene7 DM image).
  const bgImage = element.querySelector(
    'img.cmp-container__bg-image, img[class*="bg-image"], picture, img'
  );

  // Heading — validated against source: <h1 class="cmp-title__text">.
  const heading = element.querySelector(
    '.cmp-title__text, .cmp-title h1, .cmp-title h2, h1, h2'
  );

  // Intro paragraph — validated against source: .cmp-text > p.
  const description = element.querySelector('.cmp-text p, .cmp-text, p');

  // Optional CTA(s) — none in current source, but support if present.
  const ctaLinks = Array.from(
    element.querySelectorAll('.cmp-button, a.cmp-button__link, .cmp-teaser__action-link, a.button')
  );

  const cells = [];

  // Row 2: background image (own row so block decorator's div:first-child picture check passes).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: heading + intro paragraph + optional CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-patient', cells });
  element.replaceWith(block);
}
