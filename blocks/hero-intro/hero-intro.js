export default function decorate(block) {
  // The authored content placed the H1 (and the first image) at the top of the
  // section. EDS auto-blocking promotes a leading H1 + adjacent image into a
  // synthetic `hero` block in the PRECEDING section. Reclaim those nodes so the
  // whole hero renders as one unit.
  const reclaimed = { heading: null, images: [] };
  const section = block.closest('.section');
  const prevSection = section?.previousElementSibling;
  if (prevSection && prevSection.querySelector('.hero.block, [data-block-name="hero"]')) {
    const autoHero = prevSection.querySelector('.hero.block, [data-block-name="hero"]');
    reclaimed.heading = autoHero.querySelector('h1, h2');
    autoHero.querySelectorAll('picture').forEach((p) => reclaimed.images.push(p));
    // Remove the now-emptied auto hero section.
    prevSection.remove();
  }

  // Gather block contents: rows = direct children divs, cells = their children.
  const rows = [...block.children];
  const pictures = [];
  let textCell = null;
  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    if (cell.querySelector('picture')) {
      cell.querySelectorAll('picture').forEach((p) => pictures.push(p));
    } else {
      textCell = cell;
    }
  });

  // Prepend reclaimed images so order matches the source (hiphop first).
  const allPictures = [...reclaimed.images, ...pictures];

  // Build the two-column structure: content column + media column.
  const content = document.createElement('div');
  content.className = 'hero-intro-content';
  if (reclaimed.heading) content.append(reclaimed.heading);
  if (textCell) {
    [...textCell.children].forEach((child) => content.append(child));
  }

  const media = document.createElement('div');
  media.className = 'hero-intro-media';
  allPictures.forEach((pic) => {
    // Unwrap any stray <p> the import created; place each picture directly.
    media.append(pic);
  });

  block.textContent = '';
  block.append(content, media);

  // Group the two CTAs into a button row.
  const buttons = content.querySelectorAll('.button-container');
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'hero-intro-buttons';
    buttons.forEach((b) => group.append(b));
    content.append(group);
  }

  // The second CTA in the source is an outline (secondary) button.
  const allButtons = content.querySelectorAll('a.button');
  if (allButtons.length > 1) {
    allButtons[1].classList.add('secondary');
  }

  if (!allPictures.length) block.classList.add('no-image');
}
