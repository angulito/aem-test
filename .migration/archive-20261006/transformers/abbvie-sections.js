/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where style is defined.
 * Uses payload.template.sections from page-templates.json.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Sections (9 total, 8 <hr> breaks expected, 1 Section Metadata for "dark" style):
 *   1. Hero Carousel: .homepage-hero-controller (line 3701)
 *   2. Press Releases and Featured: .container.homepage-overlap (line 3813)
 *   3. Patients Section: #teaser-f34db54d6a (line 3936)
 *   4. Science and Innovation: #teaser-12e164de76 (line 4298)
 *   5. Culture and Careers: #section02 (line 4443)
 *   6. Explore Opportunities: .container.medium-radius.cmp-container-xxx-large (line 4523) - style: "dark"
 *   7. Investor Resources: #section03 (line 4560)
 *   8. Manufacturing Feature: .container.default-radius.cmp-container-xxx-large (line 4637)
 *   9. ESG Sustainability: #section04 (line 4680)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to preserve DOM positions when inserting elements
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectorValue = section.selector;

      // Resolve the first element matching the section selector
      let sectionEl = null;
      if (Array.isArray(selectorValue)) {
        // Use the first selector in the array to find the section boundary
        for (const sel of selectorValue) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else if (typeof selectorValue === 'string') {
        sectionEl = element.querySelector(selectorValue);
      }

      if (!sectionEl) continue;

      // Walk up to find the ancestor that is a direct or near-direct child under main content flow
      // We need to insert <hr> before the outermost container that holds this section
      let insertTarget = sectionEl;
      while (insertTarget.parentElement && insertTarget.parentElement !== element) {
        // Stop walking up if we reach #maincontent or its immediate grid child
        if (insertTarget.parentElement.id === 'maincontent') break;
        if (insertTarget.parentElement.classList.contains('aem-Grid') &&
            insertTarget.parentElement.parentElement &&
            insertTarget.parentElement.parentElement.id === 'maincontent') break;
        insertTarget = insertTarget.parentElement;
      }

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element (at end of section)
        if (insertTarget.nextSibling) {
          insertTarget.parentElement.insertBefore(sectionMetadata, insertTarget.nextSibling);
        } else {
          insertTarget.parentElement.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before non-first sections to mark section boundaries
      if (i > 0) {
        const hr = document.createElement('hr');
        insertTarget.parentElement.insertBefore(hr, insertTarget);
      }
    }
  }
}
