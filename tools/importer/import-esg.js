/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroEsgParser from './parsers/hero-esg.js';
import columnsPillarsParser from './parsers/columns-pillars.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsDriverParser from './parsers/cards-driver.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import dmImagesTransformer from './transformers/abbvie-dm-images.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-patient': heroEsgParser,
  'columns-pillars': columnsPillarsParser,
  'columns-feature': columnsFeatureParser,
  'cards-driver': cardsDriverParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'esg',
  description: 'AbbVie ESG (Environmental, Social & Governance) page with overlapping-card hero, three foundational pillars, ESG Action Report feature, material drivers card grid, and a transparency feature CTA',
  urls: ['https://www.abbvie.com/sustainability/environmental-social-and-governance.html'],
  blocks: [
    { name: 'hero-patient', instances: ['.container.large-radius.cmp-container-full-width.height-default.no-bottom-margin'] },
    { name: 'columns-pillars', instances: ['.teaser-h2 + .grid.cmp-grid-custom'] },
    { name: 'columns-feature', instances: ['#container-e8488fa96e', '#container-0b6ce35200'] },
    { name: 'cards-driver', instances: ['.container.cmp-container-xx-large.height-short + .grid.cmp-grid-custom'] },
  ],
  sections: [],
};

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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    let path = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!path) path = '/index';

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
