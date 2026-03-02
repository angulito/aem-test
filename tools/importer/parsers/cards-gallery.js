/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-trends-of-the-season
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1-N: One image per row (image-only cards)
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout desktop-3-column">
 *   <div class="utility-aspect-1x1">
 *     <img src="..." alt="..." class="cover-image">
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all images in the grid layout
  // Look for images within aspect ratio containers or direct grid children
  const images = Array.from(element.querySelectorAll(
    '.utility-aspect-1x1 img, .grid-layout > div img, .cover-image, img[class*="cover"]'
  ));

  // Create one row per image
  images.forEach(img => {
    // Clone the image to preserve attributes
    const imgClone = img.cloneNode(true);

    // Ensure alt text is preserved
    if (!imgClone.alt || imgClone.alt.startsWith('[')) {
      imgClone.alt = 'Gallery image';
    }

    cells.push([imgClone]);
  });

  // Only create block if we have images
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Gallery', cells });
    element.replaceWith(block);
  }
}
