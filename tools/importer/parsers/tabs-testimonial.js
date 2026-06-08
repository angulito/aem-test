/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial.
 * Base block: tabs
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Target structure (tabs block, 2 columns): first row is the block name,
 * then one row per tab: [ tab label, tab content ].
 *
 * Source structure:
 *  - .tabs-wrapper > .tab-menu > button.tab-menu-link  -> tab labels (avatar + name + role)
 *  - .tabs-wrapper > .tabs-content > .tab-pane         -> tab content panels (portrait + name/role + quote)
 * The two lists are parallel and paired by index.
 */
export default function parse(element, { document }) {
  // Tab labels live in the tab-menu buttons; content panels in tabs-content.
  const menu = element.querySelector('.tab-menu, [class*="tab-menu"]');
  const labelButtons = menu
    ? Array.from(menu.querySelectorAll(':scope > button, :scope > .tab-menu-link, button.tab-menu-link'))
    : Array.from(element.querySelectorAll('button.tab-menu-link'));

  const content = element.querySelector('.tabs-content, [class*="tabs-content"]');
  const panes = content
    ? Array.from(content.querySelectorAll(':scope > .tab-pane, :scope > [class*="tab-pane"]'))
    : Array.from(element.querySelectorAll('.tab-pane, [class*="tab-pane"]'));

  const cells = [];
  const count = Math.max(labelButtons.length, panes.length);

  for (let i = 0; i < count; i += 1) {
    const button = labelButtons[i];
    const pane = panes[i];

    // --- Label cell: avatar + name + role from the tab menu button ---
    let labelCell;
    if (button) {
      const labelParts = [];
      const avatar = button.querySelector('.avatar img, img');
      if (avatar) labelParts.push(avatar);
      // The text wrapper (name + role) — take the container that is not the avatar.
      const textWrappers = Array.from(button.querySelectorAll(':scope > div, .flex-horizontal > div'))
        .filter((d) => !d.classList.contains('avatar') && !d.querySelector('.avatar') && !d.querySelector('img'));
      if (textWrappers.length) {
        labelParts.push(textWrappers[0]);
      } else {
        // Fallback: pull the strong (name) and any sibling role text.
        const name = button.querySelector('strong');
        if (name) labelParts.push(name);
      }
      labelCell = labelParts.length ? labelParts : button;
    } else {
      labelCell = `Tab ${i + 1}`;
    }

    // --- Content cell: portrait image + name/role block + pull quote from the pane ---
    let contentCell;
    if (pane) {
      const contentParts = [];
      const portrait = pane.querySelector('img');
      if (portrait) contentParts.push(portrait);
      // Name + role block: container holding the <strong> name (excluding the image cell).
      const nameRole = pane.querySelector('.paragraph-xl strong')
        ? pane.querySelector('.paragraph-xl strong').closest('div').parentElement
        : null;
      if (nameRole) contentParts.push(nameRole);
      // Pull quote paragraph.
      const quote = pane.querySelector('p');
      if (quote) contentParts.push(quote);
      contentCell = contentParts.length ? contentParts : pane;
    } else {
      contentCell = '';
    }

    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
