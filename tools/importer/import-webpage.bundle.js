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

  // tools/importer/import-webpage.js
  var import_webpage_exports = {};
  __export(import_webpage_exports, {
    default: () => import_webpage_default
  });

  // tools/importer/parsers/hero-cover.js
  function imageFromBackground(document2, el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (!m) return null;
    const img = document2.createElement("img");
    img.src = m[1];
    const alt = el.getAttribute("data-alt");
    if (alt) img.alt = alt;
    return img;
  }
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".section-background-image img") || element.querySelector(".section-background img") || imageFromBackground(document2, element.querySelector(".section-background-image"));
    const heading = element.querySelector(".title-header h1, h1.title") || element.querySelector("h1, h2");
    const subtitles = [...element.querySelectorAll(".title-header p.subtitle, .title-header-view > p")].filter((p, i, arr) => arr.indexOf(p) === i && p.textContent.trim());
    const ctas = [...element.querySelectorAll(".title-header a[href]")];
    if (!heading && !bgImage && !subtitles.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) {
      if (heading.tagName !== "H1") {
        const h1 = document2.createElement("h1");
        h1.innerHTML = heading.innerHTML;
        contentCell.push(h1);
      } else {
        contentCell.push(heading);
      }
    }
    subtitles.forEach((p) => {
      const para = document2.createElement("p");
      para.innerHTML = p.innerHTML;
      contentCell.push(para);
    });
    ctas.forEach((a) => {
      if (!contentCell.some((el) => el.contains && el.contains(a))) {
        const p = document2.createElement("p");
        p.append(a);
        contentCell.push(p);
      }
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-cover", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-split.js
  function imageFromBackground2(document2, el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (!m) return null;
    const img = document2.createElement("img");
    img.src = m[1];
    const alt = el.getAttribute("data-alt");
    if (alt) img.alt = alt;
    return img;
  }
  function parse2(element, { document: document2 }) {
    const bgWrap = element.querySelector(".section-background-image");
    const image = bgWrap && bgWrap.querySelector("img") || element.querySelector(".section-background img") || imageFromBackground2(document2, bgWrap);
    const container = element.querySelector(".section-content .content-container") || element.querySelector(".section-content-view") || element.querySelector(".section-content");
    const textCell = [];
    if (container) {
      [...container.children].forEach((child) => {
        if (child.matches("button, .page-heading-anchor, .anchor-tooltip")) return;
        if (!child.textContent.trim() && !child.querySelector("img, picture, a[href]")) return;
        textCell.push(child);
      });
    }
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageOnRight = element.classList.contains("image-on-right");
    const imageCell = image ? [image] : "";
    const row = imageOnRight ? [textCell, imageCell] : [imageCell, textCell];
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-flipbook.js
  function imageFromBackground3(document2, el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (!m) return null;
    const img = document2.createElement("img");
    img.src = m[1];
    const alt = el.getAttribute("data-alt");
    if (alt) img.alt = alt;
    return img;
  }
  function getImage(document2, wrap) {
    if (!wrap) return null;
    return wrap.querySelector("img") || imageFromBackground3(document2, wrap);
  }
  function getTextContent(view) {
    if (!view) return [];
    const container = view.querySelector(".content-container") || view;
    return [...container.children].filter((child) => {
      if (child.matches("button, .page-heading-anchor, .anchor-tooltip")) return false;
      return child.textContent.trim() || child.querySelector("img, picture, a[href]");
    });
  }
  function parse3(element, { document: document2 }) {
    let bgWraps = [...element.querySelectorAll(":scope .section-background > .section-background-image")];
    if (!bgWraps.length) bgWraps = [...element.querySelectorAll(".section-background-image")];
    let views = [...element.querySelectorAll(":scope .section-content > .section-content-view")];
    if (!views.length) views = [...element.querySelectorAll(".section-content-view")];
    const count = Math.max(bgWraps.length, views.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const image = getImage(document2, bgWraps[i]);
      const text = getTextContent(views[i]);
      if (!image && !text.length) continue;
      cells.push([image ? [image] : "", text.length ? text : ""]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-flipbook", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-mosaic.js
  function imageForTile(document2, tile) {
    const existing = tile.querySelector("img");
    if (existing) return existing;
    const a = tile.querySelector("a.photo-image") || tile.querySelector("a[href]");
    let src = null;
    if (a) {
      const href = a.getAttribute("href");
      if (href && href !== "#") src = href;
      if (!src) {
        const style = a.getAttribute("style") || "";
        const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
        if (m) src = m[1];
      }
      if (!src && a.getAttribute("data-src")) src = a.getAttribute("data-src");
    }
    if (!src) return null;
    const img = document2.createElement("img");
    img.src = src;
    const alt = a && (a.getAttribute("data-alt") || "");
    if (alt) img.alt = alt;
    return img;
  }
  function parse4(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(".photo-grid .photo-container")];
    if (!tiles.length) tiles = [...element.querySelectorAll(".photo-container, .tile")];
    const cells = [];
    tiles.forEach((tile) => {
      const image = imageForTile(document2, tile);
      const caption = tile.querySelector(".caption, figcaption");
      const captionText = caption && caption.textContent.trim();
      if (!image && !captionText) return;
      let textCell = "";
      if (captionText) {
        const p = document2.createElement("p");
        p.textContent = captionText;
        textCell = p;
      }
      cells.push([image || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-mosaic", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/express-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function getBackgroundUrl(el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const match = style.match(/background(?:-image)?\s*:[^;]*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    return match ? match[1] : null;
  }
  function createImg(doc, src, alt) {
    const img = doc.createElement("img");
    img.setAttribute("src", src);
    if (alt) img.setAttribute("alt", alt);
    return img;
  }
  function transform(hookName, element, payload) {
    const doc = element.ownerDocument || document;
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#luca-splash",
        ".report-abuse-dialog",
        ".banner.js-report-success",
        ".banner.js-report-error",
        ".toast-container",
        "#copy-link-to-section",
        "#published-webpages-growth-link",
        ".embedded-link-viewer",
        ".wp-collection-browser",
        "#analytics-iframe",
        "#view-static-version-link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".section.spacer-section",
        ".section.bumper-section",
        ".back-to-top-button",
        ".wp-scrollbar",
        ".wp-swipe-panel-group-next-link",
        ".wp-swipe-panel-group-previous-link",
        ".publication-viewer-next-link",
        ".publication-viewer-previous-link",
        ".page-heading-anchor",
        ".navigation-hint",
        ".gradient-overlay"
      ]);
      element.querySelectorAll(".article > .section.hidden").forEach((section) => {
        section.classList.remove("hidden");
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const lazySrc = img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
        if (lazySrc && (!src || src.startsWith("data:") || src === "#")) {
          img.setAttribute("src", lazySrc);
        }
        const lazySrcset = img.getAttribute("data-srcset");
        if (lazySrcset && !img.getAttribute("srcset")) img.setAttribute("srcset", lazySrcset);
      });
      element.querySelectorAll(".section-background-image").forEach((bg) => {
        if (bg.querySelector("img")) return;
        const url = getBackgroundUrl(bg);
        if (url) bg.append(createImg(doc, url));
      });
      element.querySelectorAll(".photo-grid a.photo-image").forEach((a) => {
        if (a.querySelector("img")) return;
        const url = a.getAttribute("href") || getBackgroundUrl(a);
        if (url && url !== "#") a.append(createImg(doc, url));
      });
      element.querySelectorAll("a.image-viewer-link").forEach((a) => {
        const img = a.querySelector("img");
        if (img) a.replaceWith(img);
      });
      element.querySelectorAll(".image > .caption").forEach((caption) => {
        const p = doc.createElement("p");
        const em = doc.createElement("em");
        em.textContent = caption.textContent.trim();
        p.append(em);
        caption.replaceWith(p);
      });
      element.querySelectorAll("h1 > span:only-child, h2 > span:only-child, h3 > span:only-child, h4 > span:only-child, p.subtitle > span:only-child").forEach((span) => {
        span.replaceWith(...span.childNodes);
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "button",
        "form"
      ]);
    }
  }

  // tools/importer/transformers/express-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
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

  // tools/importer/import-webpage.js
  var parsers = {
    "hero-cover": parse,
    "columns-split": parse2,
    "carousel-flipbook": parse3,
    "cards-mosaic": parse4
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_webpage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
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
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
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
  return __toCommonJS(import_webpage_exports);
})();
