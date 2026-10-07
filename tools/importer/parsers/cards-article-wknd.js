/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article (WKND "Latest Articles")
 * Base block: cards
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section:nth-of-type(4) .grid-layout.desktop-4-column
 *
 * Emits a "cards" block (named cards-article) following the Cards convention:
 * a 2-column table, one row per card — cell 1 = image (mandatory),
 * cell 2 = text content (title heading + optional category/date + linked title).
 *
 * Source structure: a grid containing repeated `a.article-card`:
 *   a.article-card[href]
 *     .article-card-image > img.cover-image
 *     .article-card-body
 *       .article-card-meta > span.tag (category) + span (date)
 *       h3.h4-heading (title)
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope > a.article-card, a.article-card');
  const cells = [];

  cards.forEach((card) => {
    const href = card.getAttribute('href') || '';
    const image = card.querySelector('img.cover-image, .article-card-image img, img');
    const tag = card.querySelector('.article-card-meta .tag, .tag');
    const date = card.querySelector('.article-card-meta span:not(.tag), .article-card-meta .paragraph-sm');
    const title = card.querySelector('h3.h4-heading, h3, h2, h4');

    // Cell 1: image (mandatory per Cards convention)
    const imageCell = image ? [image] : [];

    // Cell 2: text content — title (as heading/CTA link) + category + date
    const bodyCell = [];
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = tag.textContent.trim();
      p.append(em);
      bodyCell.push(p);
    }
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      bodyCell.push(p);
    }
    if (title && title.textContent.trim()) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title.textContent.trim();
        h.append(a);
      } else {
        h.textContent = title.textContent.trim();
      }
      bodyCell.push(h);
    }

    if (imageCell.length || bodyCell.length) {
      cells.push([imageCell, bodyCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
