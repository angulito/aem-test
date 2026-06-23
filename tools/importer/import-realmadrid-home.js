/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsArticlesParser from './parsers/cards-articles.js';
import heroBannerParser from './parsers/hero-banner.js';
import carouselNewsParser from './parsers/carousel-news.js';
import columnsAppParser from './parsers/columns-app.js';

// TRANSFORMER IMPORTS (realmadrid-specific only)
import realmadridCleanupTransformer from './transformers/realmadrid-cleanup.js';
import realmadridSectionsTransformer from './transformers/realmadrid-sections.js';
import realmadridDmImagesTransformer from './transformers/realmadrid-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'cards-articles': cardsArticlesParser,
  'hero-banner': heroBannerParser,
  'carousel-news': carouselNewsParser,
  'columns-app': columnsAppParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'realmadrid-home',
  description: 'Real Madrid homepage (Angular SPA). Modular content: news hero banners, merchandising carousel, trophies/palmares grid, stadium cameras, and footer with sponsors. Spanish locale (/es-ES). Ad-heavy.',
  urls: [
    'https://www.realmadrid.com/es-ES',
  ],
  blocks: [
    {
      name: 'cards-articles',
      instances: [
        'app-news-herobanner:has(main.rm-web-module__main--notitle)',
        'app-merchandising:has(.rm-web-module__subtitle)',
        'app-palmares:nth-of-type(1)',
        'app-stadium-camera:nth-of-type(1)',
      ],
    },
    {
      name: 'hero-banner',
      instances: ['app-merchandising:has(.card__bg)'],
    },
    {
      name: 'carousel-news',
      instances: ['app-news-herobanner:has(header .rm-web-module__title)'],
    },
    {
      name: 'columns-app',
      instances: [
        'app-footer-sponsors section.rm-stores',
        'section.rm-stores',
      ],
    },
    {
      name: 'section-palmares',
      instances: ['app-palmares:nth-of-type(1)'],
      section: 'dark',
    },
  ],
  sections: [
    { id: 'section-1', name: 'Featured news hero', selector: 'app-news-herobanner:nth-of-type(1)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-2', name: 'News grid 4-up', selector: 'app-news-herobanner:nth-of-type(2)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-3', name: 'News grid 3-up (official)', selector: 'app-news-herobanner:nth-of-type(3)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-4', name: 'News grid 3-up (sponsors)', selector: 'app-news-herobanner:nth-of-type(4)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-5', name: 'News grid 4-up', selector: 'app-news-herobanner:nth-of-type(5)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-6', name: 'Comunidad Madridista promo', selector: 'app-merchandising:nth-of-type(1)', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-7', name: 'Noticias Madridistas carousel', selector: 'app-news-herobanner:nth-of-type(6)', style: null, blocks: ['carousel-news'], defaultContent: ['app-news-herobanner:nth-of-type(6) header h2'] },
    { id: 'section-8', name: 'Tienda Oficial products', selector: 'app-merchandising:nth-of-type(2)', style: null, blocks: ['cards-articles'], defaultContent: ['app-merchandising:nth-of-type(2) header h2', 'app-merchandising:nth-of-type(2) header h3'] },
    { id: 'section-9', name: 'Palmares trophies', selector: 'app-palmares:nth-of-type(1)', style: 'dark', blocks: ['cards-articles'], defaultContent: ['app-palmares:nth-of-type(1) header h2', 'app-palmares:nth-of-type(1) header a'] },
    { id: 'section-10', name: 'Stadium cameras', selector: 'app-stadium-camera:nth-of-type(1)', style: null, blocks: ['cards-articles'], defaultContent: [] },
    { id: 'section-11', name: 'Especiales carousel', selector: 'app-news-herobanner:nth-of-type(7)', style: null, blocks: ['carousel-news'], defaultContent: ['app-news-herobanner:nth-of-type(7) header h2'] },
    { id: 'section-12', name: 'Real Madrid App promo', selector: 'app-footer-sponsors:nth-of-type(1)', style: null, blocks: ['columns-app'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, then sections, then DM images (afterTransform)
const transformers = [
  realmadridCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [realmadridSectionsTransformer] : []),
  realmadridDmImagesTransformer,
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
    // Skip section-* pseudo entries - they are section styling markers, not parseable blocks
    if (blockDef.name.startsWith('section-')) return;

    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        return;
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        // Avoid duplicate registration if multiple selectors match the same element
        if (pageBlocks.some((b) => b.element === element)) return;
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

    // 1. beforeTransform transformers (sections run here per project pattern)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip already-detached elements)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform transformers (cleanup + DM image rewrite)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Fixed target path - this is a single named page
    const path = '/realmadrid-home';

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
