/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCoverParser from "./parsers/hero-cover.js";
import columnsSplitParser from "./parsers/columns-split.js";
import carouselFlipbookParser from "./parsers/carousel-flipbook.js";
import cardsMosaicParser from "./parsers/cards-mosaic.js";

// TRANSFORMER IMPORTS (Adobe Express Webpage specific; other transformers in
// tools/importer/transformers/ belong to other sites and are intentionally not used)
import expressCleanupTransformer from "./transformers/express-cleanup.js";
import expressSectionsTransformer from "./transformers/express-sections.js";

// PARSER REGISTRY
const parsers = {
  "hero-cover": heroCoverParser,
  "columns-split": columnsSplitParser,
  "carousel-flipbook": carouselFlipbookParser,
  "cards-mosaic": cardsMosaicParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "webpage",
  "description": "Adobe Express Webpage (story-style travel guide): full-bleed title hero, split image/text sections, scroll-driven photo flipbook, photo mosaic and pull quote on a yellow theme",
  "urls": [
    "https://new.express.adobe.com/webpage/DYft29Wzo0QLK"
  ],
  "blocks": [
    {
      "name": "hero-cover",
      "instances": [
        ".article > .section.title-section"
      ]
    },
    {
      "name": "columns-split",
      "instances": [
        ".article > .section.split-layout.image-on-left",
        ".article > .section.split-layout.image-on-right"
      ]
    },
    {
      "name": "carousel-flipbook",
      "instances": [
        ".article > .section.card-flipbook-section"
      ]
    },
    {
      "name": "cards-mosaic",
      "instances": [
        ".article > .section.photo-grid-section"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Title hero",
      "selector": [
        ".article > .section.title-section"
      ],
      "style": null,
      "blocks": [
        "hero-cover"
      ],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Overview",
      "selector": [
        ".article > .section.single-column-section.large-content-spacing-top.large-content-spacing-bottom"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".section-content-view h2",
        ".section-content-view p"
      ]
    },
    {
      "id": "3",
      "name": "Best Beaches",
      "selector": [
        ".article > .section.split-layout.image-on-left"
      ],
      "style": null,
      "blocks": [
        "columns-split"
      ],
      "defaultContent": []
    },
    {
      "id": "4",
      "name": "Food & Drink",
      "selector": [
        ".article > .section.split-layout.image-on-right"
      ],
      "style": null,
      "blocks": [
        "columns-split"
      ],
      "defaultContent": []
    },
    {
      "id": "5",
      "name": "Highlights flipbook",
      "selector": [
        ".article > .section.card-flipbook-section"
      ],
      "style": null,
      "blocks": [
        "carousel-flipbook"
      ],
      "defaultContent": []
    },
    {
      "id": "6",
      "name": "Tips and Tricks",
      "selector": [
        ".article > .section.single-column-section.top-shadow"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".section-content-view h2",
        ".section-content-view p",
        ".section-content-view figure img",
        ".section-content-view figcaption"
      ]
    },
    {
      "id": "7",
      "name": "Photo grid",
      "selector": [
        ".article > .section.photo-grid-section"
      ],
      "style": null,
      "blocks": [
        "cards-mosaic"
      ],
      "defaultContent": []
    },
    {
      "id": "8",
      "name": "Closing quote",
      "selector": [
        ".article > .section.single-column-section.large-content-spacing-bottom:not(.large-content-spacing-top)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".section-content-view blockquote"
      ]
    }
  ]
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks
const transformers = [
  expressCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [expressSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - beforeTransform | afterTransform
 * @param {Element} element - root element
 * @param {Object} payload - { document, url, html, params }
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document
 * @param {Object} template
 * @returns {Array}
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
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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

    // 1. Initial cleanup + section breaks
    executeTransformers("beforeTransform", main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse blocks
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

    // 4. Final cleanup + section metadata
    executeTransformers("afterTransform", main, payload);

    // 5. Built-in rules
    const hr = document.createElement("hr");
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root maps to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, "")
      .replace(/\.html?$/, "");
    const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);

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
