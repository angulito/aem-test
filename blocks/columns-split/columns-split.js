/**
 * columns-split: 50/50 half-bleed split. One cell per side; the cell holding only an image
 * becomes the edge-to-edge, full-height media half. Image side follows authored cell order
 * ([image] | [text] = image left, [text] | [image] = image right).
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const maxCols = rows.reduce((max, row) => Math.max(max, row.children.length), 0);
  block.classList.add(`columns-split-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-split-row');
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      const textOnlyImage = pic && !cell.textContent.trim()
        && cell.querySelectorAll('picture').length === 1;
      if (textOnlyImage) {
        cell.classList.add('columns-split-img-col');
        // unwrap the <p> around the picture so it can fill the cell
        const wrapper = pic.parentElement;
        if (wrapper && wrapper !== cell && wrapper.tagName === 'P') {
          wrapper.replaceWith(pic);
        }
      } else {
        cell.classList.add('columns-split-text-col');
      }
    });

    const imgIndex = cells.findIndex((c) => c.classList.contains('columns-split-img-col'));
    if (imgIndex === 0 && cells.length > 1) row.classList.add('columns-split-image-first');
    else if (imgIndex > 0) row.classList.add('columns-split-image-last');
  });
}
