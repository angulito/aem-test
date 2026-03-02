/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product block
 *
 * Source: https://frame.io
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Product image
 * - Row 2: Heading + description + CTA links
 *
 * Source HTML Pattern:
 * <article class="HeroSideBySide_heroSideBySide__...">
 *   <div class="HeroSideBySide_contentWrapper__...">
 *     <div class="PortableText_portableText__...">
 *       <h1>One platform for all your creative work.</h1>
 *       <p>Upload creative files...</p>
 *       <div class="ButtonGroup_buttonGroup__...">
 *         <a class="Button_white__..."><span class="Button_buttonText__...">Start Free Trial</span></a>
 *         <a class="Button_glass__..."><span class="Button_buttonText__...">Take a Product Tour</span></a>
 *       </div>
 *     </div>
 *   </div>
 *   <div class="HeroSideBySide_mediaWrapper__...">
 *     <picture><img src="...product-screenshot.jpg"></picture>
 *   </div>
 * </article>
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h1')
    || element.querySelector('h2')
    || element.querySelector('[class*="title1"]');

  // Extract description paragraph
  const description = element.querySelector('[class*="PortableText_body"], [class*="bodies"]')
    || element.querySelector('p');

  // Extract CTA links - get the actual <a> elements from ButtonGroup
  const ctaLinks = Array.from(
    element.querySelectorAll('[class*="ButtonGroup"] a[class*="Button_"]')
  );

  // If no ButtonGroup links found, try direct link children
  if (ctaLinks.length === 0) {
    const fallbackLinks = Array.from(element.querySelectorAll('a[class*="Button_base"]'));
    ctaLinks.push(...fallbackLinks);
  }

  // Clean CTA links - replace with simplified link elements
  const cleanedCtas = ctaLinks.map((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    // Get button text from span or direct text
    const textSpan = link.querySelector('[class*="buttonText"]');
    a.textContent = textSpan ? textSpan.textContent.trim() : link.textContent.trim();
    return a;
  });

  // Extract product image from media wrapper
  const mediaWrapper = element.querySelector('[class*="mediaWrapper"], [class*="media"]');
  let productImage = null;
  if (mediaWrapper) {
    // Get the main content image, not decorative shadow images
    productImage = mediaWrapper.querySelector('[class*="Video_thumbnail"] img')
      || mediaWrapper.querySelector('[class*="Image_image"]:not([class*="Shadow"])')
      || mediaWrapper.querySelector('picture img');
  }

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Product image (optional)
  if (productImage) {
    cells.push([productImage]);
  }

  // Row 2: Content (heading + description + CTAs in single cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...cleanedCtas);

  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Product', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
