/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: accordion
 *
 * Block Structure:
 * - Each row = one accordion item
 * - Column 1 = question/title
 * - Column 2 = answer/content
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="faq-list">
 *   <details class="faq-item">
 *     <summary class="faq-question">
 *       <span>How do I spot the latest trends?</span>
 *     </summary>
 *     <div class="faq-answer">
 *       <p>We keep it fresh! Check our weekly trend roundups...</p>
 *     </div>
 *   </details>
 *   ...
 * </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find FAQ items using <details> elements
  // VALIDATED: Captured DOM uses <details class="faq-item"> elements
  const items = Array.from(element.querySelectorAll('details.faq-item, details'));

  // Fallback: try generic accordion patterns
  const faqItems = items.length > 0 ? items :
    Array.from(element.querySelectorAll('.accordion-item, [class*="accordion"]'));

  faqItems.forEach(item => {
    // Column 1: Question/Title
    // VALIDATED: Captured DOM uses <summary class="faq-question"><span>Question</span></summary>
    const question = item.querySelector('summary.faq-question span, summary span, summary, .accordion-header, .question');
    const questionText = document.createElement('p');
    questionText.textContent = question ? question.textContent.trim() : '';

    // Column 2: Answer/Content
    // VALIDATED: Captured DOM uses <div class="faq-answer"><p>Answer</p></div>
    const answerDiv = item.querySelector('.faq-answer, .accordion-body, .accordion-content');
    const answerContent = [];

    if (answerDiv) {
      // Clone all paragraphs from the answer
      const paragraphs = answerDiv.querySelectorAll('p');
      if (paragraphs.length > 0) {
        paragraphs.forEach(p => answerContent.push(p.cloneNode(true)));
      } else {
        // Fallback: use text content
        const p = document.createElement('p');
        p.textContent = answerDiv.textContent.trim();
        answerContent.push(p);
      }
    }

    // Create row: [question, answer]
    if (questionText.textContent) {
      cells.push([questionText, answerContent.length > 0 ? answerContent : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-Faq', cells });
  element.replaceWith(block);
}
