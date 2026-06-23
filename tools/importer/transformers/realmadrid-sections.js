/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: realmadrid.com section handling.
 *
 * Driven entirely by payload.template.sections (from page-templates.json,
 * whose selectors were derived from the captured Angular-SPA module tree in
 * migration-work/cleaned.html). For each section it locates the section's
 * element under main via the template `selector`, then:
 *   - inserts an <hr> section break before every section except the first, and
 *   - appends a "Section Metadata" block (carrying `style`) immediately after
 *     the section element for sections that declare a style.
 *
 * 🚨 Runs in beforeTransform (NOT afterTransform), matching this project's
 * established section-transformer pattern. Block parsers run between the two
 * hooks and call element.replaceWith(block) on the very section elements these
 * selectors target (app-news-herobanner, app-merchandising, app-palmares,
 * app-stadium-camera, app-footer-sponsors). If section resolution happened in
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
 * Section selectors (from the realmadrid-home template, derived from the
 * captured module tree). Only section-9 (app-palmares) declares a style:
 *   section-1  app-news-herobanner:nth-of-type(1)   style: null
 *   section-2  app-news-herobanner:nth-of-type(2)   style: null
 *   section-3  app-news-herobanner:nth-of-type(3)   style: null
 *   section-4  app-news-herobanner:nth-of-type(4)   style: null
 *   section-5  app-news-herobanner:nth-of-type(5)   style: null
 *   section-6  app-merchandising:nth-of-type(1)     style: null
 *   section-7  app-news-herobanner:nth-of-type(6)   style: null
 *   section-8  app-merchandising:nth-of-type(2)     style: null
 *   section-9  app-palmares:nth-of-type(1)          style: dark
 *   section-10 app-stadium-camera:nth-of-type(1)    style: null
 *   section-11 app-news-herobanner:nth-of-type(7)   style: null
 *   section-12 app-footer-sponsors:nth-of-type(1)   style: null
 *
 * Expected for the realmadrid-home template: 11 <hr> breaks (12 sections - 1)
 * and 1 Section Metadata block (only section-9 declares style "dark").
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

    // Section Metadata block for sections that declare a style (section-9: dark).
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
