/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsHeroParser from './parsers/columns-hero.js';
import columnsMetaParser from './parsers/columns-meta.js';
import cardsSnapshotParser from './parsers/cards-snapshot.js';
import tabsPeopleParser from './parsers/tabs-people.js';
import cardsLatestParser from './parsers/cards-latest.js';
import accordionQuestionsParser from './parsers/accordion-questions.js';
import heroStoryParser from './parsers/hero-story.js';

// TRANSFORMER IMPORTS (v15 fresh migration)
import cleanupTransformer from './transformers/wknd-trendsetters-v15-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-v15-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND Trendsetters homepage: hero, featured article intro, image gallery, testimonial tabs, latest articles, FAQ, and closing CTA banner.',
  urls: [
    'https://www.wknd-trendsetters.site/',
  ],
  blocks: [
    { name: 'columns-hero', instances: ['main > header.secondary-section .grid-layout.grid-gap-xxl'] },
    { name: 'columns-meta', instances: ['main > section:nth-of-type(1) .grid-layout.grid-gap-lg'] },
    { name: 'cards-snapshot', instances: ['main > section:nth-of-type(2) .grid-layout.desktop-4-column'] },
    { name: 'tabs-people', instances: ['main > section:nth-of-type(3) .tabs-wrapper'] },
    { name: 'cards-latest', instances: ['main > section:nth-of-type(4) .grid-layout.desktop-4-column'] },
    { name: 'accordion-questions', instances: ['main > section:nth-of-type(5) .faq-list'] },
    { name: 'hero-story', instances: ['main > section:nth-of-type(6) .grid-layout.desktop-1-column'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: 'main > header.secondary-section', style: 'secondary', blocks: ['columns-hero'], defaultContent: [] },
    { id: 'section-2', name: 'Featured article intro', selector: 'main > section:nth-of-type(1)', style: null, blocks: ['columns-meta'], defaultContent: [] },
    { id: 'section-3', name: 'Snapshot gallery', selector: 'main > section:nth-of-type(2)', style: 'secondary', blocks: ['cards-snapshot'], defaultContent: ['main > section:nth-of-type(2) .container > .utility-text-align-center'] },
    { id: 'section-4', name: 'Testimonial tabs', selector: 'main > section:nth-of-type(3)', style: null, blocks: ['tabs-people'], defaultContent: [] },
    { id: 'section-5', name: 'Latest articles', selector: 'main > section:nth-of-type(4)', style: 'secondary', blocks: ['cards-latest'], defaultContent: ['main > section:nth-of-type(4) .container > .utility-text-align-center'] },
    { id: 'section-6', name: 'FAQ', selector: 'main > section:nth-of-type(5)', style: null, blocks: ['accordion-questions'], defaultContent: ['main > section:nth-of-type(5) .container > .grid-layout > div:first-child'] },
    { id: 'section-7', name: 'Closing CTA banner', selector: 'main > section:nth-of-type(6)', style: null, blocks: ['hero-story'], defaultContent: [] },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-hero': columnsHeroParser,
  'columns-meta': columnsMetaParser,
  'cards-snapshot': cardsSnapshotParser,
  'tabs-people': tabsPeopleParser,
  'cards-latest': cardsLatestParser,
  'accordion-questions': accordionQuestionsParser,
  'hero-story': heroStoryParser,
};

// TRANSFORMER REGISTRY - cleanup first, sections after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. This homepage migrates to the named target
    //    page; the root URL pathname is '/', which would otherwise yield an
    //    empty path (crashing the bundled importer), so map it to the target name.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/angulohe-trebdwknd-v15' : rawPath);

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
