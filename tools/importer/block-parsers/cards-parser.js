/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Frame.io Cards block (Bentos/FeatureCard + PricingOverview patterns)
 *
 * Source: https://frame.io/
 * Base Block: cards
 *
 * Handles two patterns:
 * 1. Feature Cards (Bentos grid): image + title + description
 * 2. Pricing Cards (PricingOverview): tier + price + features + CTA
 *
 * Generated: 2026-02-06
 */
export function matches(element) {
  return hasClass(element, 'Bentos_') || hasClass(element, 'FeatureCard_')
    || hasClass(element, 'PricingOverview_') || hasClass(element, 'PricingCard_');
}

export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern
  const isPricing = hasClass(element, 'PricingOverview_') || element.querySelector('[class*="PricingCard_"]');

  if (isPricing) {
    parsePricingCards(element, document, cells);
  } else {
    parseFeatureCards(element, document, cells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}

function parseFeatureCards(element, document, cells) {
  const cards = Array.from(element.querySelectorAll('[class*="FeatureCard_"]'));
  cards.forEach((card) => {
    const img = card.querySelector('img');
    const title = card.querySelector('[class*="title"], h3, h4, strong');
    const desc = card.querySelector('[class*="description"], p');

    const imgCell = img ? img.cloneNode(true) : '';
    const textParts = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textParts.push(strong);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textParts.push(p);
    }
    cells.push([imgCell, textParts.length > 0 ? textParts : '']);
  });
}

function parsePricingCards(element, document, cells) {
  const cards = Array.from(element.querySelectorAll('[class*="PricingCard_pricingCard"]'));
  cards.forEach((card) => {
    const eyebrow = card.querySelector('[class*="cardEyebrow"]');
    const title = card.querySelector('[class*="cardTitle"]');
    const price = card.querySelector('[class*="cardPrice__"], [class*="cardSecondaryTitle"]');
    const desc = card.querySelector('[class*="cardDescription"]');
    const bullets = Array.from(card.querySelectorAll('[class*="cardDetailBulletText"]'));
    const cta = card.querySelector('[class*="cardDetailButton"], a[class*="Button"]');

    const col1Parts = [];
    if (eyebrow) {
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      col1Parts.push(strong);
    }

    const col2Parts = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      col2Parts.push(strong);
    }
    if (price) {
      const p = document.createElement('p');
      p.textContent = price.textContent.trim();
      col2Parts.push(p);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col2Parts.push(p);
    }
    if (bullets.length > 0) {
      const p = document.createElement('p');
      p.textContent = bullets.map((b) => b.textContent.trim()).join(' · ');
      col2Parts.push(p);
    }
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent.trim();
      col2Parts.push(a);
    }

    cells.push([col1Parts.length > 0 ? col1Parts : '', col2Parts.length > 0 ? col2Parts : '']);
  });
}

function hasClass(el, partial) {
  if (!el || !el.className) return false;
  return (typeof el.className === 'string' ? el.className : '').includes(partial);
}
