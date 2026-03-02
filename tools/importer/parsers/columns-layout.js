/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-layout block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Each row = one set of columns
 * - Columns auto-counted from first row
 *
 * Source HTML Pattern:
 * <div class="grid-layout">
 *   <div class="grid-item">content</div>
 *   <div class="grid-item">content</div>
 * </div>
 *
 * Generated: 2026-01-21
 */
export default function parse(element, { document }) {
  // Find column containers - grid items or flex children
  const columns = Array.from(element.querySelectorAll(':scope > div, :scope > .grid-item, :scope > .flex-item'));

  if (columns.length === 0) {
    // Fallback: treat element itself as single column
    const cells = [[element.innerHTML]];
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Layout', cells });
    element.replaceWith(block);
    return;
  }

  // Build cells array - one row with multiple columns
  const row = columns.map(col => {
    // Extract content from column
    const content = [];

    // Get images
    const images = col.querySelectorAll('img, picture');
    images.forEach(img => content.push(img.cloneNode(true)));

    // Get headings
    const headings = col.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => content.push(h.cloneNode(true)));

    // Get paragraphs
    const paragraphs = col.querySelectorAll('p, .text-block');
    paragraphs.forEach(p => content.push(p.cloneNode(true)));

    // Get links/buttons
    const links = col.querySelectorAll('a.button, a.cta, .button-group a');
    links.forEach(link => content.push(link.cloneNode(true)));

    // If no structured content found, use innerHTML
    if (content.length === 0) {
      const div = document.createElement('div');
      div.innerHTML = col.innerHTML;
      return div;
    }

    return content;
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Layout', cells });
  element.replaceWith(block);
}
