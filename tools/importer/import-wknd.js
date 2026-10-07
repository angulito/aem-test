/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLandingParser from './parsers/hero-landing.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article-wknd.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-landing': heroLandingParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'wknd-trendsetters',
  description: 'WKND Trendsetters homepage: hero landing, featured article columns, photo gallery cards, testimonial tabs, latest-article cards, FAQ accordion, and a closing CTA banner',
  urls: ['https://www.wknd-trendsetters.site/'],
  blocks: [
    { name: 'hero-landing', instances: ['header.secondary-section .grid-layout.grid-gap-xxl'] },
    { name: 'columns-article', instances: ['main > section:nth-of-type(1) .grid-layout.grid-gap-lg'] },
    { name: 'cards-gallery', instances: ['main > section:nth-of-type(2) .grid-layout.desktop-4-column'] },
    { name: 'tabs-testimonial', instances: ['main > section:nth-of-type(3) .tabs-wrapper'] },
    { name: 'cards-article', instances: ['main > section:nth-of-type(4) .grid-layout.desktop-4-column'] },
    { name: 'accordion-faq', instances: ['main > section:nth-of-type(5) .faq-list'] },
    { name: 'hero-banner', instances: ['main > section:nth-of-type(6) .utility-position-relative'] },
  ],
  sections: [
    { name: 'Hero Landing', selector: 'header.section.secondary-section', style: null },
    { name: 'Featured Article', selector: 'main > section:nth-of-type(1)', style: null },
    { name: 'Photo Gallery', selector: 'main > section:nth-of-type(2)', style: null },
    { name: 'Testimonials', selector: 'main > section:nth-of-type(3)', style: null },
    { name: 'Latest Articles', selector: 'main > section:nth-of-type(4)', style: null },
    { name: 'FAQ', selector: 'main > section:nth-of-type(5)', style: null },
    { name: 'CTA Banner', selector: 'main > section:nth-of-type(6)', style: null },
  ],
};

// Output document path (override — import into a specific page name)
const OUTPUT_PATH = '/angulohe-20260623';

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
        pageBlocks.push({ name: blockDef.name, selector, element });
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

    // 2. Find + parse blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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

    // 3. afterTransform: section breaks + chrome cleanup
    executeTransformers('afterTransform', main, payload);

    // 4. WebImporter built-in rules
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return [{
      element: main,
      path: OUTPUT_PATH,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
