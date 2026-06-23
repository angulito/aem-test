/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-news.
 * Base block: carousel
 * Source: https://www.realmadrid.com/es-ES (Angular SPA, /es-ES locale)
 * Generated: 2026-06-23
 *
 * Maps the horizontal news carousels ("Noticias Madridistas", "Especiales") rendered
 * by <app-news-herobanner>. Each carousel lives in <rm-carousel.carousel-news> and
 * holds repeating <app-news-item> slides:
 *   <app-news-item> > <a.rm-news-item__link href> (or <button>) >
 *     <figure> > <picture><img.rm-news-item__image> + <figcaption><p.rm-news-item__excerpt>
 *
 * Output: carousel block — 2 columns, one row per slide: [ image | text content ].
 * The text-content cell holds the slide headline (as a heading) + optional CTA link.
 *
 * Notes:
 *  - Scene7/Dynamic Media <img> elements are preserved as-is (query params intact);
 *    a companion DM transformer + client auto-block handles responsive rewriting.
 *  - Client-side rendered; selectors include fallbacks for slide-markup variation.
 *  - Instance selector targets titled herobanners (header .rm-web-module__title) so it
 *    matches only the carousel modules, not the untitled news grids (those are cards).
 */
export default function parse(element, { document }) {
  // Each slide is an <app-news-item>. Fall back to the inner link wrapper if the
  // custom element is not present in the rendered DOM.
  let slides = Array.from(element.querySelectorAll('app-news-item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('a.rm-news-item__link, .carousel-news__item'));
  }
  slides = [...new Set(slides)];

  const cells = [];

  slides.forEach((slide) => {
    // --- Image (first cell, mandatory) ---
    // Prefer a content image, skipping inline data-uri play-button icons.
    const imgs = Array.from(slide.querySelectorAll('img'));
    const image = imgs.find((img) => {
      const src = img.getAttribute('src') || '';
      return src && !src.startsWith('data:');
    }) || imgs[0] || null;

    // --- Headline text ---
    const excerpt = slide.querySelector(
      '.rm-news-item__excerpt, figcaption p, h2, h3, [class*="__excerpt"], [class*="__title"]',
    );
    const headingText = excerpt ? excerpt.textContent.trim() : '';

    // --- Slide link ---
    let href = null;
    if (slide.tagName === 'A' && slide.getAttribute('href')) {
      href = slide.getAttribute('href');
    } else {
      const innerLink = slide.querySelector('a[href]');
      if (innerLink) href = innerLink.getAttribute('href');
    }

    // Skip empty slides (no image and no text).
    if (!image && !headingText) return;

    // --- Build text-content cell: headline (heading) + optional CTA ---
    const contentCell = [];
    if (headingText) {
      const h = document.createElement('h3');
      h.textContent = headingText;
      contentCell.push(h);
    }
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = headingText || 'Ver más';
      contentCell.push(a);
    }

    // 2-column row: [ image | text content ]. Pad either cell if missing.
    cells.push([image || '', contentCell.length ? contentCell : '']);
  });

  // Empty-block guard: nothing to carousel — unwrap rather than emit empty block.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-news', cells });
  element.replaceWith(block);
}
