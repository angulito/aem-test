/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd.site/us/en.html (.image-list.list)
 * Generated: 2026-09-01
 *
 * Library structure (Cards): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one card: cell 1 = image, cell 2 = text content
 * (title as linked heading + description).
 *
 * Source is a <ul class="cmp-image-list"> with one <li> per article card.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item'));

  const cells = [];

  items.forEach((item) => {
    // Image cell.
    const img = item.querySelector('.cmp-image-list__item-image img, img.cmp-image__image, img');

    // Title link — wrap the title in an <a> so the card links to the article.
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');

    const textCell = [];

    if (titleText) {
      const heading = document.createElement('h3');
      const href = titleLink ? titleLink.getAttribute('href') : null;
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleText.textContent.trim();
        heading.appendChild(a);
      } else {
        heading.textContent = titleText.textContent.trim();
      }
      textCell.push(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }

    if (img || textCell.length) {
      cells.push([img || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
