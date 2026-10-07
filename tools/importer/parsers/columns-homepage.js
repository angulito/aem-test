/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-homepage
 * Base block: columns
 * Source: https://www.abbvie.com/
 * Selector: .container.homepage-overlap .cmp-grid-custom
 * Generated: 2026-06-08
 *
 * Two-column layout:
 *   Column 1: "Press Releases" heading + carousel of news links (date + title)
 *   Column 2: "Featured" heading + image + title + CTA link
 */
export default function parse(element, { document }) {
  // Get top-level grid columns
  const gridRow = element.querySelector(':scope .grid-container > .grid-row');
  const columns = gridRow ? gridRow.querySelectorAll(':scope > .grid-cell') : [];

  // --- Column 1: Press Releases (first grid-cell, col-with-4) ---
  const col1Cell = [];
  const col1 = element.querySelector(':scope .grid-row > .grid-row__col-with-4');

  if (col1) {
    // Header text
    const col1Header = col1.querySelector('.cmp-header__text');
    if (col1Header) {
      const h3 = document.createElement('h3');
      h3.textContent = col1Header.textContent.trim();
      col1Cell.push(h3);
    }

    // Carousel RSS links (extract all news items as a list)
    const rssLinks = col1.querySelectorAll('.carousel-rss__link');
    if (rssLinks.length > 0) {
      const list = document.createElement('ul');
      rssLinks.forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        const eyebrow = link.querySelector('.carousel-rss__eyebrow');
        const title = link.querySelector('.carousel-rss__title');
        const linkText = [];
        if (eyebrow) linkText.push(eyebrow.textContent.trim());
        if (title) linkText.push(title.textContent.trim());
        a.textContent = linkText.join(' - ');
        li.appendChild(a);
        list.appendChild(li);
      });
      col1Cell.push(list);
    }
  }

  // --- Column 2: Featured (last grid-cell, col-with-7 at top level) ---
  const col2Cell = [];
  // Use the top-level col-with-7 (direct child of grid-row)
  const col2 = element.querySelector(':scope .grid-container > .grid-row > .grid-row__col-with-7');

  if (col2) {
    // Header text
    const col2Header = col2.querySelector(':scope > .header .cmp-header__text');
    if (col2Header) {
      const h3 = document.createElement('h3');
      h3.textContent = col2Header.textContent.trim();
      col2Cell.push(h3);
    }

    // Featured image (nested inside the inner grid)
    const featuredImage = col2.querySelector('.cmp-image__image');
    if (featuredImage) {
      col2Cell.push(featuredImage);
    }

    // Featured title
    const featuredTitle = col2.querySelector('.cmp-title__text');
    if (featuredTitle) {
      col2Cell.push(featuredTitle);
    }

    // Featured CTA link
    const featuredCta = col2.querySelector('.cmp-button');
    if (featuredCta) {
      col2Cell.push(featuredCta);
    }
  }

  // Build cells: one row with two columns
  const cells = [
    [col1Cell, col2Cell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-homepage', cells });
  element.replaceWith(block);
}
