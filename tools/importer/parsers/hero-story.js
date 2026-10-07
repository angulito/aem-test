/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-story. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section.inverse-section .grid-layout.desktop-1-column
 * Structure: 1 column — row 1: background image (optional); row 2: heading, subheading, CTA(s).
 * Source: img.cover-image (overlay background) + .card-body (h2, p.subheading, .button-group a).
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  const body = element.querySelector('.card-body') || element;

  // Background image: first image outside the content body
  const bgImage = [...element.querySelectorAll('img')].find((img) => !body.contains(img) || body === element);

  const heading = body.querySelector('h1, h2, h3');
  const paragraphs = [...body.querySelectorAll('p')].filter((p) => !p.closest('.button-group'));
  const ctas = [...body.querySelectorAll('.button-group a, a.button')]
    .filter((a, i, arr) => arr.indexOf(a) === i);

  if (!heading && !paragraphs.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  contentCell.push(...ctas);
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-story', cells });
  element.replaceWith(block);
}
