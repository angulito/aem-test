/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-questions. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section:nth-of-type(5) .faq-list
 * Structure: 2 columns, one row per item — [question title] | [answer content].
 * Source: details.faq-item > summary.faq-question (span text + decorative SVG icon)
 *         + div.faq-answer. The decorative icon is dropped.
 * Generated: 2026-10-06
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll(':scope > details.faq-item')];
  if (!items.length) items = [...element.querySelectorAll('details')];

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector(':scope > summary, .faq-question');
    const answer = item.querySelector(':scope > .faq-answer, .faq-answer');

    // Title: text of the summary (span preferred), without the icon image
    const titleText = (summary?.querySelector('span')?.textContent || summary?.textContent || '')
      .replace(/\s+/g, ' ').trim();

    // Content: answer children (paragraphs, lists, links, etc.)
    let contentCell = [];
    if (answer) {
      contentCell = [...answer.children];
      if (!contentCell.length && answer.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answer.textContent.trim();
        contentCell = [p];
      }
    } else {
      // Fallback: everything in <details> except the summary
      contentCell = [...item.children].filter((c) => c !== summary);
    }

    if (!titleText && !contentCell.length) return;
    cells.push([titleText || '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-questions', cells });
  element.replaceWith(block);
}
