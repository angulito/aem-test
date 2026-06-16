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

  // tools/importer/import-blog-listing.js
  var import_blog_listing_exports = {};
  __export(import_blog_listing_exports, {
    default: () => import_blog_listing_default
  });

  // tools/importer/parsers/hero-blog.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h1.h1-heading, [class*="h1-heading"], h2');
    const subheading = element.querySelector('p.subheading, [class*="subheading"], .container p');
    let ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (ctaLinks.length === 0) {
      ctaLinks = Array.from(element.querySelectorAll(".container a"));
    }
    const coverImage = element.querySelector('img.cover-image, [class*="cover-image"], img');
    if (!heading && !subheading && !coverImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (coverImage) {
      cells.push([coverImage]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) contentWrapper.append(heading);
    if (subheading) contentWrapper.append(subheading);
    ctaLinks.forEach((link) => contentWrapper.append(link));
    cells.push([contentWrapper]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document }) {
    const grid = element.querySelector(".grid-layout") || element;
    const image = grid.querySelector('img.cover-image, img[class*="cover"], img');
    const textCell = [];
    const metaRow = grid.querySelector('.flex-horizontal, [class*="flex"]');
    if (metaRow && (metaRow.querySelector(".tag") || metaRow.querySelector('[class*="paragraph"]'))) {
      textCell.push(metaRow);
    }
    const heading = grid.querySelector('h2.h2-heading, h2, [class*="heading"]');
    if (heading) textCell.push(heading);
    const lead = grid.querySelector('p.paragraph-lg, p[class*="paragraph-lg"]') || Array.from(grid.querySelectorAll("p")).find((p) => !metaRow || !metaRow.contains(p));
    if (lead) textCell.push(lead);
    const ctaGroup = grid.querySelector(".button-group");
    const cta = ctaGroup && ctaGroup.querySelector("a") || grid.querySelector('a.button, a[class*="button"]');
    if (cta) textCell.push(cta);
    if (!image && textCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > .article-card")
    );
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".article-card-image img, img.cover-image, img");
      const meta = card.querySelector(".article-card-meta");
      const title = card.querySelector('h3, h4, h2, [class*="heading"]');
      const href = card.matches("a[href]") ? card.getAttribute("href") : card.querySelector("a[href]") ? card.querySelector("a[href]").getAttribute("href") : null;
      if (!image && !title && !meta) return;
      const textCell = [];
      if (meta) textCell.push(meta);
      if (title) {
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = title.textContent.trim();
          const heading = document.createElement("h4");
          heading.append(link);
          textCell.push(heading);
        } else {
          textCell.push(title);
        }
      }
      cells.push([image || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "header.navbar",
        "nav#nav-menu",
        "footer.footer",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const findSectionEl = (section) => {
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
      const sectionEl = findSectionEl(section);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        }
      }
      if (i > 0 && sectionEl.parentNode) {
        sectionEl.parentNode.insertBefore(doc.createElement("hr"), sectionEl);
      }
    }
  }

  // tools/importer/import-blog-listing.js
  var PAGE_TEMPLATE = {
    name: "blog-listing",
    description: "Blog landing/listing page with hero, featured article, latest articles grid, and subscribe CTA",
    urls: [
      "https://www.wknd-trendsetters.site/blog"
    ],
    blocks: [
      {
        name: "hero-blog",
        instances: ["#main-content > header.section.secondary-section"]
      },
      {
        name: "columns-feature",
        instances: ["#main-content > section.section:nth-of-type(1)"]
      },
      {
        name: "cards-article",
        instances: ["#articles div.grid-layout.desktop-4-column"]
      }
    ],
    sections: [
      {
        id: "section-2",
        name: "hero header",
        selector: ["#main-content > header.section.secondary-section"],
        style: "secondary",
        blocks: ["hero-blog"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "featured article",
        selector: ["#main-content > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Latest Articles grid",
        selector: ["#articles"],
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: [
          "#articles > div.container > div.utility-text-align-center > h2.h2-heading",
          "#articles > div.container > div.utility-text-align-center > p.paragraph-lg"
        ]
      },
      {
        id: "section-5",
        name: "subscribe CTA",
        selector: ["#main-content > section.section.accent-section"],
        style: "accent",
        blocks: [],
        defaultContent: [
          "#main-content > section.section.accent-section .utility-text-align-center > h2.h2-heading",
          "#main-content > section.section.accent-section .utility-text-align-center > p.paragraph-lg",
          "#main-content > section.section.accent-section .utility-text-align-center .button-group"
        ]
      }
    ]
  };
  var parsers = {
    "hero-blog": parse,
    "columns-feature": parse2,
    "cards-article": parse3
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
  var import_blog_listing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
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
  return __toCommonJS(import_blog_listing_exports);
})();
