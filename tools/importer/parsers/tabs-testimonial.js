/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial
 * Base block: tabs
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .tabs-wrapper
 * Generated: 2026-06-08
 *
 * Extracts tabbed testimonial panels. Each tab has a person name (label)
 * and content panel with image, name, role, and testimonial quote.
 */
export default function parse(element, { document }) {
  // Extract tab panes (content panels)
  const tabPanes = element.querySelectorAll('.tab-pane');
  // Extract tab menu buttons (for labels)
  const tabButtons = element.querySelectorAll('.tab-menu-link');

  const cells = [];

  tabPanes.forEach((pane, index) => {
    // Get tab label from the corresponding menu button
    const button = tabButtons[index];
    let tabLabel = '';
    if (button) {
      const nameEl = button.querySelector('.paragraph-sm strong');
      tabLabel = nameEl ? nameEl.textContent.trim() : `Tab ${index + 1}`;
    } else {
      // Fallback: extract name from the pane itself
      const paneName = pane.querySelector('.paragraph-xl strong');
      tabLabel = paneName ? paneName.textContent.trim() : `Tab ${index + 1}`;
    }

    // Build tab content from the pane
    const contentContainer = document.createElement('div');

    // Extract image
    const image = pane.querySelector('img.cover-image');
    if (image) {
      const imgClone = image.cloneNode(true);
      contentContainer.appendChild(imgClone);
    }

    // Extract name
    const nameDiv = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameDiv) {
      const nameClone = nameDiv.cloneNode(true);
      contentContainer.appendChild(nameClone);
    }

    // Extract role (sibling div after name)
    const nameParent = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameParent && nameParent.parentElement) {
      const roleEl = nameParent.nextElementSibling;
      if (roleEl && !roleEl.classList.contains('paragraph-xl')) {
        const roleClone = roleEl.cloneNode(true);
        contentContainer.appendChild(roleClone);
      }
    }

    // Extract testimonial quote
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) {
      const quoteClone = quote.cloneNode(true);
      contentContainer.appendChild(quoteClone);
    }

    // Each row: [label, content]
    cells.push([tabLabel, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
