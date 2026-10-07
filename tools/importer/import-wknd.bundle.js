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

  // tools/importer/import-wknd.js
  var import_wknd_exports = {};
  __export(import_wknd_exports, {
    default: () => import_wknd_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const description = element.querySelector('p.subheading, p[class*="subheading"], .subheading');
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a, a.button, a.cta")
    );
    const images = Array.from(
      element.querySelectorAll("img.cover-image, .grid-gap-xs img, .grid-layout img")
    );
    const cells = [];
    if (images.length > 0) {
      cells.push(images);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const image = element.querySelector(":scope > div:first-child img.cover-image, :scope > div:first-child img");
    const contentDiv = element.querySelector(":scope > div:nth-child(2)");
    const col1 = [];
    if (image) {
      col1.push(image);
    }
    const col2 = [];
    if (contentDiv) {
      const breadcrumbs = contentDiv.querySelector(".breadcrumbs");
      if (breadcrumbs) {
        col2.push(breadcrumbs);
      }
      const heading = contentDiv.querySelector("h2.h2-heading, h2, h1, h3");
      if (heading) {
        col2.push(heading);
      }
      const metaDivs = contentDiv.querySelectorAll(":scope > div:not(.breadcrumbs)");
      metaDivs.forEach((metaDiv) => {
        if (metaDiv.textContent.trim() && !metaDiv.querySelector("h1, h2, h3")) {
          col2.push(metaDiv);
        }
      });
    }
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(':scope > div.utility-aspect-1x1, :scope > div[class*="aspect"]');
    const cells = [];
    cardItems.forEach((item) => {
      const image = item.querySelector("img.cover-image, img");
      if (image) {
        cells.push([image]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    const cells = [];
    tabPanes.forEach((pane, index) => {
      const button = tabButtons[index];
      let tabLabel = "";
      if (button) {
        const nameEl = button.querySelector(".paragraph-sm strong");
        tabLabel = nameEl ? nameEl.textContent.trim() : `Tab ${index + 1}`;
      } else {
        const paneName = pane.querySelector(".paragraph-xl strong");
        tabLabel = paneName ? paneName.textContent.trim() : `Tab ${index + 1}`;
      }
      const contentContainer = document.createElement("div");
      const image = pane.querySelector("img.cover-image");
      if (image) {
        const imgClone = image.cloneNode(true);
        contentContainer.appendChild(imgClone);
      }
      const nameDiv = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameDiv) {
        const nameClone = nameDiv.cloneNode(true);
        contentContainer.appendChild(nameClone);
      }
      const nameParent = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameParent && nameParent.parentElement) {
        const roleEl = nameParent.nextElementSibling;
        if (roleEl && !roleEl.classList.contains("paragraph-xl")) {
          const roleClone = roleEl.cloneNode(true);
          contentContainer.appendChild(roleClone);
        }
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) {
        const quoteClone = quote.cloneNode(true);
        contentContainer.appendChild(quoteClone);
      }
      cells.push([tabLabel, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article-wknd.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll(":scope > a.article-card, a.article-card");
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href") || "";
      const image = card.querySelector("img.cover-image, .article-card-image img, img");
      const tag = card.querySelector(".article-card-meta .tag, .tag");
      const date = card.querySelector(".article-card-meta span:not(.tag), .article-card-meta .paragraph-sm");
      const title = card.querySelector("h3.h4-heading, h3, h2, h4");
      const imageCell = image ? [image] : [];
      const bodyCell = [];
      if (tag && tag.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = tag.textContent.trim();
        p.append(em);
        bodyCell.push(p);
      }
      if (date && date.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = date.textContent.trim();
        bodyCell.push(p);
      }
      if (title && title.textContent.trim()) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = title.textContent.trim();
          h.append(a);
        } else {
          h.textContent = title.textContent.trim();
        }
        bodyCell.push(h);
      }
      if (imageCell.length || bodyCell.length) {
        cells.push([imageCell, bodyCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = element.querySelectorAll('details.faq-item, details[class*="faq"]');
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary.faq-question span, summary span");
      const answerDiv = item.querySelector('div.faq-answer, div[class*="answer"]');
      if (questionSpan && answerDiv) {
        cells.push([questionSpan, answerDiv]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img[class*="background"]');
    const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');
    const description = element.querySelector('p.subheading, p[class*="subheading"], .card-body > p');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, .button-group a, a.button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) contentWrapper.append(heading);
    if (description) contentWrapper.append(description);
    if (ctaLinks.length > 0) ctaLinks.forEach((cta) => contentWrapper.append(cta));
    cells.push([[contentWrapper]]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "a.skip-link",
        ".breadcrumbs"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-wknd.js
  var parsers = {
    "hero-landing": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "wknd-trendsetters",
    description: "WKND Trendsetters homepage: hero landing, featured article columns, photo gallery cards, testimonial tabs, latest-article cards, FAQ accordion, and a closing CTA banner",
    urls: ["https://www.wknd-trendsetters.site/"],
    blocks: [
      { name: "hero-landing", instances: ["header.secondary-section .grid-layout.grid-gap-xxl"] },
      { name: "columns-article", instances: ["main > section:nth-of-type(1) .grid-layout.grid-gap-lg"] },
      { name: "cards-gallery", instances: ["main > section:nth-of-type(2) .grid-layout.desktop-4-column"] },
      { name: "tabs-testimonial", instances: ["main > section:nth-of-type(3) .tabs-wrapper"] },
      { name: "cards-article", instances: ["main > section:nth-of-type(4) .grid-layout.desktop-4-column"] },
      { name: "accordion-faq", instances: ["main > section:nth-of-type(5) .faq-list"] },
      { name: "hero-banner", instances: ["main > section:nth-of-type(6) .utility-position-relative"] }
    ],
    sections: [
      { name: "Hero Landing", selector: "header.section.secondary-section", style: null },
      { name: "Featured Article", selector: "main > section:nth-of-type(1)", style: null },
      { name: "Photo Gallery", selector: "main > section:nth-of-type(2)", style: null },
      { name: "Testimonials", selector: "main > section:nth-of-type(3)", style: null },
      { name: "Latest Articles", selector: "main > section:nth-of-type(4)", style: null },
      { name: "FAQ", selector: "main > section:nth-of-type(5)", style: null },
      { name: "CTA Banner", selector: "main > section:nth-of-type(6)", style: null }
    ]
  };
  var OUTPUT_PATH = "/angulohe-20260623";
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_wknd_default = {
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
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{
        element: main,
        path: OUTPUT_PATH,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_exports);
})();
