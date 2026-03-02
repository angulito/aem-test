/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import teaserFeaturedParser from './parsers/teaser-featured.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import heroAdventureParser from './parsers/hero-adventure.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'teaser-featured': teaserFeaturedParser,
  'cards-teaser': cardsTeaserParser,
  'hero-adventure': heroAdventureParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'wknd-homepage',
  description: 'WKND homepage - main landing page for the WKND site',
  urls: ['https://wknd.site/us/en.html'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.carousel.cmp-carousel--hero'],
    },
    {
      name: 'teaser-featured',
      instances: ['.teaser.cmp-teaser--featured'],
    },
    {
      name: 'cards-teaser',
      instances: ['.image-list.list'],
    },
    {
      name: 'hero-adventure',
      instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.carousel.cmp-carousel--hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: '.teaser.cmp-teaser--featured',
      style: null,
      blocks: ['teaser-featured'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Recent Articles',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(1)',
      style: null,
      blocks: ['cards-teaser'],
      defaultContent: [
        '.title.cmp-title--underline:has(.cmp-title__text)',
        '.button.cmp-button--primary:has(.cmp-button__text)',
      ],
    },
    {
      id: 'section-4',
      name: 'Next Adventures',
      selector: [
        '.title.cmp-title--underline:nth-of-type(2)',
        '.teaser.cmp-teaser--hero.cmp-teaser--imagebottom',
      ],
      style: null,
      blocks: ['hero-adventure'],
      defaultContent: ['.title.cmp-title--underline:nth-of-type(2)'],
    },
    {
      id: 'section-5',
      name: 'Adventure Listings',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(2)',
      style: null,
      blocks: ['cards-teaser'],
      defaultContent: [
        '.title:not(.cmp-title--underline)',
        '.button.cmp-button--primary:nth-of-type(2)',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [wkndSectionsTransformer]
    : []),
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
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (cleanup, flatten containers, insert section breaks)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (section metadata, final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname
        .replace(/\/$/, '')
        .replace(/\.html$/, ''),
    );

    return [
      {
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name),
        },
      },
    ];
  },
};
