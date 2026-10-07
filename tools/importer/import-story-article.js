/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import dmImagesTransformer from './transformers/abbvie-dm-images.js';
import storyArticleTransformer from './transformers/abbvie-story-article.js';

// TRANSFORMER REGISTRY
// Order: cleanup (strip chrome) -> story-article (rebuild hero + body + metadata)
//        -> dm-images (convert Scene7 anchors/imgs to responsive picture renditions)
const transformers = [
  cleanupTransformer,
  storyArticleTransformer,
  dmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION
// story-article is one block (story-hero) + default-content body. The dedicated
// transformer rebuilds the article header and flattens the body column.
const PAGE_TEMPLATE = {
  name: 'story-article',
  description: 'AbbVie "Our Stories" editorial article: full-bleed hero image + article header (back-link, date/category/read-time, title, dek) via story-hero block, then long-form default-content body with inline images and captions',
  urls: ['https://www.abbvie.com/who-we-are/our-stories/a-molecular-behavior-chart-speeding-up-research-with-predictive-analytics.html'],
  blocks: [],
  sections: [],
};

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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform: cookie banner + popups
    executeTransformers('beforeTransform', main, payload);

    // 2. afterTransform: strip chrome -> rebuild story-article -> DM image rendering
    executeTransformers('afterTransform', main, payload);

    // 3. WebImporter built-in image URL adjustment
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 4. Sanitized path
    let path = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!path) path = '/index';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: ['story-hero'],
      },
    }];
  },
};
