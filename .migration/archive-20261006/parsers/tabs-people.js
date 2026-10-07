/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-people. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column tabs): one row per tab.
 *   - Cell 1: tab label (person name + role, from the tab menu button)
 *   - Cell 2: tab content (image + name + role + quote, from the tab pane)
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));

  const cells = [];
  panes.forEach((pane, i) => {
    // Tab label cell: prefer the text container from the matching menu button.
    const labelCell = [];
    const btn = menuButtons[i];
    if (btn) {
      // The text container inside the button holds the name and role (excludes the avatar).
      const textContainer = Array.from(btn.querySelectorAll('div')).find(
        (d) => !d.classList.contains('avatar') && !d.querySelector('img') && d.querySelector('strong'),
      );
      if (textContainer) {
        labelCell.push(textContainer);
      } else {
        labelCell.push(...btn.childNodes);
      }
    }
    if (labelCell.length === 0) labelCell.push(`Tab ${i + 1}`);

    // Tab content cell: the inner content of the pane (image column + text column).
    const contentCell = [];
    const inner = pane.querySelector(':scope > .grid-layout') || pane;
    const innerChildren = Array.from(inner.querySelectorAll(':scope > div'));
    if (innerChildren.length) {
      contentCell.push(...innerChildren);
    } else {
      contentCell.push(...pane.childNodes);
    }

    cells.push([labelCell, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-people', cells });
  element.replaceWith(block);
}
