/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-dashboard
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: #teaser-12e164de76 ~ .grid.aem-GridColumn
 * Generated: 2026-06-08
 *
 * Source structure:
 *   div.grid.aem-GridColumn
 *     div.grid-container > div.grid-row
 *       div.grid-row__col-with-6.grid-cell (large card)
 *         div.cardpagestory.card-dashboard
 *           a[href] wraps entire card
 *             div.card-image-container > picture > img.card-image
 *             div.card-content-container
 *               span.card-eyebrow
 *               h4.card-title
 *               p.card-description
 *               span.card-cta
 *       div.grid-row__col-with-3.grid-cell (stat card, repeated)
 *         div.dashboardcards
 *           div.cmp-dashboardcard
 *             div.dashboard-card-facts > div.content-container
 *               div.eyebrow
 *               div.data-container > div.data-point + div.data-point-suffix
 *               div.description
 *
 * Target: Cards block with one row per card item.
 *   - Large card: [image, eyebrow + title + description + link]
 *   - Stat cards: [empty, eyebrow + data-point + suffix + description]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the large page-story card (col-6)
  const largeCard = element.querySelector('.cardpagestory.card-dashboard, .card-dashboard');
  if (largeCard) {
    const link = largeCard.querySelector('a[href]');
    const image = largeCard.querySelector('.card-image-container img, img.card-image');
    const eyebrow = largeCard.querySelector('.card-eyebrow, span.card-eyebrow');
    const title = largeCard.querySelector('h4.card-title, .card-title');
    const description = largeCard.querySelector('p.card-description, .card-description');
    const cta = largeCard.querySelector('.card-cta, span.card-cta');

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

    if (description) {
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

  // Extract dashboard stat cards (col-3 each)
  const statCards = element.querySelectorAll('.dashboardcards .cmp-dashboardcard, .cmp-dashboardcard');
  statCards.forEach((statCard) => {
    const eyebrow = statCard.querySelector('.eyebrow, .content-container .eyebrow');
    const dataPoint = statCard.querySelector('.data-point');
    const dataSuffix = statCard.querySelector('.data-point-suffix');
    const description = statCard.querySelector('.description, .content-container .description');

    const textCell = [];

    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textCell.push(eyebrowEl);
    }

    // Combine data-point and suffix into a single heading
    if (dataPoint) {
      const statEl = document.createElement('h3');
      let statText = dataPoint.textContent.trim();
      if (dataSuffix) {
        statText += dataSuffix.textContent.trim();
      }
      statEl.textContent = statText;
      textCell.push(statEl);
    }

    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent.trim();
      textCell.push(descEl);
    }

    // Stat cards have no image, use empty image cell
    cells.push([[], textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-dashboard', cells });
  element.replaceWith(block);
}
