/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: tabs
 *
 * Block Structure:
 * - Each row = one tab
 * - Column 1 = tab label (person name)
 * - Column 2 = tab content (image, name, role, quote)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="tabs-wrapper">
 *   <div class="tabs-content">
 *     <div class="tab-pane is-active" id="tabpanel-0">
 *       <div class="grid-layout tablet-1-column grid-gap-md">
 *         <div><img src="..." alt="Alex Rivera" class="cover-image"></div>
 *         <div>
 *           <div>
 *             <div class="paragraph-xl utility-margin-bottom-0"><strong>Alex Rivera</strong></div>
 *             <div>Streetwear Enthusiast</div>
 *           </div>
 *           <p class="paragraph-xl">"Wearing new brands..."</p>
 *         </div>
 *       </div>
 *     </div>
 *     ...
 *   </div>
 *   <div class="grid-layout ... tab-menu">
 *     <button class="tab-menu-link is-active" id="tab-0">
 *       <div class="flex-horizontal y-center flex-gap-xs">
 *         <div class="avatar"><img src="..." class="cover-image"></div>
 *         <div>
 *           <div class="paragraph-sm"><strong>Alex Rivera</strong></div>
 *           <div class="paragraph-sm">Streetwear Enthusiast</div>
 *         </div>
 *       </div>
 *     </button>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find tab panels
  // VALIDATED: Captured DOM uses <div class="tab-pane"> inside <div class="tabs-content">
  const tabContent = element.querySelector('.tabs-content');
  const panels = tabContent
    ? Array.from(tabContent.querySelectorAll('.tab-pane'))
    : Array.from(element.querySelectorAll('[id^="tabpanel-"]'));

  // Find tab buttons for labels
  // VALIDATED: Captured DOM uses <button class="tab-menu-link"> inside <div class="tab-menu">
  const tabMenu = element.querySelector('.tab-menu');
  const tabButtons = tabMenu
    ? Array.from(tabMenu.querySelectorAll('button.tab-menu-link, button'))
    : Array.from(element.querySelectorAll('[id^="tab-"]'));

  panels.forEach((panel, index) => {
    // Get tab label from button text
    const tabButton = tabButtons[index];
    const labelText = tabButton
      ? tabButton.querySelector('strong')?.textContent.trim() || tabButton.textContent.trim()
      : `Tab ${index + 1}`;

    // Build content cell from panel
    const contentCell = [];

    // Image - the person's photo
    // VALIDATED: Panel has a grid-layout with img.cover-image in first div
    const image = panel.querySelector('img.cover-image, img');
    if (image) {
      contentCell.push(image.cloneNode(true));
    }

    // Name
    // VALIDATED: <div class="paragraph-xl ..."><strong>Alex Rivera</strong></div>
    const nameEl = panel.querySelector('.paragraph-xl strong, strong');
    if (nameEl) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      nameP.appendChild(strong);
      contentCell.push(nameP);
    }

    // Role
    // VALIDATED: <div>Streetwear Enthusiast</div> (sibling after the name div)
    const nameContainer = panel.querySelector('.paragraph-xl.utility-margin-bottom-0')?.parentElement;
    if (nameContainer) {
      const roleDiv = nameContainer.querySelector(':scope > div:not(.paragraph-xl)');
      if (roleDiv) {
        const roleP = document.createElement('p');
        roleP.textContent = roleDiv.textContent.trim();
        contentCell.push(roleP);
      }
    }

    // Quote
    // VALIDATED: <p class="paragraph-xl">"Wearing new brands..."</p>
    const quote = panel.querySelector('p.paragraph-xl');
    if (quote) {
      contentCell.push(quote.cloneNode(true));
    }

    // Create row: [label, content]
    const labelCell = document.createElement('p');
    labelCell.textContent = labelText;

    cells.push([labelCell, contentCell.length > 0 ? contentCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Testimonial', cells });
  element.replaceWith(block);
}
