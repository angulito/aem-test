/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner.
 * Base block: hero
 * Source: https://www.realmadrid.com/es-ES (app-merchandising #1, "Comunidad Madridista")
 * Generated: 2026-06-23
 *
 * Source structure: a single full-width promo banner rendered by <app-merchandising>:
 *   <section.merchandising>
 *     <header> <h2.rm-web-module__title>Comunidad Madridista</h2> </header>
 *     <rm-carousel> ... <a.merchandising__card href>
 *        <span.card__media><img.media>          -> banner image
 *        <div.card__content><h4.card__title>     -> promo heading
 *        <div.card__footer> ... <rm-button>       -> single CTA (button label text)
 *
 * Output: hero block (single column).
 *   Row 1 (optional): full-width banner image.
 *   Row 2: content cell — section title + card title (as headings) + CTA link.
 *
 * Notes:
 *  - Scene7/Dynamic Media <img> is preserved as-is (query params intact); a companion
 *    DM transformer + client auto-block handles responsive rewriting.
 *  - The CTA button is JS-driven (no href on the button), but the wrapping card is an
 *    anchor — its href is used to build a real CTA link with the button label as text.
 *  - Instance selector targets app-merchandising:has(.card__bg) — the single-card promo —
 *    to distinguish it from the multi-card "Tienda Oficial" product carousel (cards-articles).
 */
export default function parse(element, { document }) {
  // The promo card (anchor) carries the destination href and the inner content.
  const card = element.querySelector('a.merchandising__card, .merchandising__card')
    || element;

  // --- Banner image ---
  const image = element.querySelector(
    '.card__media img, img.media, .merchandising__card img, img',
  );

  // --- Section / module title (e.g. "Comunidad Madridista") ---
  const sectionTitle = element.querySelector(
    'header .rm-web-module__title, .rm-web-module__title, header h2',
  );

  // --- Card title (e.g. "Recibe la nueva camiseta cada año") ---
  const cardTitle = element.querySelector('.card__title, h4, h3');

  // --- CTA: prefer the card anchor href + button label text ---
  const ctaButtonLabel = element.querySelector('.rm-button__content');
  const href = (card && card.getAttribute && card.getAttribute('href'))
    || (element.querySelector('a[href]') && element.querySelector('a[href]').getAttribute('href'));

  const cells = [];

  // Row 1 (optional): banner image.
  if (image) cells.push([image]);

  // Row 2: single content cell — headings + CTA stacked.
  const contentCell = [];

  if (sectionTitle && sectionTitle.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = sectionTitle.textContent.trim();
    contentCell.push(h2);
  }

  if (cardTitle && cardTitle.textContent.trim()) {
    const h3 = document.createElement('h3');
    h3.textContent = cardTitle.textContent.trim();
    contentCell.push(h3);
  }

  if (href) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = (ctaButtonLabel && ctaButtonLabel.textContent.trim())
      || (cardTitle && cardTitle.textContent.trim())
      || 'Más información';
    contentCell.push(a);
  } else if (ctaButtonLabel && ctaButtonLabel.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = ctaButtonLabel.textContent.trim();
    contentCell.push(p);
  }

  // Empty-block guard: no image and no text content — unwrap rather than emit empty block.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]); // hero is single-column: one row, one cell holding all content

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
