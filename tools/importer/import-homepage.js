/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsHomepageParser from './parsers/columns-homepage.js';
import videoFeaturedParser from './parsers/video-featured.js';
import cardsDashboardParser from './parsers/cards-dashboard.js';
import cardsArticleParser from './parsers/cards-article.js';
import embedVideoParser from './parsers/embed-video.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsInvestorParser from './parsers/cards-investor.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsStatsParser from './parsers/cards-stats.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import dmImagesTransformer from './transformers/abbvie-dm-images.js';
import sectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-homepage': columnsHomepageParser,
  'video-featured': videoFeaturedParser,
  'cards-dashboard': cardsDashboardParser,
  'cards-article': cardsArticleParser,
  'embed-video': embedVideoParser,
  'cards-feature': cardsFeatureParser,
  'cards-investor': cardsInvestorParser,
  'columns-feature': columnsFeatureParser,
  'cards-stats': cardsStatsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AbbVie corporate homepage with hero, featured content sections, and calls to action',
  urls: ['https://www.abbvie.com/'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.homepage-hero-controller .cmp-home-hero'],
    },
    {
      name: 'columns-homepage',
      instances: ['.container.homepage-overlap .cmp-grid-custom'],
    },
    {
      name: 'video-featured',
      instances: ['#maincontent > .aem-Grid > .responsivegrid > .aem-Grid > .video.cmp-video-xx-large:first-of-type'],
    },
    {
      name: 'cards-dashboard',
      instances: ['#teaser-12e164de76 ~ .grid.aem-GridColumn'],
    },
    {
      name: 'cards-article',
      instances: ['.container.cmp-container-large .cardpagestory.card-standard'],
    },
    {
      name: 'embed-video',
      instances: ['#teaser-12e164de76 ~ .container ~ .video.cmp-video-xx-large'],
    },
    {
      name: 'cards-feature',
      instances: ['#section02 ~ .grid.cmp-grid-custom'],
    },
    {
      name: 'cards-investor',
      instances: ['#section03 ~ .grid.aem-GridColumn'],
    },
    {
      name: 'columns-feature',
      instances: ['.container.cmp-container-xxx-large.default-radius .grid.no-bottom-margin'],
    },
    {
      name: 'cards-stats',
      instances: ['#section04 ~ .container.cmp-container-full-width'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.homepage-hero-controller',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Press Releases and Featured',
      selector: '.container.homepage-overlap',
      style: null,
      blocks: ['columns-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Patients Section',
      selector: ['#teaser-f34db54d6a', '.video.cmp-video-xx-large:first-of-type'],
      style: null,
      blocks: ['video-featured'],
      defaultContent: ['#teaser-f34db54d6a .cmp-teaser__title', '#teaser-f34db54d6a .cmp-teaser__description', '#teaser-f34db54d6a .cmp-teaser__action-container'],
    },
    {
      id: 'section-4',
      name: 'Science and Innovation',
      selector: ['#teaser-12e164de76', '.container.cmp-container-large'],
      style: null,
      blocks: ['cards-dashboard', 'cards-article', 'embed-video'],
      defaultContent: ['#teaser-12e164de76 .cmp-teaser__pretitle', '#teaser-12e164de76 .cmp-teaser__title', '#teaser-12e164de76 .cmp-teaser__description'],
    },
    {
      id: 'section-5',
      name: 'Culture and Careers',
      selector: ['#section02', '.grid.cmp-grid-custom'],
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['#section02 .cmp-teaser__pretitle', '#section02 .cmp-teaser__title', '#section02 .cmp-teaser__description'],
    },
    {
      id: 'section-6',
      name: 'Explore Opportunities',
      selector: '.container.medium-radius.cmp-container-xxx-large',
      style: 'dark',
      blocks: [],
      defaultContent: ['#title-efb1f4a0fb .cmp-title__text', '#text-a600f16dc1 .cmp-text', '#button-22d1824ab9'],
    },
    {
      id: 'section-7',
      name: 'Investor Resources',
      selector: ['#section03', '#section03 ~ .grid'],
      style: null,
      blocks: ['cards-investor'],
      defaultContent: ['#section03 .cmp-teaser__pretitle', '#section03 .cmp-teaser__title', '#section03 .cmp-teaser__description'],
    },
    {
      id: 'section-8',
      name: 'Manufacturing Feature',
      selector: '.container.default-radius.cmp-container-xxx-large',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'ESG Sustainability',
      selector: ['#section04', '#section04 ~ .container.cmp-container-full-width'],
      style: null,
      blocks: ['cards-stats'],
      defaultContent: ['#section04 .cmp-teaser__pretitle', '#section04 .cmp-teaser__title', '#section04 .cmp-teaser__description'],
    },
  ],
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
