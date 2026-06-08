/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion.
 * Source: https://www.wknd-trendsetters.site/ (.faq-list)
 * Generated: 2026-06-03
 *
 * Source structure (each item):
 *   <details class="faq-item">
 *     <summary class="faq-question"><span>Question</span><img .../></summary>
 *     <div class="faq-answer"><p>Answer</p></div>
 *   </details>
 *
 * Output (accordion block): one row per item, two cells — question title | answer content.
 * Notes:
 *   - The decorative SVG toggle icon (img in summary) is removed by the cleanup transformer,
 *     and is explicitly excluded here as well.
 *   - The H2 heading + subheading above the list are default content (handled separately);
 *     this parser only handles the .faq-list items.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each FAQ item is a native <details> element.
  const items = element.querySelectorAll(':scope > details.faq-item, :scope details.faq-item');

  items.forEach((item) => {
    const summary = item.querySelector('summary.faq-question, summary');
    const answer = item.querySelector('.faq-answer, div[class*="answer"]');

    // Question: prefer the inner <span> text; fall back to the summary itself.
    // Never include the decorative SVG icon (removed by cleanup transformer).
    let questionEl = summary ? summary.querySelector('span') : null;
    if (!questionEl && summary) {
      questionEl = document.createElement('span');
      questionEl.textContent = summary.textContent.trim();
    }
    const questionText = questionEl ? questionEl.textContent.trim() : '';

    // Answer content: keep semantic markup (paragraphs/links) from the answer wrapper.
    const answerNodes = [];
    if (answer) {
      answer.childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG' && node.classList.contains('faq-icon')) return;
          answerNodes.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          answerNodes.push(node.textContent.trim());
        }
      });
    }

    if (questionText || answerNodes.length) {
      cells.push([questionText, answerNodes.length ? answerNodes : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
