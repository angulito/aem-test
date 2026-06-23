/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion
 * Source URL: https://www.wknd-trendsetters.site/faq (selector: .faq-list)
 * Generated: 2026-06-10
 *
 * Block structure (per blocks/accordion-faq/accordion-faq.js):
 *   Each content row has two cells:
 *     - cell[0]: the question (becomes the <summary> label)
 *     - cell[1]: the answer body
 *
 * Source HTML (validated against migration-work/block-context/accordion-faq/source.html):
 *   <div class="faq-list">
 *     <details class="faq-item">
 *       <summary class="faq-question"><span>Question?</span><img class="faq-icon"></summary>
 *       <div class="faq-answer"><p>Answer.</p></div>
 *     </details>
 *     ... (four items)
 *   </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  // One row per Q&A item. Validated selector: details.faq-item.
  const items = element.querySelectorAll(':scope > details.faq-item, details.faq-item');

  items.forEach((item) => {
    // Question lives in the summary. Prefer the inner <span> (text only) so the
    // decorative SVG toggle icon (img.faq-icon) is excluded; fall back to summary text.
    const summary = item.querySelector('summary.faq-question, summary');
    let question = '';
    if (summary) {
      const span = summary.querySelector('span');
      question = (span ? span.textContent : summary.textContent).trim();
    }

    // Answer body: the .faq-answer wrapper, preserving its paragraph markup.
    const answer = item.querySelector('div.faq-answer, .faq-answer');
    const answerCell = answer || '';

    if (question || answer) {
      cells.push([question, answerCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
