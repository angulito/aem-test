/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abbvie-cleanup.js';
import contactLocationTransformer from './transformers/abbvie-contact-location.js';

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  contactLocationTransformer,
];

// PAGE TEMPLATE CONFIGURATION
// contact-location is entirely default content (no blocks). The dedicated
// transformer rebuilds the title / contact-card / legal-text sections.
const PAGE_TEMPLATE = {
  name: 'contact-location',
  description: 'AbbVie country/contact location page: H1 country name, centered contact card (company + address + phones), and left-aligned legal disclosure text with register links',
  urls: ['https://www.abbvie.com/contact-center/locations/croatia.html'],
  blocks: [],
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform: initial cleanup (cookie banner)
    executeTransformers('beforeTransform', main, payload);

    // 2. afterTransform: strip chrome + rebuild contact-location sections + metadata
    executeTransformers('afterTransform', main, payload);

    // 3. WebImporter built-in image URL adjustment (no body images, but harmless)
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 4. Generate sanitized path
    let path = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!path) path = '/index';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
