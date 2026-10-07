/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-mosaic. Base: cards.
 * Source: https://new.express.adobe.com/webpage/DYft29Wzo0QLK
 * Instance selector: .article > .section.photo-grid-section
 *
 * Block contract (blocks/cards-mosaic/cards-mosaic.js): one row per photo,
 *   [image] | [optional caption]
 * Tile sizing (groups of 5: wide + 2 narrow, then 2 tall) lives in CSS, so only the photo
 * order matters here.
 *
 * Validated selectors (source.html):
 *   .photo-grid .photo-container.tile  -> one tile per photo (iteration key: block-level div
 *                                         wrapper, not the inline a.photo-image anchors)
 *   a.photo-image                      -> empty anchor; href = 1024px rendition.
 *                                         express-cleanup inserts an <img> inside it.
 *   .caption / figcaption              -> optional caption (not present on source page)
 */
function imageForTile(document, tile) {
  const existing = tile.querySelector('img');
  if (existing) return existing;
  const a = tile.querySelector('a.photo-image') || tile.querySelector('a[href]');
  let src = null;
  if (a) {
    const href = a.getAttribute('href');
    if (href && href !== '#') src = href;
    if (!src) {
      const style = a.getAttribute('style') || '';
      const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
      if (m) src = m[1];
    }
    if (!src && a.getAttribute('data-src')) src = a.getAttribute('data-src');
  }
  if (!src) return null;
  const img = document.createElement('img');
  img.src = src;
  const alt = a && (a.getAttribute('data-alt') || '');
  if (alt) img.alt = alt;
  return img;
}

export default function parse(element, { document }) {
  let tiles = [...element.querySelectorAll('.photo-grid .photo-container')];
  if (!tiles.length) tiles = [...element.querySelectorAll('.photo-container, .tile')];

  const cells = [];
  tiles.forEach((tile) => {
    const image = imageForTile(document, tile);
    const caption = tile.querySelector('.caption, figcaption');
    const captionText = caption && caption.textContent.trim();
    if (!image && !captionText) return;
    let textCell = '';
    if (captionText) {
      const p = document.createElement('p');
      p.textContent = captionText;
      textCell = p;
    }
    cells.push([image || '', textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-mosaic', cells });
  element.replaceWith(block);
}
