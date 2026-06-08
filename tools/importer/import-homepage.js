/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Site homepage with hero, featured content sections, and promotional blocks',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['header.section.secondary-section']
    },
    {
      name: 'columns-article',
      instances: ['section.section:has(.breadcrumbs)']
    },
    {
      name: 'cards-gallery',
      instances: ['section.section.secondary-section:has(.utility-aspect-1x1)']
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper']
    },
    {
      name: 'cards-articles',
      instances: ['section.section.secondary-section:has(.article-card)']
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list']
    },
    {
      name: 'hero-banner',
      instances: ['section.section.inverse-section']
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
      name: 'Featured article teaser',
      selector: 'section.section:has(.breadcrumbs)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Photo gallery',
      selector: 'section.section.secondary-section:has(.utility-aspect-1x1)',
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: [
        'section.section.secondary-section:has(.utility-aspect-1x1) .utility-text-align-center h2',
        'section.section.secondary-section:has(.utility-aspect-1x1) .utility-text-align-center p'
      ]
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: 'section.section:has(.tabs-wrapper)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Latest articles',
      selector: 'section.section.secondary-section:has(.article-card)',
      style: 'secondary',
      blocks: ['cards-articles'],
      defaultContent: [
        'section.section.secondary-section:has(.article-card) .utility-text-align-center h2',
        'section.section.secondary-section:has(.article-card) .utility-text-align-center p'
      ]
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'section.section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'section.section:has(.faq-list) h2',
        'section.section:has(.faq-list) .subheading'
      ]
    },
    {
      id: 'section-7',
      name: 'Closing CTA banner',
      selector: 'section.section.inverse-section',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-articles': cardsArticlesParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
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

    // 6. Generate sanitized path. The root URL ("/") yields an empty pathname,
    // which crashes the browser path shim (process.cwd is unavailable); map it to /index.
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

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
