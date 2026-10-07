/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/
 * Selector: header.secondary-section .grid-layout.grid-gap-xxl
 * Generated: 2026-06-08
 *
 * Source structure:
 * - div.grid-layout.grid-gap-xxl (root)
 *   - div (content): h1.h1-heading, p.subheading, div.button-group > a.button
 *   - div.grid-layout.grid-gap-xs (images): img.cover-image (x3)
 *
 * Target: Hero block with image row + content row (heading, subheading, CTAs)
 */
export default function parse(element, { document }) {
  // Extract heading - validated against source: h1.h1-heading
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');

  // Extract subheading/description - validated against source: p.subheading
  const description = element.querySelector('p.subheading, p[class*="subheading"], .subheading');

  // Extract CTA buttons - validated against source: div.button-group > a.button
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, a.cta')
  );

  // Extract images - validated against source: img.cover-image within grid layout
  const images = Array.from(
    element.querySelectorAll('img.cover-image, .grid-gap-xs img, .grid-layout img')
  );

  // Build cells to match hero block structure
  const cells = [];

  // Row 1: Images (visual component of the hero)
  if (images.length > 0) {
    cells.push(images);
  }

  // Row 2: Content - heading, description, and CTA buttons
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
