/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Frame.io Carousel block (CarouselWithTouts pattern)
 *
 * Source: https://frame.io/
 * Base Block: carousel
 *
 * Source HTML Pattern:
 * <article class="CarouselWithTouts_*">
 *   <div class="Carousel_wrapper__*">
 *     <div class="Carousel_slide__*">
 *       <img src="..." alt="...">
 *     </div>
 *   </div>
 *   <div class="CarouselWithTouts_touts__*">
 *     <div class="Tout_*">
 *       <h3>Title</h3>
 *       <p>Description</p>
 *     </div>
 *   </div>
 * </article>
 *
 * Generated: 2026-02-06
 */
export function matches(element) {
  return hasClass(element, 'CarouselWithTouts_') || hasClass(element, 'Carousel_wrapper');
}

export default function parse(element, { document }) {
  const cells = [];

  const slides = Array.from(element.querySelectorAll('[class*="Carousel_slide"], [class*="slide_"]'));
  const touts = Array.from(element.querySelectorAll('[class*="Tout_tout"], [class*="tout_container"]'));

  const maxItems = Math.max(slides.length, touts.length);

  for (let i = 0; i < maxItems; i++) {
    const slide = slides[i];
    const tout = touts[i];

    const imgCell = [];
    if (slide) {
      const img = slide.querySelector('img');
      if (img) imgCell.push(img.cloneNode(true));
    }

    const textCell = [];
    if (tout) {
      const title = tout.querySelector('h3, h4, [class*="title"]');
      const desc = tout.querySelector('p, [class*="description"]');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
    }

    cells.push([
      imgCell.length > 0 ? imgCell : '',
      textCell.length > 0 ? textCell : '',
    ]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
  element.replaceWith(block);
}

function hasClass(el, partial) {
  if (!el || !el.className) return false;
  return (typeof el.className === 'string' ? el.className : '').includes(partial);
}
