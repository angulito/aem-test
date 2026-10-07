/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .faq-list
 * Generated: 2026-06-08
 *
 * Source structure:
 *   div.faq-list
 *     details.faq-item
 *       summary.faq-question > span (question text)
 *       div.faq-answer > p (answer text)
 *
 * Target: Accordion block with one row per FAQ item.
 * Each row contains [question, answer] in separate cells.
 */
export default function parse(element, { document }) {
  // Extract all FAQ items from the accordion
  const faqItems = element.querySelectorAll('details.faq-item, details[class*="faq"]');

  const cells = [];

  faqItems.forEach((item) => {
    // Extract question text from summary span
    const questionSpan = item.querySelector('summary.faq-question span, summary span');
    // Extract answer content from faq-answer div
    const answerDiv = item.querySelector('div.faq-answer, div[class*="answer"]');

    if (questionSpan && answerDiv) {
      // Each row: [question, answer]
      cells.push([questionSpan, answerDiv]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
