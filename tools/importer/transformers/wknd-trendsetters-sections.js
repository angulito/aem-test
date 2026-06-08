/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters.site section handling.
 *
 * Driven entirely by payload.template.sections (from page-templates.json).
 * The homepage template defines 7 sections; for each one we locate its first
 * top-level element under main via the template `selector`, then:
 *   - insert an <hr> section break before every section except the first
 *     (when there is preceding content), and
 *   - append a Section Metadata block carrying `style` for sections that
 *     declare one (sections 1, 3, 5 use style "secondary").
 *
 * Section selectors are sourced from the template (which were derived from the
 * captured DOM of https://www.wknd-trendsetters.site/). Runs in afterTransform
 * only — section structure is applied after block parsers have built their cells.
 *
 * Expected for the homepage template: 6 <hr> breaks (7 sections - 1) and
 * 3 Section Metadata blocks (3 sections with a style).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the first top-level element under `element` (main) for a section.
  // The template selectors target the section wrapper; we match it directly,
  // falling back to the closest top-level ancestor so the <hr>/metadata land
  // at the section boundary rather than deep inside it.
  const resolveSectionEl = (selector) => {
    if (!selector) return null;
    let el = element.querySelector(selector);
    if (!el) return null;
    while (el.parentElement && el.parentElement !== element) {
      el = el.parentElement;
    }
    return el.parentElement === element ? el : null;
  };

  // Process in reverse order so insertions don't disturb earlier matches.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = resolveSectionEl(section.selector);
    if (!sectionEl) {
      // eslint-disable-next-line no-console
      console.warn('Section selector did not match, skipping:', section.selector);
      continue;
    }

    // Section Metadata block (only when the section declares a style).
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(block);
    }

    // Section break before every non-first section that has preceding content.
    if (i > 0 && sectionEl.previousElementSibling) {
      const hr = doc.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
