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

  // tools/importer/import-esg.js
  var import_esg_exports = {};
  __export(import_esg_exports, {
    default: () => import_esg_default
  });

  // tools/importer/parsers/hero-esg.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(
      'img.cmp-container__bg-image, img[class*="bg-image"], picture, img'
    );
    const card = element.nextElementSibling;
    const heading = card ? card.querySelector(".cmp-title__text, h1, h2") : null;
    const paragraphs = card ? Array.from(card.querySelectorAll(".cmp-text p, .cmp-text")).filter((p) => p.textContent.trim()) : [];
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    paragraphs.forEach((p) => contentCell.push(p));
    if (contentCell.length) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-patient", cells });
    element.replaceWith(block);
    if (card) card.remove();
  }

  // tools/importer/parsers/columns-pillars.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(".grid-row__col-with-4.grid-cell, .grid-cell");
    const rowCells = [];
    columns.forEach((col) => {
      const image = col.querySelector(".cmp-image__image, .cmp-image img, img");
      const caption = col.querySelector(".cmp-text p, .cmp-text, .text p");
      const cellContent = [];
      if (image) cellContent.push(image);
      if (caption) cellContent.push(caption);
      if (cellContent.length) rowCells.push(cellContent);
    });
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-pillars", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse3(element, { document }) {
    const image = element.querySelector(".grid-row__col-with-5 .cmp-image__image, .grid-cell:first-child img");
    const contentCol = element.querySelector(".grid-row__col-with-6, .grid-cell:last-child");
    const pretitle = contentCol ? contentCol.querySelector(".cmp-header__text, .cmp-header span") : null;
    const heading = contentCol ? contentCol.querySelector(".cmp-title__text, h3, h2, h4") : null;
    const ctaLink = contentCol ? contentCol.querySelector(".cmp-button, a.cmp-button, .button a") : null;
    const col1Content = [];
    if (image) {
      col1Content.push(image);
    }
    const col2Content = [];
    if (pretitle) {
      col2Content.push(pretitle);
    }
    if (heading) {
      col2Content.push(heading);
    }
    if (ctaLink) {
      col2Content.push(ctaLink);
    }
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-driver.js
  function parse4(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".grid-row__col-with-4.grid-cell, .grid-cell");
    cards.forEach((card) => {
      const image = card.querySelector(".cmp-image__image, .cmp-image img, img");
      const eyebrow = card.querySelector(".cmp-header__text, .cmp-header span");
      const description = card.querySelector(".cmp-text p, .cmp-text-xx-large p, .text p");
      const ctaLink = card.querySelector("a.cmp-button, .button a, .internal-cta a");
      if (!image && !eyebrow && !description) return;
      const imageCell = image ? [image] : [];
      const bodyCell = [];
      if (eyebrow) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = eyebrow.textContent.trim();
        p.append(strong);
        bodyCell.push(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        bodyCell.push(p);
      }
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href") || "";
        const txt = ctaLink.querySelector(".cmp-button__text, span");
        a.textContent = txt ? txt.textContent.trim() : ctaLink.textContent.trim();
        bodyCell.push(a);
      }
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-driver", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--header"]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--footer"]);
      WebImporter.DOMUtils.remove(element, [".back-to-top"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      const trackingImgs = element.querySelectorAll('img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"], img[src*="doubleclick.net"]');
      trackingImgs.forEach((img) => img.remove());
      element.removeAttribute("data-cmp-data-layer-enabled");
    }
  }

  // tools/importer/transformers/abbvie-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorValue = section.selector;
        let sectionEl = null;
        if (Array.isArray(selectorValue)) {
          for (const sel of selectorValue) {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          }
        } else if (typeof selectorValue === "string") {
          sectionEl = element.querySelector(selectorValue);
        }
        if (!sectionEl) continue;
        let insertTarget = sectionEl;
        while (insertTarget.parentElement && insertTarget.parentElement !== element) {
          if (insertTarget.parentElement.id === "maincontent") break;
          if (insertTarget.parentElement.classList.contains("aem-Grid") && insertTarget.parentElement.parentElement && insertTarget.parentElement.parentElement.id === "maincontent") break;
          insertTarget = insertTarget.parentElement;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (insertTarget.nextSibling) {
            insertTarget.parentElement.insertBefore(sectionMetadata, insertTarget.nextSibling);
          } else {
            insertTarget.parentElement.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          insertTarget.parentElement.insertBefore(hr, insertTarget);
        }
      }
    }
  }

  // tools/importer/import-esg.js
  var parsers = {
    "hero-patient": parse,
    "columns-pillars": parse2,
    "columns-feature": parse3,
    "cards-driver": parse4
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "esg",
    description: "AbbVie ESG (Environmental, Social & Governance) page with overlapping-card hero, three foundational pillars, ESG Action Report feature, material drivers card grid, and a transparency feature CTA",
    urls: ["https://www.abbvie.com/sustainability/environmental-social-and-governance.html"],
    blocks: [
      { name: "hero-patient", instances: [".container.large-radius.cmp-container-full-width.height-default.no-bottom-margin"] },
      { name: "columns-pillars", instances: [".teaser-h2 + .grid.cmp-grid-custom"] },
      { name: "columns-feature", instances: ["#container-e8488fa96e", "#container-0b6ce35200"] },
      { name: "cards-driver", instances: [".container.cmp-container-xx-large.height-short + .grid.cmp-grid-custom"] }
    ],
    sections: []
  };
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
  var import_esg_default = {
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
      let path = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!path) path = "/index";
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
  return __toCommonJS(import_esg_exports);
})();
