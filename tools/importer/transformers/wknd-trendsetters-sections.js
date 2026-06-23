/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters.site section handling.
 *
 * Driven entirely by payload.template.sections (from page-templates.json,
 * whose selectors were derived from the captured DOM). For each section it
 * locates the section's element under main via the template `selector`, then:
 *   - inserts an <hr> section break before every section except the first, and
 *   - appends a "Section Metadata" block (carrying `style`) immediately after
 *     the section element for sections that declare a style.
 *
 * 🚨 Runs in beforeTransform (NOT afterTransform). Block parsers run between
 * the two hooks and call element.replaceWith(block) on the very section
 * elements these selectors target. If section resolution happened in
 * afterTransform, those elements would already be gone and every section would
 * collapse / be skipped. Running in beforeTransform inserts the <hr> and
 * Section Metadata markers as siblings around each section element while it
 * still exists; when a parser later swaps the section element for its block,
 * the surrounding markers are preserved.
 *
 * We resolve each section to its own element and insert markers as its direct
 * siblings (insertAdjacentElement 'beforebegin' / 'afterend'). There is NO
 * parent-climb loop — climbing to a common ancestor would collapse every
 * section onto <main> and emit a single break.
 *
 * Selectors verified against migration-work/cleaned.html for the faq template:
 *   section-1 header.section.secondary-section                       (line 50) style: secondary
 *   section-2 section.section:has(.faq-list)                         (line 50) style: null
 *   section-3 section.section.secondary-section:has(.contact-items)  (line 50) style: secondary
 *   section-4 section.section.accent-section                         (line 50) style: accent
 *
 * Expected for the faq template: 3 <hr> breaks (4 sections - 1) and
 * 3 Section Metadata blocks (sections 1, 3, 4 declare a style).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  // Insert section markers BEFORE block parsers replace the section elements.
  if (hookName !== TransformHook.beforeTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the section's own element from its template selector(s).
  // Returns the matched element directly — no parent traversal — so each
  // section stays its own node and markers land as that node's siblings.
  const resolveSectionEl = (section) => {
    const selectors = Array.isArray(section.selector)
      ? section.selector
      : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  };

  // Reverse order so earlier insertions don't shift later sections' positions.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = resolveSectionEl(section);
    if (!sectionEl) {
      // eslint-disable-next-line no-console
      console.warn('Section selector did not match, skipping:', section.id, section.selector);
      continue;
    }

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Place the metadata block right after this section's element.
      sectionEl.insertAdjacentElement('afterend', metadataBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      sectionEl.insertAdjacentElement('beforebegin', hr);
    }
  }
}
