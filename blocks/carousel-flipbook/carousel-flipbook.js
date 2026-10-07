/**
 * carousel-flipbook: scroll-driven "flipbook" (all viewports). A sticky full-viewport backdrop
 * holds one photo per slide; each slide's translucent card scrolls up over it. Scroll position
 * drives (like the source):
 *   - the cross-fade: the next photo fades in on top while the previous card's bottom edge
 *     travels from 50% of the viewport to the top;
 *   - a slow zoom-in (scale 1 -> 1.2) on each photo over its step.
 * There are no arrows or dots.
 *
 * Content contract (one row per slide):
 *   [image] | [heading + optional paragraph / CTA]
 * A slide whose text cell holds only a heading is treated as a title slide (centered card).
 */

const ZOOM_MAX = 0.2; // source pan-and-zoom "zoom-in": scale(1) -> scale(1.2)

let flipbookId = 0;

const clamp = (v) => Math.min(1, Math.max(0, v));

function setActive(block, index) {
  if (block.dataset.activeSlide === String(index)) return;
  block.dataset.activeSlide = index;
  block.querySelectorAll('.carousel-flipbook-backdrop-frame').forEach((frame, i) => {
    frame.classList.toggle('is-active', i === index);
  });
  block.querySelectorAll('.carousel-flipbook-slide').forEach((slide, i) => {
    slide.classList.toggle('is-active', i === index);
  });
}

function bindScroll(block, backdrop, slides) {
  const frames = [...backdrop.children];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  let inView = false;

  const update = () => {
    ticking = false;
    const vh = backdrop.offsetHeight || window.innerHeight;
    const rects = slides.map((slide) => slide.getBoundingClientRect());
    let active = 0;
    rects.forEach((rect, i) => {
      const frame = frames[i];
      if (!frame) return;
      // fade in once the previous card's bottom edge has passed the middle of the viewport
      const opacity = i === 0 ? 1 : clamp((vh * 0.5 - rects[i - 1].bottom) / (vh * 0.5));
      // zoom from the start of the step until this card's bottom edge reaches 25% of the viewport
      const zoom = reduceMotion.matches
        ? 0
        : clamp((vh * 1.25 + rect.height - rect.bottom) / (vh + rect.height));
      frame.style.setProperty('--carousel-flipbook-frame-opacity', opacity.toFixed(3));
      frame.style.setProperty('--carousel-flipbook-frame-scale', (1 + ZOOM_MAX * zoom).toFixed(4));
      if (opacity >= 0.5) active = i;
    });
    setActive(block, active);
  };

  const requestUpdate = () => {
    if (!inView || ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    requestUpdate();
  }, { rootMargin: '50% 0px' }).observe(block);

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reduceMotion.addEventListener('change', requestUpdate);
  update();
}

export default function decorate(block) {
  flipbookId += 1;
  block.id = block.id || `carousel-flipbook-${flipbookId}`;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];

  const backdrop = document.createElement('div');
  backdrop.className = 'carousel-flipbook-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const list = document.createElement('ol');
  list.className = 'carousel-flipbook-slides';

  rows.forEach((row, idx) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-flipbook-slide';
    slide.dataset.slideIndex = idx;
    slide.id = `${block.id}-slide-${idx}`;

    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture') && !c.textContent.trim());
    const textCells = cells.filter((c) => c !== imageCell);

    // the slide photo becomes a (decorative) frame of the sticky backdrop
    const frame = document.createElement('div');
    frame.className = 'carousel-flipbook-backdrop-frame';
    const picture = imageCell && imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.alt = '';
        img.decoding = 'async';
      }
      frame.append(picture);
    } else {
      // keep frame indexes aligned with slide indexes
      frame.classList.add('carousel-flipbook-backdrop-empty');
      slide.classList.add('no-image');
    }
    backdrop.append(frame);

    const content = document.createElement('div');
    content.className = 'carousel-flipbook-slide-content';
    textCells.forEach((cell) => {
      while (cell.firstChild) content.append(cell.firstChild);
    });
    if (content.textContent.trim()) {
      const nonHeading = [...content.children].filter((el) => !/^H[1-6]$/.test(el.tagName));
      if (!nonHeading.some((el) => el.textContent.trim())) {
        slide.classList.add('carousel-flipbook-slide-title');
      }
      const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.id) slide.setAttribute('aria-labelledby', heading.id);
      slide.append(content);
    }

    list.append(slide);
    row.remove();
  });

  block.append(backdrop, list);

  const slides = [...list.children];
  if (!slides.length) return;
  setActive(block, 0);
  bindScroll(block, backdrop, slides);
}
