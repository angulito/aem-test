/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'faq',
  description: 'FAQ page with expandable question/answer accordion list',
  urls: [
    'https://www.wknd-trendsetters.site/faq'
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['header.section.secondary-section']
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list']
    },
    {
      name: 'columns-contact',
      instances: ['section.section.secondary-section:has(.contact-items)']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero intro',
      selector: 'header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-intro'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'FAQ accordion',
      selector: 'section.section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: "Let's connect",
      selector: 'section.section:has(.contact-items)',
      style: 'secondary',
      blocks: ['columns-contact'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Closing CTA banner',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: [
        'section.section.accent-section h2',
        'section.section.accent-section p',
        'section.section.accent-section a'
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'accordion-faq': accordionFaqParser,
  'columns-contact': columnsContactParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, then sections (if 2+ sections)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Emit an explicit target page name for this single-page migration so the
    // imported document lands at /wknd-faq rather than the source /faq path.
    const path = WebImporter.FileUtils.sanitizePath('/wknd-faq');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
