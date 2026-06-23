/* eslint-disable */
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

  // tools/importer/import-faq.js
  var import_faq_exports = {};
  __export(import_faq_exports, {
    default: () => import_faq_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1.h1-heading, h1, h2.h2-heading, h2, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .subheading");
    const paragraphs = Array.from(element.querySelectorAll("p")).filter(
      (p) => p !== subheading
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a, .button-container a, a.button, a.cta")
    );
    const coverImages = Array.from(
      element.querySelectorAll('img.cover-image, img[class*="cover"], img')
    );
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    paragraphs.forEach((p) => contentCell.push(p));
    ctaLinks.forEach((a) => contentCell.push(a));
    if (contentCell.length) cells.push([contentCell]);
    if (coverImages.length) cells.push([coverImages]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(":scope > details.faq-item, details.faq-item");
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      let question = "";
      if (summary) {
        const span = summary.querySelector("span");
        question = (span ? span.textContent : summary.textContent).trim();
      }
      const answer = item.querySelector("div.faq-answer, .faq-answer");
      const answerCell = answer || "";
      if (question || answer) {
        cells.push([question, answerCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse3(element, { document }) {
    const grid = element.querySelector(".grid-layout") || element.querySelector(".container") || element;
    let columns = Array.from(grid.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(element.querySelectorAll(":scope > div"));
    }
    const contactItems = element.querySelector(".contact-items");
    const columnCells = columns.map((col) => {
      if (contactItems && col.contains(contactItems)) {
        return [contactItems];
      }
      const childContent = Array.from(col.children);
      if (childContent.length > 0) return childContent;
      return Array.from(col.childNodes);
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // <a href="#main-content" class="skip-link">  (line 1)
        ".navbar",
        // global header / mega menu / mobile toggle    (line 1)
        "footer"
        // <footer class="footer inverse-footer">       (line 60)
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
        img.remove();
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolveSectionEl = (section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        if (!sel) continue;
        const found = element.querySelector(sel);
        if (found) return found;
      }
      return null;
    };
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolveSectionEl(section);
      if (!sectionEl) {
        console.warn("Section selector did not match, skipping:", section.id, section.selector);
        continue;
      }
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.insertAdjacentElement("afterend", metadataBlock);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        sectionEl.insertAdjacentElement("beforebegin", hr);
      }
    }
  }

  // tools/importer/import-faq.js
  var PAGE_TEMPLATE = {
    name: "faq",
    description: "FAQ page with expandable question/answer accordion list",
    urls: [
      "https://www.wknd-trendsetters.site/faq"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "columns-contact",
        instances: ["section.section.secondary-section:has(.contact-items)"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero intro",
        selector: "header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-intro"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "FAQ accordion",
        selector: "section.section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Let's connect",
        selector: "section.section:has(.contact-items)",
        style: "secondary",
        blocks: ["columns-contact"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Closing CTA banner",
        selector: "section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: [
          "section.section.accent-section h2",
          "section.section.accent-section p",
          "section.section.accent-section a"
        ]
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "accordion-faq": parse2,
    "columns-contact": parse3
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
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_faq_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath("/wknd-faq");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_faq_exports);
})();
