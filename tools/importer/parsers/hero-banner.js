/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://www.wknd-trendsetters.site/faq
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Content (heading, description, CTA)
 *
 * Source HTML Pattern:
 * <section class="section inverse-section">
 *   <div class="container">
 *     <div class="grid-layout">
 *       <div class="utility-position-relative">
 *         <img class="cover-image utility-overlay" src="...">
 *       </div>
 *       <div class="card-body">
 *         <h2 class="h1-heading">Heading</h2>
 *         <p class="subheading">Description...</p>
 *         <div class="button-group">
 *           <a class="button inverse-button">CTA</a>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-26
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  const bgImage = element.querySelector('.cover-image, .utility-overlay, img[class*="cover"], img[class*="overlay"]');

  if (bgImage) {
    // Clone the image element
    const imgClone = bgImage.cloneNode(true);
    cells.push([imgClone]);
  }

  // Extract heading
  const heading = element.querySelector('.h1-heading, .h2-heading, h1, h2, [class*="heading"]');

  // Extract description/subheading
  const description = element.querySelector('.subheading, p.subheading, p[class*="subheading"]');

  // Extract CTA buttons
  const ctaButtons = Array.from(element.querySelectorAll('.button-group a, a.button, a.inverse-button, a.w-button'));

  // Build content cell with heading, description, and CTAs
  const contentCell = [];

  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }

  // Add CTA buttons
  ctaButtons.forEach(btn => {
    const a = document.createElement('a');
    a.href = btn.href || '#';
    a.textContent = btn.textContent.trim();
    contentCell.push(a);
  });

  // Add content row
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Banner', cells });
  element.replaceWith(block);
}
