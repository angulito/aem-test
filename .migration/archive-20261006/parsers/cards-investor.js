/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-investor
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: #section03 ~ .grid.aem-GridColumn
 * Generated: 2026-06-08
 *
 * Source structure:
 *   div.grid.aem-GridColumn
 *     div.grid-container > div.grid-row
 *       div.grid-row__col-with-4.grid-cell (earnings card)
 *         div.cardpagestory.card-dashboard.card-medium
 *           a[href] wraps entire card
 *             div.card-image-container > picture > img.card-image
 *             div.card-content-container
 *               span.card-eyebrow
 *               h4.card-title
 *               p.card-description
 *               span.card-cta
 *       div.grid-row__col-with-8.grid-cell (investor links card)
 *         div.dashboardcards
 *           div.cmp-dashboardcard
 *             div.dashboard-card_link__list
 *               div.linkcard-eyebrow
 *               div.content-container
 *                 h5.linkcard-title
 *                 div.linkcard-links
 *                   a.linkcard-link (repeated)
 *                     span.link-text
 *
 * Target: Cards block with one row per card item.
 *   - Earnings card: [image, eyebrow + title + description + CTA link]
 *   - Investor links card: [empty, eyebrow + title + list of links]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the earnings page-story card (col-4)
  const earningsCard = element.querySelector('.cardpagestory.card-dashboard, .cardpagestory.card-medium, .card-dashboard');
  if (earningsCard) {
    const link = earningsCard.querySelector('a[href]');
    const image = earningsCard.querySelector('.card-image-container img, img.card-image');
    const eyebrow = earningsCard.querySelector('.card-eyebrow, span.card-eyebrow');
    const title = earningsCard.querySelector('h4.card-title, .card-title');
    const description = earningsCard.querySelector('p.card-description, .card-description');
    const cta = earningsCard.querySelector('.card-cta, span.card-cta');

    const imageCell = image ? [image] : [];
    const textCell = [];

    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textCell.push(eyebrowEl);
    }

    if (title) {
      const headingEl = document.createElement('h4');
      if (link) {
        const linkEl = document.createElement('a');
        linkEl.href = link.getAttribute('href') || '';
        linkEl.textContent = title.textContent.trim();
        headingEl.appendChild(linkEl);
      } else {
        headingEl.textContent = title.textContent.trim();
      }
      textCell.push(headingEl);
    }

    if (description && description.textContent.trim()) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent.trim();
      textCell.push(descEl);
    }

    if (cta && link) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.getAttribute('href') || '';
      ctaLink.textContent = cta.textContent.trim();
      textCell.push(ctaLink);
    }

    cells.push([imageCell, textCell]);
  }

  // Extract investor links dashboard card (col-8)
  const linksCard = element.querySelector('.dashboardcards .cmp-dashboardcard, .cmp-dashboardcard');
  if (linksCard) {
    const linkList = linksCard.querySelector('.dashboard-card_link__list, [class*="link__list"]');
    const eyebrow = linksCard.querySelector('.linkcard-eyebrow, [class*="linkcard-eyebrow"]');
    const title = linksCard.querySelector('h5.linkcard-title, .linkcard-title');
    const links = linksCard.querySelectorAll('a.linkcard-link, .linkcard-links a');

    const textCell = [];

    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textCell.push(eyebrowEl);
    }

    if (title) {
      const headingEl = document.createElement('h5');
      headingEl.textContent = title.textContent.trim();
      textCell.push(headingEl);
    }

    // Build list of links
    if (links.length > 0) {
      const ul = document.createElement('ul');
      links.forEach((linkEl) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = linkEl.getAttribute('href') || '';
        const linkText = linkEl.querySelector('.link-text, span');
        a.textContent = linkText ? linkText.textContent.trim() : linkEl.textContent.trim();
        if (linkEl.getAttribute('title')) {
          a.title = linkEl.getAttribute('title');
        }
        li.appendChild(a);
        ul.appendChild(li);
      });
      textCell.push(ul);
    }

    // Links card has no image, use empty image cell
    cells.push([[], textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-investor', cells });
  element.replaceWith(block);
}
