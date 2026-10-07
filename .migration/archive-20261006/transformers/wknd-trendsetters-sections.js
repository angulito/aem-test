/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Runs in afterTransform only, uses payload.template.sections.
 * Selectors validated against captured DOM (migration-work/cleaned.html):
 *   - header.section.secondary-section (Hero Landing)
 *   - main > section:nth-of-type(1) (Featured Article)
 *   - main > section:nth-of-type(2) (Photo Gallery)
 *   - main > section:nth-of-type(3) (Testimonials)
 *   - main > section:nth-of-type(4) (Latest Articles)
 *   - main > section:nth-of-type(5) (FAQ)
 *   - main > section:nth-of-type(6) (CTA Banner)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid shifting indices
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
