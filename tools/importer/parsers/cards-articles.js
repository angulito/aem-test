/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles.
 * Base block: cards
 * Source: https://www.realmadrid.com/es-ES (Angular SPA, /es-ES locale)
 * Generated: 2026-06-23
 *
 * This variant is reused across several heterogeneous Real Madrid modules, all of
 * which render as repeating "card" items (image + headline/label + optional link):
 *   - app-news-herobanner  : <app-news-item> with <a.rm-news-item__link>/<button>
 *                            wrapping <figure> > <picture><img.rm-news-item__image>
 *                            and <figcaption><p.rm-news-item__excerpt>
 *   - app-merchandising     : <a.merchandising__card> with <img.media>, <h4.card__title>,
 *                            and a CTA button (.rm-button__content)
 *   - app-palmares          : <li.rm-palmares__item> trophy rows (icon img + label/count text)
 *   - app-stadium-camera    : <button.stadium-cameras__position> camera tiles
 *                            (.stadium-cameras__number + .stadium-cameras__site) + figure img
 *
 * Output: cards block — 2 columns, one row per card: [ image | text content ].
 * The text-content cell holds: heading/label (as a heading) + optional CTA link.
 *
 * Notes:
 *  - Scene7/Dynamic Media <img> elements are preserved as-is (query params intact);
 *    a companion DM transformer + client auto-block handles responsive rewriting.
 *  - Heavily client-side rendered: selectors include fallbacks for cross-module variation.
 *  - The news-grid instance selector targets untitled herobanners
 *    (main.rm-web-module__main--notitle) so it excludes the titled carousel modules.
 */
export default function parse(element, { document }) {
  // Collect candidate "card" items across the supported module shapes.
  // Each selector targets a distinct, mutually-exclusive item container.
  let items = Array.from(
    element.querySelectorAll(
      'app-news-item, a.merchandising__card, li.rm-palmares__item, button.stadium-cameras__position',
    ),
  );

  // Fallback: generic news-item link / merchandising card if the above found nothing.
  if (!items.length) {
    items = Array.from(
      element.querySelectorAll('a.rm-news-item__link, [class*="__card"], [class*="__item"]'),
    );
  }
  // De-duplicate in case overlapping fallback selectors matched the same node.
  items = [...new Set(items)];

  // Shared fallback image for modules where the picture lives at module level rather
  // than per-card (e.g. app-stadium-camera: one stadium photo + camera-position tiles).
  const sharedImage = element.querySelector(
    'picture.stadium-cameras__figure img, .stadium-cameras__figure img',
  );

  const cells = [];

  items.forEach((item) => {
    // --- Image (first cell, mandatory) ---
    // Prefer a real content image; skip decorative SVG/data-uri play buttons.
    const imgs = Array.from(item.querySelectorAll('img'));
    let image = imgs.find((img) => {
      const src = img.getAttribute('src') || '';
      return src && !src.startsWith('data:'); // skip inline data-uri play icons
    }) || imgs[0] || null;
    // Fall back to the module-level image when the card has none (stadium cameras).
    if (!image && sharedImage) image = sharedImage.cloneNode(true);

    // --- Heading / label text ---
    const headingSrc = item.querySelector(
      'h2, h3, h4, .card__title, .rm-news-item__excerpt, .stadium-cameras__site, .rm-palmares__name, .rm-bar__title, [class*="__name"], [class*="__title"], [class*="__excerpt"], [class*="__site"]',
    );

    // --- CTA / link ---
    // If the item itself is an anchor, that is the card link. Otherwise look inside.
    let linkEl = null;
    let href = null;
    if (item.tagName === 'A' && item.getAttribute('href')) {
      linkEl = item;
      href = item.getAttribute('href');
    } else {
      const innerLink = item.querySelector('a[href]');
      if (innerLink) {
        linkEl = innerLink;
        href = innerLink.getAttribute('href');
      }
    }

    // CTA button label (merchandising) — used as link text when present.
    const buttonLabel = item.querySelector('.rm-button__content');

    // Skip items that have neither image nor any text — they are empty shells.
    const headingText = headingSrc ? headingSrc.textContent.trim() : '';
    const ctaText = buttonLabel ? buttonLabel.textContent.trim() : '';
    if (!image && !headingText && !ctaText) return;

    // --- Build the text-content cell ---
    const contentCell = [];

    if (headingText) {
      const h = document.createElement('h3');
      h.textContent = headingText;
      contentCell.push(h);
    }

    // Build a CTA anchor if we have an href. Prefer the button label, then heading
    // text, then a generic "Ver más" so the link is never empty.
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = ctaText || headingText || (linkEl && linkEl.textContent.trim()) || 'Ver más';
      contentCell.push(a);
    } else if (ctaText) {
      // No href but there is button label text (e.g. JS-driven button) — keep as text.
      const p = document.createElement('p');
      p.textContent = ctaText;
      contentCell.push(p);
    }

    // 2-column row: [ image | text content ]. Pad either cell if missing.
    cells.push([image || '', contentCell.length ? contentCell : '']);
  });

  // Empty-block guard: nothing card-like found — unwrap rather than emit empty block.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
