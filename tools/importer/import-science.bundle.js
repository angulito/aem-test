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

  // tools/importer/import-science.js
  var import_science_exports = {};
  __export(import_science_exports, {
    default: () => import_science_default
  });

  // tools/importer/parsers/hero-patient.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(
      'img.cmp-container__bg-image, img[class*="bg-image"], picture, img'
    );
    const heading = element.querySelector(
      ".cmp-title__text, .cmp-title h1, .cmp-title h2, h1, h2"
    );
    const description = element.querySelector(".cmp-text p, .cmp-text, p");
    const ctaLinks = Array.from(
      element.querySelectorAll(".cmp-button, a.cmp-button__link, .cmp-teaser__action-link, a.button")
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-patient", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-dashboard.js
  function parse2(element, { document }) {
    const cells = [];
    const largeCard = element.querySelector(".cardpagestory.card-dashboard, .card-dashboard");
    if (largeCard) {
      const link = largeCard.querySelector("a[href]");
      const image = largeCard.querySelector(".card-image-container img, img.card-image");
      const eyebrow = largeCard.querySelector(".card-eyebrow, span.card-eyebrow");
      const title = largeCard.querySelector("h4.card-title, .card-title");
      const description = largeCard.querySelector("p.card-description, .card-description");
      const cta = largeCard.querySelector(".card-cta, span.card-cta");
      const imageCell = image ? [image] : [];
      const textCell = [];
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textCell.push(eyebrowEl);
      }
      if (title) {
        const headingEl = document.createElement("h4");
        if (link) {
          const linkEl = document.createElement("a");
          linkEl.href = link.getAttribute("href") || "";
          linkEl.textContent = title.textContent.trim();
          headingEl.appendChild(linkEl);
        } else {
          headingEl.textContent = title.textContent.trim();
        }
        textCell.push(headingEl);
      }
      if (description) {
        const descEl = document.createElement("p");
        descEl.textContent = description.textContent.trim();
        textCell.push(descEl);
      }
      if (cta && link) {
        const ctaLink = document.createElement("a");
        ctaLink.href = link.getAttribute("href") || "";
        ctaLink.textContent = cta.textContent.trim();
        textCell.push(ctaLink);
      }
      cells.push([imageCell, textCell]);
    }
    const statCards = element.querySelectorAll(".dashboardcards .cmp-dashboardcard, .cmp-dashboardcard");
    statCards.forEach((statCard) => {
      const eyebrow = statCard.querySelector(".eyebrow, .content-container .eyebrow");
      const dataPoint = statCard.querySelector(".data-point");
      const dataSuffix = statCard.querySelector(".data-point-suffix");
      const description = statCard.querySelector(".description, .content-container .description");
      const textCell = [];
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textCell.push(eyebrowEl);
      }
      if (dataPoint) {
        const statEl = document.createElement("h3");
        let statText = dataPoint.textContent.trim();
        if (dataSuffix) {
          statText += dataSuffix.textContent.trim();
        }
        statEl.textContent = statText;
        textCell.push(statEl);
      }
      if (description) {
        const descEl = document.createElement("p");
        descEl.textContent = description.textContent.trim();
        textCell.push(descEl);
      }
      cells.push([[], textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-dashboard", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-focus.js
  function parse3(element, { document }) {
    const eyebrow = element.querySelector(".cmp-header__text, .cmp-header span, .eyebrow");
    const heading = element.querySelector(".cmp-title__text, h2, h3, h4");
    const paragraph = element.querySelector(".cmp-text p") || element.querySelector(".cmp-text") || element.querySelector("p");
    const lists = Array.from(element.querySelectorAll(".linklist .cmp-list, ul.cmp-list"));
    const textCol = [];
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      textCol.push(p);
    }
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCol.push(h);
    }
    if (paragraph) {
      textCol.push(paragraph);
    }
    const buildListColumn = (sourceList) => {
      const ul = document.createElement("ul");
      sourceList.querySelectorAll(":scope > li").forEach((li) => {
        const link = li.querySelector("a[href]");
        if (!link) return;
        const titleEl = link.querySelector(".cmp-list__item-title");
        const title = (titleEl ? titleEl.textContent : link.textContent).trim();
        if (!title) return;
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = title;
        const item = document.createElement("li");
        item.append(a);
        ul.append(item);
      });
      return ul;
    };
    const columns = [];
    if (textCol.length) {
      columns.push(textCol);
    }
    lists.forEach((list) => {
      const col = buildListColumn(list);
      if (col.children.length) {
        columns.push(col);
      }
    });
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-focus", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-featured.js
  function parse4(element, { document }) {
    const posterImage = element.querySelector(".cmp-video__image img.cmp-image__image, .cmp-video__image img");
    const textContent = element.querySelector(".cmp-video__text-content > div");
    const descriptionText = textContent ? textContent.childNodes[0] : null;
    const playButton = element.querySelector(".cmp-video__text-content button");
    const outsideText = element.querySelector(".cmp-video__text-content-outside h5");
    const videoTitle = element.querySelector(".vjs-dock-title");
    const vjsPoster = element.querySelector(".vjs-poster img");
    const cells = [];
    if (posterImage) {
      cells.push([posterImage]);
    } else if (vjsPoster) {
      cells.push([vjsPoster]);
    }
    const contentCell = [];
    if (textContent) {
      const descP = document.createElement("p");
      descP.textContent = textContent.textContent.trim().replace(/\s*Watch\s+\d+:\d+\s*/, "");
      contentCell.push(descP);
    } else if (outsideText) {
      contentCell.push(outsideText);
    }
    if (playButton) {
      const buttonP = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = playButton.textContent.trim();
      buttonP.appendChild(strong);
      contentCell.push(buttonP);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/columns-quote.js
  function parse6(element, { document }) {
    const quote = element.querySelector(".cmp-quote, .quote");
    const blockGrid = quote ? quote.closest(".grid") || element : element;
    const videoCol = [];
    const posterImg = blockGrid.querySelector(".cmp-video__image img, .cmp-video__image picture, .video img, .video picture");
    if (posterImg) videoCol.push(posterImg);
    const watchLink = blockGrid.querySelector(".cmp-video a[href], .video a[href]");
    if (watchLink) {
      videoCol.push(watchLink);
    } else {
      const watchBtn = blockGrid.querySelector(".cmp-video__text-content button, .cmp-video__text-content, .video button");
      if (watchBtn) {
        const label = watchBtn.textContent.trim();
        if (label) {
          const p = document.createElement("p");
          p.textContent = label;
          videoCol.push(p);
        }
      }
    }
    const quoteCol = [];
    if (quote) {
      const quoteText = quote.querySelector(".cmp-quote__text, blockquote, p");
      if (quoteText) quoteCol.push(quoteText);
      const authorBlock = quote.querySelector(".cmp-quote__author-block");
      if (authorBlock) {
        quoteCol.push(authorBlock);
      } else {
        const authorName = quote.querySelector(".author-name");
        const authorTitle = quote.querySelector(".author-title");
        if (authorName) quoteCol.push(authorName);
        if (authorTitle) quoteCol.push(authorTitle);
      }
    }
    const cells = [
      [videoCol, quoteCol]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse7(element, { document }) {
    const cells = [];
    const cardCells = element.querySelectorAll(".grid-row__col-with-4.grid-cell, .grid-cell");
    cardCells.forEach((card) => {
      const image = card.querySelector(".cmp-image__image, .cmp-image img, img");
      const description = card.querySelector(".cmp-text p, .cmp-text-xx-large p, .text p");
      const ctaLink = card.querySelector("a.cmp-button, .button a, .internal-cta a");
      const imageCell = image ? [image] : [];
      const textCell = [];
      if (description) {
        const descEl = document.createElement("p");
        descEl.textContent = description.textContent.trim();
        textCell.push(descEl);
      }
      if (ctaLink) {
        const linkEl = document.createElement("a");
        linkEl.href = ctaLink.getAttribute("href") || "";
        const buttonText = ctaLink.querySelector(".cmp-button__text, span");
        linkEl.textContent = buttonText ? buttonText.textContent.trim() : ctaLink.textContent.trim();
        textCell.push(linkEl);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse8(element, { document }) {
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

  // tools/importer/import-science.js
  var parsers = {
    "hero-patient": parse,
    "cards-dashboard": parse2,
    "columns-focus": parse3,
    "video-featured": parse4,
    "columns-feature": parse5,
    "columns-quote": parse6,
    "cards-feature": parse7,
    "accordion-faq": parse8
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "science",
    description: "AbbVie science (Our R&D Approach) page with hero, R&D stats, focus areas, featured video, explore columns, video+quote, story cards, FAQ accordion, and closing CTA",
    urls: ["https://www.abbvie.com/science.html"],
    blocks: [
      { name: "hero-patient", instances: [".container.cmp-container-x-large.align-center"] },
      { name: "cards-dashboard", instances: [".dashboardcards.size-medium-vertical"] },
      { name: "columns-focus", instances: [".grid.cmp-grid-meganav"] },
      { name: "video-featured", instances: [".video.video-default.cmp-video-full-width"] },
      { name: "columns-feature", instances: [".container.cmp-container-full-width.height-default"] },
      { name: "columns-quote", instances: [".container.default-radius.cmp-container-xxx-large"] },
      { name: "cards-feature", instances: [".grid.cmp-grid-full-page-4"] },
      { name: "accordion-faq", instances: [".accordion.panelcontainer.cmp-accordion-large"] }
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
  var import_science_default = {
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
  return __toCommonJS(import_science_exports);
})();
