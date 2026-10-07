import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-cover: full-viewport background photo with a centered title + byline overlay.
 * Content contract (1 column):
 *   Row 1: background image
 *   Row 2: heading (h1) + subheading/byline (+ optional CTA)
 * Tolerates the image and text sharing one cell, rows in either order, or a missing image.
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const media = document.createElement('div');
  media.className = 'hero-cover-media';

  if (picture) {
    const img = picture.querySelector('img');
    const optimized = img
      ? createOptimizedPicture(img.src, img.alt || '', true, [
        { media: '(min-width: 1200px)', width: '2400' },
        { media: '(min-width: 600px)', width: '1600' },
        { width: '900' },
      ])
      : picture;
    // LCP image: keep it eager + high priority
    optimized.querySelectorAll('img').forEach((optimizedImg) => {
      optimizedImg.loading = 'eager';
      optimizedImg.fetchPriority = 'high';
      optimizedImg.decoding = 'async';
    });
    // drop the now-empty wrapper (p/div) the authored picture lived in
    const holder = picture.closest('p') || picture.parentElement;
    picture.remove();
    if (holder && holder !== block && !holder.textContent.trim() && !holder.querySelector('img')) {
      holder.remove();
    }
    media.append(optimized);
  } else {
    block.classList.add('no-image');
  }

  const content = document.createElement('div');
  content.className = 'hero-cover-content';
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    [...row.children].forEach((cell) => {
      while (cell.firstChild) content.append(cell.firstChild);
    });
    row.remove();
  });
  // strip whitespace-only text nodes left behind by the move
  [...content.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });

  // byline / subtitle: first paragraph after the heading
  const heading = content.querySelector('h1, h2');
  let subtitle = heading ? heading.nextElementSibling : null;
  while (subtitle && (subtitle.tagName !== 'P' || subtitle.querySelector('a, picture'))) {
    subtitle = subtitle.nextElementSibling;
  }
  if (subtitle) subtitle.classList.add('hero-cover-subtitle');

  // soft dark band behind the title (source: span.gradient-overlay)
  const gradient = document.createElement('span');
  gradient.className = 'hero-cover-gradient';
  gradient.setAttribute('aria-hidden', 'true');
  content.prepend(gradient);

  if (picture) block.append(media);
  block.append(content);
}
