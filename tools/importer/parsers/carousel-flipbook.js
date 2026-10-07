/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-flipbook. Base: carousel.
 * Source: https://new.express.adobe.com/webpage/DYft29Wzo0QLK
 * Instance selector: .article > .section.card-flipbook-section
 *
 * Block contract (blocks/carousel-flipbook/carousel-flipbook.js): one row per slide,
 *   [image] | [heading + optional paragraph / CTA]
 * A heading-only text cell (first slide, h2 "Highlights") is rendered as a title slide.
 *
 * Validated selectors (source.html):
 *   .section-background > .section-background-image (xN)  -> slide images, document order
 *   .section-content > .section-content-view (xN)          -> slide text cards, same order
 *   button.page-heading-anchor                              -> "Copy link" control, excluded
 * Slides are paired by index. Iteration keys are block-level div wrappers (iterationSafe).
 */
function imageFromBackground(document, el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  if (!m) return null;
  const img = document.createElement('img');
  img.src = m[1];
  const alt = el.getAttribute('data-alt');
  if (alt) img.alt = alt;
  return img;
}

function getImage(document, wrap) {
  if (!wrap) return null;
  return wrap.querySelector('img') || imageFromBackground(document, wrap);
}

function getTextContent(view) {
  if (!view) return [];
  const container = view.querySelector('.content-container') || view;
  return [...container.children].filter((child) => {
    if (child.matches('button, .page-heading-anchor, .anchor-tooltip')) return false;
    return child.textContent.trim() || child.querySelector('img, picture, a[href]');
  });
}

export default function parse(element, { document }) {
  let bgWraps = [...element.querySelectorAll(':scope .section-background > .section-background-image')];
  if (!bgWraps.length) bgWraps = [...element.querySelectorAll('.section-background-image')];

  let views = [...element.querySelectorAll(':scope .section-content > .section-content-view')];
  if (!views.length) views = [...element.querySelectorAll('.section-content-view')];

  const count = Math.max(bgWraps.length, views.length);
  const cells = [];
  for (let i = 0; i < count; i += 1) {
    const image = getImage(document, bgWraps[i]);
    const text = getTextContent(views[i]);
    if (!image && !text.length) continue;
    cells.push([image ? [image] : '', text.length ? text : '']);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-flipbook', cells });
  element.replaceWith(block);
}
