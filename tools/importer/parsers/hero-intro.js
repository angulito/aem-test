/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://www.wknd-trendsetters.site/faq (header.section.secondary-section)
 * Generated: 2026-06-10
 *
 * Light, text-led page intro. Source structure (validated against source.html):
 *  - Text column: h1.h1-heading, p.subheading, p (intro paragraph)
 *  - Media column: img.cover-image (single cover image)
 *
 * The block decorate (blocks/hero-intro/hero-intro.js) inspects each row's cell
 * and routes cells containing a <picture> into the media column and the
 * remaining cell into the content column. So we emit a text content row and an
 * image row. Handles variations: optional CTAs, optional/multiple images,
 * heading level h1/h2.
 */
export default function parse(element, { document }) {
  // --- Text content (validated: h1.h1-heading, p.subheading, p) ---
  const heading = element.querySelector('h1.h1-heading, h1, h2.h2-heading, h2, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, .subheading');

  // Intro paragraph(s): every <p> that is not the subheading.
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(
    (p) => p !== subheading,
  );

  // Optional CTAs (reused variant supports up to two buttons).
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, .button-container a, a.button, a.cta'),
  );

  // --- Media (validated: img.cover-image) ---
  const coverImages = Array.from(
    element.querySelectorAll('img.cover-image, img[class*="cover"], img'),
  );

  const cells = [];

  // Row 1: text content cell — heading, subheading, intro paragraph(s), CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  paragraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((a) => contentCell.push(a));
  if (contentCell.length) cells.push([contentCell]);

  // Row 2 (optional): cover image(s) — routed to the media column by decorate.
  if (coverImages.length) cells.push([coverImages]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
