/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats
 * Base block: cards
 * Source: https://www.abbvie.com/
 * Selector: #section04 ~ .container.cmp-container-full-width
 * Generated: 2026-06-08
 *
 * Source structure:
 * - Full-width container with background image
 * - Grid with 3 columns:
 *   1. Stats fact card (eyebrow, data-point number+suffix, description)
 *   2. Dashboard card (eyebrow, title, description, CTA link)
 *   3. Quick links card (eyebrow, title, list of links)
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('.cmp-container__bg-image, img[class*="bg-image"]');

  // Extract grid cells
  const gridCells = element.querySelectorAll('.grid-cell, .grid-row__col-with-3, .grid-row__col-with-6');

  const cells = [];

  // Row 1: Background image (if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Process each grid cell as a card row
  gridCells.forEach((gridCell) => {
    const cardContent = [];

    // Check if this is a stats/facts card
    const factsCard = gridCell.querySelector('.dashboard-card-facts');
    if (factsCard) {
      const eyebrow = factsCard.querySelector('.eyebrow');
      const dataPoint = factsCard.querySelector('.data-point');
      const dataSuffix = factsCard.querySelector('.data-point-suffix');
      const description = factsCard.querySelector('.description');

      if (eyebrow) cardContent.push(eyebrow);
      // Combine data point and suffix into a heading element
      if (dataPoint) {
        const statText = dataPoint.textContent.trim() + (dataSuffix ? dataSuffix.textContent.trim() : '');
        const statHeading = document.createElement('h2');
        statHeading.textContent = statText;
        cardContent.push(statHeading);
      }
      if (description) cardContent.push(description);
      cells.push(cardContent);
      return;
    }

    // Check if this is a dashboard/page story card
    const storyCard = gridCell.querySelector('.cardpagestory, .card-dashboard');
    if (storyCard) {
      const cardLink = storyCard.querySelector('a[href]');
      const cardImage = storyCard.querySelector('.card-image, img');
      const cardEyebrow = storyCard.querySelector('.card-eyebrow');
      const cardTitle = storyCard.querySelector('.card-title, h4, h3, h2');
      const cardDescription = storyCard.querySelector('.card-description, p');
      const cardCta = storyCard.querySelector('.card-cta');

      if (cardImage) cardContent.push(cardImage);
      if (cardEyebrow) cardContent.push(cardEyebrow);
      if (cardTitle) cardContent.push(cardTitle);
      if (cardDescription) cardContent.push(cardDescription);
      // Create a proper link for the CTA
      if (cardLink && cardCta) {
        const link = document.createElement('a');
        link.href = cardLink.href || cardLink.getAttribute('href');
        link.textContent = cardCta.textContent.trim();
        cardContent.push(link);
      } else if (cardLink) {
        cardContent.push(cardLink);
      }
      cells.push(cardContent);
      return;
    }

    // Check if this is a quick links card
    const linksCard = gridCell.querySelector('.dashboard-card_link__list');
    if (linksCard) {
      const linkEyebrow = linksCard.querySelector('.linkcard-eyebrow');
      const linkTitle = linksCard.querySelector('.linkcard-title, h5, h4');
      const links = linksCard.querySelectorAll('.linkcard-link');

      if (linkEyebrow) cardContent.push(linkEyebrow);
      if (linkTitle) cardContent.push(linkTitle);
      // Add each link
      links.forEach((link) => {
        cardContent.push(link);
      });
      cells.push(cardContent);
      return;
    }

    // Fallback: collect any remaining content
    const anyContent = gridCell.querySelector('h2, h3, h4, h5, p, a, img');
    if (anyContent) {
      cardContent.push(gridCell);
      cells.push(cardContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
