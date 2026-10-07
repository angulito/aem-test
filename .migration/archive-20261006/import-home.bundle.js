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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/columns-hero.js
  function parse(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const contentCol = columns[0];
    const mediaCol = columns.find((c) => c.querySelector("img")) || columns[1];
    const leftCell = [];
    if (contentCol) {
      const heading = contentCol.querySelector('h1, h2, [class*="heading"]');
      const subheading = contentCol.querySelector('p, .subheading, [class*="subheading"]');
      const buttonGroup = contentCol.querySelector(".button-group");
      if (heading) leftCell.push(heading);
      if (subheading) leftCell.push(subheading);
      if (buttonGroup) {
        leftCell.push(buttonGroup);
      } else {
        leftCell.push(...contentCol.querySelectorAll('a.button, a[class*="button"]'));
      }
    }
    const rightCell = [];
    if (mediaCol) {
      rightCell.push(...mediaCol.querySelectorAll("img"));
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-meta.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const mediaCol = columns.find((c) => c.querySelector('img.cover-image, img[class*="cover"]')) || columns[0];
    const contentCol = columns.find((c) => c !== mediaCol && c.querySelector('h1, h2, h3, [class*="heading"]')) || columns.find((c) => c !== mediaCol) || columns[1];
    const leftCell = [];
    if (mediaCol) {
      const img = mediaCol.querySelector('img.cover-image, img[class*="cover"], img');
      if (img) leftCell.push(img);
    }
    const rightCell = [];
    if (contentCol) {
      const breadcrumbs = contentCol.querySelector(".breadcrumbs");
      const heading = contentCol.querySelector('h1, h2, h3, [class*="heading"]');
      if (breadcrumbs) rightCell.push(breadcrumbs);
      if (heading) rightCell.push(heading);
      Array.from(contentCol.querySelectorAll(":scope > div")).forEach((div) => {
        if (div !== breadcrumbs && !div.contains(heading)) rightCell.push(div);
      });
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-meta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-snapshot.js
  function parse3(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      const textCell = [];
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const paras = Array.from(card.querySelectorAll("p"));
      const ctas = Array.from(card.querySelectorAll("a"));
      if (heading) textCell.push(heading);
      textCell.push(...paras);
      textCell.push(...ctas);
      cells.push([img, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-snapshot", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-people.js
  function parse4(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    const cells = [];
    panes.forEach((pane, i) => {
      const labelCell = [];
      const btn = menuButtons[i];
      if (btn) {
        const textContainer = Array.from(btn.querySelectorAll("div")).find(
          (d) => !d.classList.contains("avatar") && !d.querySelector("img") && d.querySelector("strong")
        );
        if (textContainer) {
          labelCell.push(textContainer);
        } else {
          labelCell.push(...btn.childNodes);
        }
      }
      if (labelCell.length === 0) labelCell.push(`Tab ${i + 1}`);
      const contentCell = [];
      const inner = pane.querySelector(":scope > .grid-layout") || pane;
      const innerChildren = Array.from(inner.querySelectorAll(":scope > div"));
      if (innerChildren.length) {
        contentCell.push(...innerChildren);
      } else {
        contentCell.push(...pane.childNodes);
      }
      cells.push([labelCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-people", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-latest.js
  function parse5(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      const textCell = [];
      const meta = card.querySelector(".article-card-meta");
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (meta) textCell.push(meta);
      const href = card.getAttribute("href");
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        textCell.push(heading);
      }
      cells.push([img, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-latest", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-questions.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, details.faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const answer = item.querySelector(".faq-answer");
      let titleContent;
      const questionText = summary ? summary.querySelector("span") : null;
      if (questionText) {
        titleContent = questionText;
      } else if (summary) {
        titleContent = summary.textContent.trim();
      } else {
        titleContent = "";
      }
      const contentCell = answer || "";
      cells.push([titleContent, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-questions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-story.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const buttonGroup = element.querySelector(".button-group");
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (buttonGroup) {
      contentCell.push(buttonGroup);
    } else {
      contentCell.push(...element.querySelectorAll('a.button, a[class*="button"]'));
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-v15-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer",
        ".breadcrumbs",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-v15-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND Trendsetters homepage: hero, featured article intro, image gallery, testimonial tabs, latest articles, FAQ, and closing CTA banner.",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      { name: "columns-hero", instances: ["main > header.secondary-section .grid-layout.grid-gap-xxl"] },
      { name: "columns-meta", instances: ["main > section:nth-of-type(1) .grid-layout.grid-gap-lg"] },
      { name: "cards-snapshot", instances: ["main > section:nth-of-type(2) .grid-layout.desktop-4-column"] },
      { name: "tabs-people", instances: ["main > section:nth-of-type(3) .tabs-wrapper"] },
      { name: "cards-latest", instances: ["main > section:nth-of-type(4) .grid-layout.desktop-4-column"] },
      { name: "accordion-questions", instances: ["main > section:nth-of-type(5) .faq-list"] },
      { name: "hero-story", instances: ["main > section:nth-of-type(6) .grid-layout.desktop-1-column"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: "main > header.secondary-section", style: "secondary", blocks: ["columns-hero"], defaultContent: [] },
      { id: "section-2", name: "Featured article intro", selector: "main > section:nth-of-type(1)", style: null, blocks: ["columns-meta"], defaultContent: [] },
      { id: "section-3", name: "Snapshot gallery", selector: "main > section:nth-of-type(2)", style: "secondary", blocks: ["cards-snapshot"], defaultContent: ["main > section:nth-of-type(2) .container > .utility-text-align-center"] },
      { id: "section-4", name: "Testimonial tabs", selector: "main > section:nth-of-type(3)", style: null, blocks: ["tabs-people"], defaultContent: [] },
      { id: "section-5", name: "Latest articles", selector: "main > section:nth-of-type(4)", style: "secondary", blocks: ["cards-latest"], defaultContent: ["main > section:nth-of-type(4) .container > .utility-text-align-center"] },
      { id: "section-6", name: "FAQ", selector: "main > section:nth-of-type(5)", style: null, blocks: ["accordion-questions"], defaultContent: ["main > section:nth-of-type(5) .container > .grid-layout > div:first-child"] },
      { id: "section-7", name: "Closing CTA banner", selector: "main > section:nth-of-type(6)", style: null, blocks: ["hero-story"], defaultContent: [] }
    ]
  };
  var parsers = {
    "columns-hero": parse,
    "columns-meta": parse2,
    "cards-snapshot": parse3,
    "tabs-people": parse4,
    "cards-latest": parse5,
    "accordion-questions": parse6,
    "hero-story": parse7
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/angulohe-trebdwknd-v15" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
