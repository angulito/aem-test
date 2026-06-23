/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-app.
 * Base block: columns
 * Source: https://www.realmadrid.com/es-ES (app-footer-sponsors, "Real Madrid App" promo)
 * Generated: 2026-06-23
 *
 * Source structure: the app-download promo inside the footer:
 *   <section.rm-stores>
 *     <p.rm-stores__title>Descarga ahora</p>      -> small kicker / eyebrow
 *     <h2.rm-stores__subtitle>Real Madrid App</h2> -> heading
 *     <ul.rm-stores__list>
 *       <li.rm-stores__item><a.rm-stores__link href><img.rm-stores__img></a></li> ... (store badges)
 *
 * Output: columns block (2 columns, single row):
 *   Cell 1 — promo text: heading ("Real Madrid App") + kicker ("Descarga ahora").
 *   Cell 2 — store-badge links (Google Play / App Store / AppGallery) as <a><img></a>.
 *
 * Notes:
 *  - Scene7/Dynamic Media badge <img> elements are preserved as-is (query params intact);
 *    a companion DM transformer + client auto-block handles responsive rewriting.
 *  - Selector may resolve to the whole <app-footer-sponsors>; in that case we narrow to
 *    the inner .rm-stores section so only the app promo is captured.
 */
export default function parse(element, { document }) {
  // Narrow to the app-download promo section if a broader element was matched.
  const root = element.matches && element.matches('.rm-stores')
    ? element
    : (element.querySelector('section.rm-stores, .rm-stores') || element);

  // --- Text content ---
  const kicker = root.querySelector('.rm-stores__title, p.rm-stores__title');
  const heading = root.querySelector('.rm-stores__subtitle, h2.rm-stores__subtitle, h2');

  // --- Store-badge links (each wraps a badge image) ---
  const storeLinks = Array.from(
    root.querySelectorAll('.rm-stores__list a.rm-stores__link, .rm-stores__item a[href], ul a[href] img'),
  )
    // Normalize: if a selector matched an <img>, climb to its anchor.
    .map((el) => (el.tagName === 'IMG' ? el.closest('a') || el : el))
    .filter(Boolean);
  // De-duplicate (the img-fallback selector can overlap the anchor selector).
  const uniqueLinks = [...new Set(storeLinks)].filter((a) => a.tagName === 'A');

  // --- Build the two column cells ---
  const textCell = [];
  if (heading && heading.textContent.trim()) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.push(h);
  }
  if (kicker && kicker.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = kicker.textContent.trim();
    textCell.push(p);
  }

  const linksCell = [];
  uniqueLinks.forEach((a) => linksCell.push(a));

  // Empty-block guard: no text and no store links — unwrap rather than emit empty block.
  if (!textCell.length && !linksCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single 2-column row: [ promo text | store badges ]. Pad an empty cell if needed.
  const cells = [[
    textCell.length ? textCell : '',
    linksCell.length ? linksCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}
