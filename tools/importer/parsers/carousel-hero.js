/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://wknd.site/us/en.html
 * Selector: .carousel.cmp-carousel--hero
 * Generated: 2026-02-27
 *
 * Source DOM structure:
 *   .carousel.cmp-carousel--hero
 *     .cmp-carousel > .cmp-carousel__content
 *       .cmp-carousel__item (per slide)
 *         .teaser.cmp-teaser--hero > .cmp-teaser
 *           .cmp-teaser__content
 *             h2.cmp-teaser__title
 *             .cmp-teaser__description (text or <p>)
 *             .cmp-teaser__action-container > a.cmp-teaser__action-link
 *           .cmp-teaser__image > .cmp-image > img
 *
 * Target: Carousel block - 2 columns per row.
 *   Col 1: slide image
 *   Col 2: heading + description + optional CTA link
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image img');
    const heading = slide.querySelector('h2.cmp-teaser__title, h1, h2, h3');
    const descEl = slide.querySelector('.cmp-teaser__description');
    const ctaLink = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // Col 1: image
    const imageCell = img ? [img] : [];

    // Col 2: heading + description + CTA
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (descEl) contentCell.push(descEl);
    if (ctaLink) contentCell.push(ctaLink);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-hero',
    cells,
  });
  element.replaceWith(block);
}
