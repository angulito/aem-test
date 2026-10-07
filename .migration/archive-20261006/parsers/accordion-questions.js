/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-questions. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-03
 *
 * Structure (2-column accordion): one row per FAQ item.
 *   - Cell 1: title (the question text)
 *   - Cell 2: content (the answer body)
 * Source items are <details class="faq-item"> with a <summary> question and .faq-answer body.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, details.faq-item'));

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const answer = item.querySelector('.faq-answer');

    // Title cell: prefer the question text span (excludes the toggle icon image).
    let titleContent;
    const questionText = summary ? summary.querySelector('span') : null;
    if (questionText) {
      titleContent = questionText;
    } else if (summary) {
      // Fallback: use the summary text without the icon image.
      titleContent = summary.textContent.trim();
    } else {
      titleContent = '';
    }

    // Content cell: the answer body.
    const contentCell = answer || '';

    cells.push([titleContent, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-questions', cells });
  element.replaceWith(block);
}
