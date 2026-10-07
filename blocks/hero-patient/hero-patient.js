export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((r) => r.querySelector('picture, a'));
  const contentRow = rows.find((r) => r !== imageRow && r.querySelector('h1, h2, h3, p'));

  if (imageRow) imageRow.classList.add('hero-patient-image');
  if (contentRow) contentRow.classList.add('hero-patient-content');

  if (!imageRow || !imageRow.querySelector('picture')) {
    block.classList.add('no-image');
  }
}
