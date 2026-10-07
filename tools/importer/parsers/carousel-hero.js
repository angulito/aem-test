/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html (.carousel.cmp-carousel--hero)
 * Generated: 2026-09-01
 *
 * Library structure (Carousel): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one slide: cell 1 = image (only), cell 2 = text content
 * (title + description + CTA).
 */
export default function parse(element, { document }) {
  // Each carousel slide is a tabpanel item containing a teaser.
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));

  const cells = [];

  slides.forEach((slide) => {
    // Image cell — the slide image lives inside the teaser image wrapper.
    const img = slide.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

    // Text cell — title, description, CTA.
    const textCell = [];
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3');
    const description = slide.querySelector('.cmp-teaser__description, p');
    const cta = slide.querySelector('.cmp-teaser__action-link, a[href]');

    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);

    // Only add a slide row if it has real content.
    if (img || textCell.length) {
      cells.push([img || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard: if no slides were found, unwrap gracefully.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
