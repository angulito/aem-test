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

  // tools/importer/import-patients.js
  var import_patients_exports = {};
  __export(import_patients_exports, {
    default: () => import_patients_default
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

  // tools/importer/parsers/video-featured.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/embed-video.js
  function parse3(element, { document }) {
    const posterImg = element.querySelector('.cmp-video__image img, .cmp-image__image, img[alt*="video"], img[alt*="thumbnail"]');
    const iframe = element.querySelector('iframe.youtube-video, iframe[src*="youtube.com/embed"], iframe[src*="youtu.be"]');
    let videoUrl = "";
    if (iframe) {
      const iframeSrc = iframe.getAttribute("src") || "";
      const embedMatch = iframeSrc.match(/youtube\.com\/embed\/([^?&]+)/);
      if (embedMatch) {
        videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
      } else {
        videoUrl = iframeSrc.split("?")[0];
      }
    }
    const cells = [];
    if (posterImg) {
      cells.push([posterImg]);
    }
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      cells.push([link]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse4(element, { document }) {
    const textCol = element.querySelector(
      ".grid-row__col-with-7, .grid-cell:first-child"
    );
    const ctaCol = element.querySelector(
      ".grid-row__col-with-3, .grid-cell:last-child"
    );
    const heading = textCol ? textCol.querySelector(".cmp-title__text, h1, h2, h3, h4, h5") : element.querySelector(".cmp-title__text, h1, h2, h3, h4, h5");
    const paragraph = textCol ? textCol.querySelector(".cmp-text p, p") : element.querySelector(".cmp-text p, p");
    const ctaLink = ctaCol ? ctaCol.querySelector("a.cmp-button, .button a, a") : element.querySelector("a.cmp-button, .button a");
    const leftContent = [];
    if (heading) {
      leftContent.push(heading);
    }
    if (paragraph) {
      leftContent.push(paragraph);
    }
    const rightContent = [];
    if (ctaLink) {
      rightContent.push(ctaLink);
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-dashboard.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/columns-patient.js
  function parse6(element, { document }) {
    const headingColumn = [];
    const eyebrowSpan = element.querySelector(".cmp-header .cmp-header__text");
    const headingEl = element.querySelector(".cmp-title .cmp-title__text");
    if (eyebrowSpan) {
      const eyebrowText = (eyebrowSpan.textContent || "").trim();
      if (eyebrowText) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = eyebrowText;
        p.append(strong);
        headingColumn.push(p);
      }
    }
    if (headingEl) headingColumn.push(headingEl);
    const featureImages = Array.from(
      element.querySelectorAll(".cmp-image .cmp-image__image, .cmp-image img")
    );
    const featureCells = [];
    const seenCells = /* @__PURE__ */ new Set();
    featureImages.forEach((img) => {
      var _a;
      const cell = img.closest(".grid-cell") || ((_a = img.closest(".image")) == null ? void 0 : _a.parentElement);
      if (!cell || seenCells.has(cell)) return;
      seenCells.add(cell);
      const itemContent = [];
      const picture = img.closest("picture");
      itemContent.push(picture || img);
      const itemHeaderSpan = cell.querySelector(".cmp-header .cmp-header__text");
      if (itemHeaderSpan) {
        const headerText = (itemHeaderSpan.textContent || "").trim();
        if (headerText) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = headerText;
          p.append(strong);
          itemContent.push(p);
        }
      }
      const paragraphs = Array.from(cell.querySelectorAll(".cmp-text p, p.cmp-text, .text p"));
      paragraphs.forEach((p) => {
        if (cell.contains(p)) itemContent.push(p);
      });
      const cta = cell.querySelector('a.cmp-button, .button a, a[class*="button"]');
      if (cta) {
        const ctaText = (cta.textContent || "").trim();
        if (ctaText) cta.textContent = ctaText;
        itemContent.push(cta);
      }
      featureCells.push(itemContent);
    });
    const row = [];
    if (headingColumn.length) row.push(headingColumn);
    featureCells.forEach((c) => row.push(c));
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-patient", cells });
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

  // tools/importer/import-patients.js
  var parsers = {
    "hero-patient": parse,
    "video-featured": parse2,
    "embed-video": parse3,
    "columns-banner": parse4,
    "cards-dashboard": parse5,
    "columns-patient": parse6
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "patients",
    description: "AbbVie patients page with hero, patient story videos, CTA banner, R&D card grid, and patient health feature columns",
    urls: ["https://www.abbvie.com/patients.html"],
    blocks: [
      {
        name: "hero-patient",
        instances: [".container.large-radius.cmp-container-full-width.height-default"]
      },
      {
        name: "video-featured",
        instances: [".video.cmp-video-full-width:first-of-type"]
      },
      {
        name: "embed-video",
        instances: [".grid.no-bottom-margin"]
      },
      {
        name: "columns-banner",
        instances: [".grid.cmp-grid-custom.no-bottom-margin"]
      },
      {
        name: "cards-dashboard",
        instances: [".grid.cmp-grid-full-page-4"]
      },
      {
        name: "columns-patient",
        instances: [".grid.aem-GridColumn.aem-GridColumn--default--12"]
      }
    ],
    sections: [
      {
        id: "section-3",
        name: "CTA Banner",
        selector: ".container.medium-radius.cmp-container-xxx-large.height-short",
        style: "dark",
        blocks: ["columns-banner"],
        defaultContent: []
      }
    ]
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
  var import_patients_default = {
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
  return __toCommonJS(import_patients_exports);
})();
