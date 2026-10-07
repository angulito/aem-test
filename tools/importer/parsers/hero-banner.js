/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/
 * Selector: section.inverse-section .utility-position-relative
 * Generated: 2026-06-08
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img[class*="background"]');

  // Extract heading (h2.h1-heading in source, fallback to h1, h2, or heading classes)
  const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');

  // Extract description/subheading
  const description = element.querySelector('p.subheading, p[class*="subheading"], .card-body > p');

  // Extract CTA buttons
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, .button-group a, a.button'));

  // Build cells to match Hero block structure:
  // Row 1 (optional): background image
  // Row 2: heading + description + CTA buttons
  const cells = [];

  // Add background image row if present
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Build content cell: heading, description, and CTA links in a single cell
  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.append(heading);
  if (description) contentWrapper.append(description);
  if (ctaLinks.length > 0) ctaLinks.forEach((cta) => contentWrapper.append(cta));
  cells.push([[contentWrapper]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
