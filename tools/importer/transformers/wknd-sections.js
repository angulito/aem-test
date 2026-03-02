/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks and section metadata
 * Purpose: Flatten nested AEM containers and insert section breaks
 * Applies to: wknd.site (templates with 2+ sections)
 * Tested: /us/en.html (homepage, 5 sections)
 * Generated: 2026-02-27
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM (migration-work/cleaned.html)
 * - AEM layout containers: main.cmp-layout-container--fixed, .cmp-container, .aem-Grid
 * - Section boundary elements identified during page analysis
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Find the first matching element for a section boundary,
 * skipping elements already marked for other sections.
 */
function findSectionBoundary(element, section, markedElements) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  const allSelectors = [...selectors, ...(section.defaultContent || [])];

  for (const sel of allSelectors) {
    // Try exact selector first
    try {
      const exact = element.querySelector(sel);
      if (exact && !markedElements.has(exact)) {
        return exact;
      }
    } catch (e) {
      // Selector may be invalid after DOM changes, continue
    }

    // Try stripped selector (remove :nth-of-type/:nth-child pseudo-classes)
    const stripped = sel.replace(/:nth-of-type\(\d+\)/g, '').replace(/:nth-child\(\d+\)/g, '');
    if (stripped !== sel) {
      try {
        const candidates = element.querySelectorAll(stripped);
        for (const c of candidates) {
          if (!markedElements.has(c)) {
            return c;
          }
        }
      } catch (e) {
        // Continue to next selector
      }
    }
  }

  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const document = element.ownerDocument;
    const sections = payload?.template?.sections;
    if (!sections || sections.length < 2) return;

    // Step 1: Flatten nested AEM layout containers
    // EXTRACTED: AEM pages use nested <main>, <div.cmp-container>, <div.aem-Grid> wrappers
    // that need to be unwrapped so all content is at the same level for section breaks
    const unwrapSelectors = [
      'main.cmp-layout-container--fixed',
      '.cmp-container',
      '.aem-Grid',
    ];

    // Multiple passes to handle deeply nested containers
    for (let pass = 0; pass < 3; pass++) {
      unwrapSelectors.forEach((sel) => {
        element.querySelectorAll(sel).forEach((wrapper) => {
          while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          }
          wrapper.remove();
        });
      });
    }

    // Step 2: Insert section breaks between sections
    const markedElements = new Set();

    // Process sections in forward order to correctly track marked elements
    const boundaries = [];
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const found = findSectionBoundary(element, section, markedElements);

      if (found) {
        markedElements.add(found);
        boundaries.push(found);
      }
    }

    // Insert <hr> before each boundary (reverse order to preserve DOM positions)
    for (let i = boundaries.length - 1; i >= 0; i--) {
      let target = boundaries[i];
      // Navigate up to direct child of element if needed
      while (target.parentElement && target.parentElement !== element) {
        target = target.parentElement;
      }
      if (target.parentElement === element) {
        element.insertBefore(document.createElement('hr'), target);
      }
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Add section-metadata blocks for sections with styles
    const sections = payload?.template?.sections;
    if (!sections) return;
    const document = element.ownerDocument;

    // Collect <hr> elements as section boundaries
    const hrs = Array.from(element.querySelectorAll(':scope > hr'));

    // For each section with a style, insert section-metadata before the next <hr>
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section.style) continue;

      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Section i's content ends at hrs[i] (the hr before section i+1)
      if (i < hrs.length) {
        element.insertBefore(block, hrs[i]);
      } else {
        // Last section - append at end
        element.appendChild(block);
      }
    }
  }
}
