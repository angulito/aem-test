/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog-listing',
  description: 'Blog landing/listing page with hero, featured article, latest articles grid, and subscribe CTA',
  urls: [
    'https://www.wknd-trendsetters.site/blog'
  ],
  blocks: [
    {
      name: 'hero-blog',
      instances: ['#main-content > header.section.secondary-section']
    },
    {
      name: 'columns-feature',
      instances: ['#main-content > section.section:nth-of-type(1)']
    },
    {
      name: 'cards-article',
      instances: ['#articles div.grid-layout.desktop-4-column']
    }
  ],
  sections: [
    {
      id: 'section-2',
      name: 'hero header',
      selector: ['#main-content > header.section.secondary-section'],
      style: 'secondary',
      blocks: ['hero-blog'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'featured article',
      selector: ['#main-content > section.section:nth-of-type(1)'],
      style: null,
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Latest Articles grid',
      selector: ['#articles'],
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: [
        '#articles > div.container > div.utility-text-align-center > h2.h2-heading',
        '#articles > div.container > div.utility-text-align-center > p.paragraph-lg'
      ]
    },
    {
      id: 'section-5',
      name: 'subscribe CTA',
      selector: ['#main-content > section.section.accent-section'],
      style: 'accent',
      blocks: [],
      defaultContent: [
        '#main-content > section.section.accent-section .utility-text-align-center > h2.h2-heading',
        '#main-content > section.section.accent-section .utility-text-align-center > p.paragraph-lg',
        '#main-content > section.section.accent-section .utility-text-align-center .button-group'
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'columns-feature': columnsFeatureParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, then sections (afterTransform)
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
    template: PAGE_TEMPLATE,
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
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
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
