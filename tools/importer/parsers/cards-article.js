/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row = one article card
 * - Column 1 = image
 * - Column 2 = body (tag, date, heading)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="grid-layout desktop-4-column ...">
 *   <a href="/blog/..." class="article-card card-link">
 *     <div class="article-card-image">
 *       <img src="..." alt="..." class="cover-image">
 *     </div>
 *     <div class="article-card-body">
 *       <div class="article-card-meta">
 *         <span class="tag">Casual Cool</span>
 *         <span class="paragraph-sm utility-text-secondary">May 12</span>
 *       </div>
 *       <h3 class="h4-heading">Tennis style, redefined</h3>
 *     </div>
 *   </a>
 *   ...
 * </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find article cards
  // VALIDATED: Captured DOM uses <a class="article-card card-link"> elements
  const cards = Array.from(element.querySelectorAll('a.article-card, .article-card'));

  // Fallback: try generic card patterns
  const articleCards = cards.length > 0 ? cards :
    Array.from(element.querySelectorAll(':scope > a, :scope > div'));

  articleCards.forEach(card => {
    // Column 1: Image
    // VALIDATED: Image is inside <div class="article-card-image"><img class="cover-image">
    const image = card.querySelector('.article-card-image img, img.cover-image, img');
    const imageCell = image ? image.cloneNode(true) : '';

    // Column 2: Body content
    const bodyContent = [];

    // Tag/category
    // VALIDATED: <span class="tag">Casual Cool</span>
    const tag = card.querySelector('.tag, span.tag');
    if (tag) {
      const tagEl = document.createElement('em');
      tagEl.textContent = tag.textContent.trim();
      bodyContent.push(tagEl);
    }

    // Date
    // VALIDATED: <span class="paragraph-sm utility-text-secondary">May 12</span>
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    if (date) {
      const dateEl = document.createElement('span');
      dateEl.textContent = date.textContent.trim();
      bodyContent.push(dateEl);
    }

    // Heading/Title
    // VALIDATED: <h3 class="h4-heading">Tennis style, redefined</h3>
    const heading = card.querySelector('.h4-heading, h3, h4, h2');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      bodyContent.push(h);
    }

    // Link - preserve the href from the card link
    // VALIDATED: The card itself is an <a> element with href
    const href = card.getAttribute('href') || card.querySelector('a')?.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = heading ? heading.textContent.trim() : 'Read more';
      bodyContent.push(link);
    }

    // Create row: [image, body]
    cells.push([imageCell, bodyContent.length > 0 ? bodyContent : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Article', cells });
  element.replaceWith(block);
}
