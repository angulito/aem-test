/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-gallery block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: tabs
 *
 * Block Structure:
 * - Row 1: Tab labels (one per column)
 * - Rows 2-N: Tab content panels (one row per tab)
 *
 * Source HTML Pattern:
 * <div class="w-tabs">
 *   <div class="w-tab-menu">
 *     <a class="tab-link">Tab 1</a>
 *     <a class="tab-link">Tab 2</a>
 *   </div>
 *   <div class="w-tab-content">
 *     <div class="w-tab-pane">Content 1</div>
 *     <div class="w-tab-pane">Content 2</div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find tab labels
  const tabMenu = element.querySelector('.w-tab-menu, .tabs-menu, [role="tablist"]');
  const tabLinks = tabMenu ?
    Array.from(tabMenu.querySelectorAll('a, button, [role="tab"]')) :
    Array.from(element.querySelectorAll('.tab-link, .tab-button'));

  // Row 1: Tab labels
  const labelRow = tabLinks.map(link => {
    const label = document.createElement('span');
    label.textContent = link.textContent.trim();
    return label;
  });
  cells.push(labelRow);

  // Find tab content panels
  const tabContent = element.querySelector('.w-tab-content, .tabs-content');
  const panels = tabContent ?
    Array.from(tabContent.querySelectorAll(':scope > div, .w-tab-pane, [role="tabpanel"]')) :
    Array.from(element.querySelectorAll('.tab-pane, .tab-panel'));

  // Rows 2-N: Tab content
  panels.forEach(panel => {
    const contentCell = [];

    // Get heading
    const heading = panel.querySelector('h1, h2, h3, h4, .heading');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }

    // Get image
    const image = panel.querySelector('img, picture');
    if (image) {
      contentCell.push(image.cloneNode(true));
    }

    // Get other content
    const paragraphs = panel.querySelectorAll('p');
    paragraphs.forEach(p => contentCell.push(p.cloneNode(true)));

    // Add content row
    cells.push([contentCell.length > 0 ? contentCell : panel.innerHTML]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Gallery', cells });
  element.replaceWith(block);
}
