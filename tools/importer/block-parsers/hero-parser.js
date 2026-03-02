/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Frame.io Hero block (HeroSideBySide pattern)
 *
 * Source: https://frame.io/
 * Base Block: hero
 *
 * Source HTML Pattern (React with CSS modules):
 * <div class="HeroSideBySide_wrapper__*">
 *   <div class="HeroSideBySide_content__*">
 *     <h1>...</h1>
 *     <p>Description...</p>
 *     <div class="ButtonGroup_*"><a>CTA</a></div>
 *   </div>
 *   <div class="HeroSideBySide_media__*">
 *     <img src="..." alt="...">
 *   </div>
 * </div>
 *
 * Generated: 2026-02-06
 */
export function matches(element) {
  return hasClass(element, 'HeroSideBySide_');
}

export default function parse(element, { document }) {
  const cells = [];

  const heroImage = element.querySelector('img, video');
  if (heroImage) {
    cells.push([heroImage.cloneNode(true)]);
  }

  const heading = element.querySelector('h1, [class*="title1"]');
  const description = element.querySelector('[class*="description"], [class*="subtitle"], p');
  const ctaLinks = Array.from(element.querySelectorAll('[class*="ButtonGroup"] a, [class*="Button_base"] '));

  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }
  ctaLinks.forEach((btn) => {
    const a = document.createElement('a');
    a.href = btn.href || '#';
    a.textContent = btn.textContent.trim();
    contentCell.push(a);
  });

  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}

function hasClass(el, partial) {
  if (!el || !el.className) return false;
  return (typeof el.className === 'string' ? el.className : '').includes(partial);
}
