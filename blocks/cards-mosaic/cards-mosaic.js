import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-mosaic: image-only photo mosaic. One row per photo: [image] | [optional text].
 * Tiles repeat in groups of five (row of 1 wide + 2 narrow, then a row of 2 tall);
 * tile sizing lives in CSS. Optional text becomes a caption under/over the tile.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-mosaic-list';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-mosaic-item';

    [...row.children].forEach((cell) => {
      const pictures = cell.querySelectorAll('picture');
      if (pictures.length === 1 && !cell.textContent.trim()) {
        cell.className = 'cards-mosaic-image';
        const img = pictures[0].querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { media: '(min-width: 900px)', width: '1000' },
            { width: '750' },
          ]);
          // source tiles are "Large preview" links that open the full image in a new tab
          const link = document.createElement('a');
          link.href = img.src;
          link.target = '_blank';
          link.rel = 'noopener';
          link.setAttribute('aria-label', 'Large preview');
          link.append(optimized);
          cell.replaceChildren(link);
        }
        li.append(cell);
      } else if (cell.textContent.trim() || cell.querySelector('picture, a')) {
        cell.className = 'cards-mosaic-body';
        li.append(cell);
      }
    });

    if (!li.querySelector('.cards-mosaic-image')) li.classList.add('no-image');
    if (li.children.length) ul.append(li);
    row.remove();
  });

  block.replaceChildren(ul);
}
