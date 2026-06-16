/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + section metadata.
 *
 * Driven by payload.template.sections (from page-templates.json). For each
 * section, in reverse document order:
 *   - When section.style is set, append a "Section Metadata" block after the
 *     section's first matched element.
 *   - When the section is not the first, insert an <hr> before it.
 *
 * Section selectors verified against migration-work/cleaned.html:
 *   - #main-content > header.section.secondary-section   (hero header, secondary)
 *   - #main-content > section.section:nth-of-type(1)      (featured article, no style)
 *   - #articles                                           (Latest Articles grid, secondary)
 *   - #main-content > section.section.accent-section      (subscribe CTA, accent)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  // Run BEFORE block parsers: hero/columns parsers replace their entire
  // <section>/<header> elements, so section boundaries must be captured
  // while the original DOM (and the section selectors) are still intact.
  if (hookName !== TransformHook.beforeTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the first matching element for a section using its selector list.
  const findSectionEl = (section) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  };

  // Process in reverse so inserted nodes don't shift the positions of
  // sections we have not handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionEl(section);
    if (!sectionEl) continue;

    // Section Metadata block after the section element (when a style is set).
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (sectionEl.parentNode) {
        sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
      }
    }

    // Section break before every non-first section.
    if (i > 0 && sectionEl.parentNode) {
      sectionEl.parentNode.insertBefore(doc.createElement('hr'), sectionEl);
    }
  }
}
