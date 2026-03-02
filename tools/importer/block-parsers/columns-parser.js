/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Frame.io Columns block (SideBySides pattern)
 *
 * Source: https://frame.io/
 * Base Block: columns
 *
 * Source HTML Pattern:
 * <article class="SideBySides_*">
 *   <div class="SideBySide_content__*">
 *     <span class="eyebrow">REVIEW & APPROVAL</span>
 *     <h2>Heading</h2>
 *     <div class="touts">
 *       <div class="tout"><h3>Title</h3><p>Description</p></div>
 *     </div>
 *     <a>CTA</a>
 *   </div>
 *   <div class="SideBySide_media__*">
 *     <img src="..." alt="...">
 *   </div>
 * </article>
 *
 * Generated: 2026-02-06
 */
export function matches(element) {
  return hasClass(element, 'SideBySide_') || hasClass(element, 'SideBySides_');
}

export default function parse(element, { document }) {
  const contentSide = element.querySelector('[class*="SideBySide_content"], [class*="TextLockup_content"]');
  const mediaSide = element.querySelector('[class*="SideBySide_media"], [class*="EnhancedMedia_"]');

  const col1 = [];
  if (contentSide) {
    const eyebrow = contentSide.querySelector('[class*="eyebrow"]');
    if (eyebrow) {
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent.trim();
      col1.push(strong);
    }
    const heading = contentSide.querySelector('h2, h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      col1.push(h2);
    }
    const touts = contentSide.querySelectorAll('[class*="Tout_"], [class*="tout_"]');
    touts.forEach((tout) => {
      const tTitle = tout.querySelector('h3, h4, [class*="title"]');
      const tDesc = tout.querySelector('p, [class*="description"]');
      if (tTitle) {
        const strong = document.createElement('strong');
        strong.textContent = tTitle.textContent.trim();
        col1.push(strong);
      }
      if (tDesc) {
        const p = document.createElement('p');
        p.textContent = tDesc.textContent.trim();
        col1.push(p);
      }
    });
    const cta = contentSide.querySelector('[class*="ButtonGroup"] a, a[class*="Button_"]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent.trim();
      col1.push(a);
    }
  }

  const col2 = [];
  if (mediaSide) {
    const img = mediaSide.querySelector('img');
    if (img) col2.push(img.cloneNode(true));
  }

  const cells = [[col1.length > 0 ? col1 : '', col2.length > 0 ? col2 : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}

function hasClass(el, partial) {
  if (!el || !el.className) return false;
  return (typeof el.className === 'string' ? el.className : '').includes(partial);
}
