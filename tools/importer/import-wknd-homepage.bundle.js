var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-wknd-homepage.js
  var import_wknd_homepage_exports = {};
  __export(import_wknd_homepage_exports, {
    default: () => import_wknd_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image img");
      const heading = slide.querySelector("h2.cmp-teaser__title, h1, h2, h3");
      const descEl = slide.querySelector(".cmp-teaser__description");
      const ctaLink = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const imageCell = img ? [img] : [];
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (descEl) contentCell.push(descEl);
      if (ctaLink) contentCell.push(ctaLink);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-featured.js
  function parse2(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle, p.cmp-teaser__pretitle");
    const heading = element.querySelector("h2.cmp-teaser__title, h1, h2, h3");
    const descEl = element.querySelector(".cmp-teaser__description");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imageCell = img ? [img] : [];
    const contentCell = [];
    if (pretitle) contentCell.push(pretitle);
    if (heading) contentCell.push(heading);
    if (descEl) contentCell.push(descEl);
    if (ctaLink) contentCell.push(ctaLink);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "teaser-featured",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".cmp-image-list__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, .cmp-image img");
      const titleLink = item.querySelector("a.cmp-image-list__item-title-link");
      const titleSpan = item.querySelector(".cmp-image-list__item-title");
      const descSpan = item.querySelector(".cmp-image-list__item-description");
      const imageCell = img ? [img] : [];
      const contentCell = [];
      if (titleLink && titleSpan) {
        const strong = document.createElement("strong");
        strong.textContent = titleSpan.textContent.trim();
        const link = document.createElement("a");
        link.href = titleLink.href;
        link.appendChild(strong);
        const titleP = document.createElement("p");
        titleP.appendChild(link);
        contentCell.push(titleP);
      }
      if (descSpan) {
        const descP = document.createElement("p");
        descP.textContent = descSpan.textContent.trim();
        contentCell.push(descP);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-teaser",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-adventure.js
  function parse4(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image img");
    const heading = element.querySelector("h2.cmp-teaser__title, h1, h2, h3");
    const descEl = element.querySelector(".cmp-teaser__description");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (descEl) contentCell.push(descEl);
    if (ctaLink) contentCell.push(ctaLink);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-adventure",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.experiencefragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-carousel__actions",
        ".cmp-carousel__indicators"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".separator"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      element.querySelectorAll("*").forEach((el) => {
        const attrs = Array.from(el.attributes);
        attrs.forEach((attr) => {
          if (attr.name.startsWith("data-cmp")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "meta"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function findSectionBoundary(element, section, markedElements) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    const allSelectors = [...selectors, ...section.defaultContent || []];
    for (const sel of allSelectors) {
      try {
        const exact = element.querySelector(sel);
        if (exact && !markedElements.has(exact)) {
          return exact;
        }
      } catch (e) {
      }
      const stripped = sel.replace(/:nth-of-type\(\d+\)/g, "").replace(/:nth-child\(\d+\)/g, "");
      if (stripped !== sel) {
        try {
          const candidates = element.querySelectorAll(stripped);
          for (const c of candidates) {
            if (!markedElements.has(c)) {
              return c;
            }
          }
        } catch (e) {
        }
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    var _a, _b;
    if (hookName === TransformHook2.beforeTransform) {
      const document = element.ownerDocument;
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const unwrapSelectors = [
        "main.cmp-layout-container--fixed",
        ".cmp-container",
        ".aem-Grid"
      ];
      for (let pass = 0; pass < 3; pass++) {
        unwrapSelectors.forEach((sel) => {
          element.querySelectorAll(sel).forEach((wrapper) => {
            while (wrapper.firstChild) {
              wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            }
            wrapper.remove();
          });
        });
      }
      const markedElements = /* @__PURE__ */ new Set();
      const boundaries = [];
      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const found = findSectionBoundary(element, section, markedElements);
        if (found) {
          markedElements.add(found);
          boundaries.push(found);
        }
      }
      for (let i = boundaries.length - 1; i >= 0; i--) {
        let target = boundaries[i];
        while (target.parentElement && target.parentElement !== element) {
          target = target.parentElement;
        }
        if (target.parentElement === element) {
          element.insertBefore(document.createElement("hr"), target);
        }
      }
    }
    if (hookName === TransformHook2.afterTransform) {
      const sections = (_b = payload == null ? void 0 : payload.template) == null ? void 0 : _b.sections;
      if (!sections) return;
      const document = element.ownerDocument;
      const hrs = Array.from(element.querySelectorAll(":scope > hr"));
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section.style) continue;
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (i < hrs.length) {
          element.insertBefore(block, hrs[i]);
        } else {
          element.appendChild(block);
        }
      }
    }
  }

  // tools/importer/import-wknd-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "teaser-featured": parse2,
    "cards-teaser": parse3,
    "hero-adventure": parse4
  };
  var PAGE_TEMPLATE = {
    name: "wknd-homepage",
    description: "WKND homepage - main landing page for the WKND site",
    urls: ["https://wknd.site/us/en.html"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".carousel.cmp-carousel--hero"]
      },
      {
        name: "teaser-featured",
        instances: [".teaser.cmp-teaser--featured"]
      },
      {
        name: "cards-teaser",
        instances: [".image-list.list"]
      },
      {
        name: "hero-adventure",
        instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".carousel.cmp-carousel--hero",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: ".teaser.cmp-teaser--featured",
        style: null,
        blocks: ["teaser-featured"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Recent Articles",
        selector: "main.cmp-layout-container--fixed:nth-of-type(1)",
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: [
          ".title.cmp-title--underline:has(.cmp-title__text)",
          ".button.cmp-button--primary:has(.cmp-button__text)"
        ]
      },
      {
        id: "section-4",
        name: "Next Adventures",
        selector: [
          ".title.cmp-title--underline:nth-of-type(2)",
          ".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"
        ],
        style: null,
        blocks: ["hero-adventure"],
        defaultContent: [".title.cmp-title--underline:nth-of-type(2)"]
      },
      {
        id: "section-5",
        name: "Adventure Listings",
        selector: "main.cmp-layout-container--fixed:nth-of-type(2)",
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: [
          ".title:not(.cmp-title--underline)",
          ".button.cmp-button--primary:nth-of-type(2)"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        }
      });
    });
    return pageBlocks;
  }
  var import_wknd_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [
        {
          element: main,
          path,
          report: {
            title: document.title,
            template: PAGE_TEMPLATE.name,
            blocks: pageBlocks.map((b) => b.name)
          }
        }
      ];
    }
  };
  return __toCommonJS(import_wknd_homepage_exports);
})();
