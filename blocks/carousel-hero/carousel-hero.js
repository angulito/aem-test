export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  const key = 'abbvie-hero-slide-index';
  let idx = parseInt(localStorage.getItem(key) || '0', 10);
  if (Number.isNaN(idx) || idx >= rows.length) idx = 0;
  localStorage.setItem(key, String((idx + 1) % rows.length));

  const chosen = rows[idx];
  rows.forEach((row, i) => {
    if (i !== idx) row.remove();
  });

  const slide = document.createElement('div');
  slide.classList.add('carousel-hero-slide');

  chosen.querySelectorAll(':scope > div').forEach((col, colIdx) => {
    col.classList.add(colIdx === 0 ? 'carousel-hero-slide-image' : 'carousel-hero-slide-content');
    slide.append(col);
  });
  chosen.remove();

  block.append(slide);
}
