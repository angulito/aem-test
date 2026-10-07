/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-people. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section:nth-of-type(3) .tabs-wrapper
 * Structure: 2 columns, one row per tab — [tab label] | [tab content].
 *   - Label: from .tab-menu button (avatar image, name, role)
 *   - Content: matching .tab-pane (portrait image, name, role, quote)
 * Tabs are paired with panes by index (tab-N <-> tabpanel-N). Iteration is keyed on
 * .tab-pane (block wrappers), not on the buttons.
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  const panes = [...element.querySelectorAll('.tabs-content > .tab-pane, .tabs-content > [role="tabpanel"]')];
  const menuItems = [...element.querySelectorAll('.tab-menu > .tab-menu-link, .tab-menu > [role="tab"]')];

  const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const cells = [];
  panes.forEach((pane, i) => {
    // Find matching menu item by id suffix, fall back to index
    const idx = (pane.id || '').match(/(\d+)$/);
    const menu = (idx && menuItems.find((m) => (m.id || '').endsWith(`-${idx[1]}`))) || menuItems[i];

    // ---- Label cell
    const labelCell = [];
    if (menu) {
      const avatar = menu.querySelector('.avatar img, img');
      if (avatar) labelCell.push(avatar);
      const name = textOf(menu.querySelector('strong'));
      const lines = [...menu.querySelectorAll('.paragraph-sm')].map(textOf).filter(Boolean);
      const role = lines.find((l) => l !== name);
      if (name) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = name;
        p.append(strong);
        labelCell.push(p);
      }
      if (role) {
        const p = document.createElement('p');
        p.textContent = role;
        labelCell.push(p);
      }
      if (!name && !role && textOf(menu)) {
        const p = document.createElement('p');
        p.textContent = textOf(menu);
        labelCell.push(p);
      }
    }
    if (!labelCell.length) {
      // Fallback: derive label from the pane's name
      const name = textOf(pane.querySelector('strong'));
      if (name) labelCell.push(name);
    }

    // ---- Content cell
    const contentCell = [];
    const img = pane.querySelector('img');
    if (img) contentCell.push(img);
    const name = textOf(pane.querySelector('strong'));
    if (name) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = name;
      p.append(strong);
      contentCell.push(p);
    }
    // Role: the sibling div after the name wrapper
    const nameWrap = pane.querySelector('strong')?.closest('div');
    const roleEl = nameWrap?.nextElementSibling;
    const role = roleEl && roleEl.tagName !== 'P' ? textOf(roleEl) : '';
    if (role) {
      const p = document.createElement('p');
      p.textContent = role;
      contentCell.push(p);
    }
    contentCell.push(...pane.querySelectorAll('p'));
    pane.querySelectorAll('h2, h3, h4, h5, h6').forEach((h) => contentCell.push(h));

    if (!labelCell.length && !contentCell.length) return;
    cells.push([labelCell.length ? labelCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-people', cells });
  element.replaceWith(block);
}
