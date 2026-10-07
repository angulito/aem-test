/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-split. Base: columns.
 * Source: https://new.express.adobe.com/webpage/DYft29Wzo0QLK
 * Instance selectors:
 *   .article > .section.split-layout.image-on-left   -> [image] | [text]
 *   .article > .section.split-layout.image-on-right  -> [text]  | [image]
 *
 * Block contract (blocks/columns-split/columns-split.js): one row, two cells; the
 * image-only cell becomes the media half and authored cell order sets the image side.
 *
 * Validated selectors (source.html + instances/01.html):
 *   .section-background-image img (or inline background-image style) -> image
 *   .section-content .content-container -> heading (h3) + paragraphs
 *   button.page-heading-anchor -> "Copy link" control, excluded
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

export default function parse(element, { document }) {
  const bgWrap = element.querySelector('.section-background-image');
  const image = (bgWrap && bgWrap.querySelector('img'))
    || element.querySelector('.section-background img')
    || imageFromBackground(document, bgWrap);

  const container = element.querySelector('.section-content .content-container')
    || element.querySelector('.section-content-view')
    || element.querySelector('.section-content');

  const textCell = [];
  if (container) {
    [...container.children].forEach((child) => {
      if (child.matches('button, .page-heading-anchor, .anchor-tooltip')) return;
      if (!child.textContent.trim() && !child.querySelector('img, picture, a[href]')) return;
      textCell.push(child);
    });
  }

  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Preserve source layout: image-on-right => text cell first.
  const imageOnRight = element.classList.contains('image-on-right');
  const imageCell = image ? [image] : '';
  const row = imageOnRight ? [textCell, imageCell] : [imageCell, textCell];

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-split', cells });
  element.replaceWith(block);
}
