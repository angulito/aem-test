/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPatientParser from './parsers/hero-patient.js';
import cardsDashboardParser from './parsers/cards-dashboard.js';
import columnsFocusParser from './parsers/columns-focus.js';
import videoFeaturedParser from './parsers/video-featured.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsQuoteParser from './parsers/columns-quote.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import dmImagesTransformer from './transformers/abbvie-dm-images.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-patient': heroPatientParser,
  'cards-dashboard': cardsDashboardParser,
  'columns-focus': columnsFocusParser,
  'video-featured': videoFeaturedParser,
  'columns-feature': columnsFeatureParser,
  'columns-quote': columnsQuoteParser,
  'cards-feature': cardsFeatureParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'science',
  description: 'AbbVie science (Our R&D Approach) page with hero, R&D stats, focus areas, featured video, explore columns, video+quote, story cards, FAQ accordion, and closing CTA',
  urls: ['https://www.abbvie.com/science.html'],
  blocks: [
    { name: 'hero-patient', instances: ['.container.cmp-container-x-large.align-center'] },
    { name: 'cards-dashboard', instances: ['.dashboardcards.size-medium-vertical'] },
    { name: 'columns-focus', instances: ['.grid.cmp-grid-meganav'] },
    { name: 'video-featured', instances: ['.video.video-default.cmp-video-full-width'] },
    { name: 'columns-feature', instances: ['.container.cmp-container-full-width.height-default'] },
    { name: 'columns-quote', instances: ['.container.default-radius.cmp-container-xxx-large'] },
    { name: 'cards-feature', instances: ['.grid.cmp-grid-full-page-4'] },
    { name: 'accordion-faq', instances: ['.accordion.panelcontainer.cmp-accordion-large'] },
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
