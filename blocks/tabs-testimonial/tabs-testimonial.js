// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  // each row = one testimonial: cell 1 -> tab content, cell 2 -> panel content
  const rows = [...block.children];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const tabContent = cells[0];
    const panelContent = cells[1] || cells[0];
    const id = toClassName(tabContent.textContent);

    // --- panel ---
    const tabpanel = row;
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // wrap panel content in a grid: image cell + text cell
    const grid = document.createElement('div');
    grid.className = 'tabs-testimonial-panel-grid';

    const imgCell = document.createElement('div');
    imgCell.className = 'tabs-testimonial-panel-media';
    const textCell = document.createElement('div');
    textCell.className = 'tabs-testimonial-panel-body';

    [...panelContent.children].forEach((el) => {
      if (el.querySelector('picture, img')) {
        imgCell.append(el);
      } else {
        textCell.append(el);
      }
    });

    // tag role + quote paragraphs inside text cell
    const textParas = [...textCell.children];
    textParas.forEach((p) => {
      if (p.querySelector('strong')) {
        p.classList.add('tabs-testimonial-panel-name');
      } else if (/[“"]/.test(p.textContent)) {
        p.classList.add('tabs-testimonial-panel-quote');
      } else {
        p.classList.add('tabs-testimonial-panel-role');
      }
    });

    grid.append(imgCell, textCell);
    // remove leftover wrapper cells then attach grid
    cells.forEach((c) => c.remove());
    tabpanel.append(grid);

    // --- tab button ---
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tabContent.innerHTML;
    [...button.children].forEach((p) => {
      if (p.querySelector('picture, img')) {
        p.classList.add('tabs-testimonial-tab-media');
      } else if (p.querySelector('strong')) {
        p.classList.add('tabs-testimonial-tab-name');
      } else {
        p.classList.add('tabs-testimonial-tab-role');
      }
    });
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
  });

  // panels stay in DOM order; tablist appended AFTER (tabs below panels, matching source)
  block.append(tablist);
}
