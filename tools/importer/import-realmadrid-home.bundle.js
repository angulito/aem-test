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

  // tools/importer/import-realmadrid-home.js
  var import_realmadrid_home_exports = {};
  __export(import_realmadrid_home_exports, {
    default: () => import_realmadrid_home_default
  });

  // tools/importer/parsers/cards-articles.js
  function parse(element, { document }) {
    let items = Array.from(
      element.querySelectorAll(
        "app-news-item, a.merchandising__card, li.rm-palmares__item, button.stadium-cameras__position"
      )
    );
    if (!items.length) {
      items = Array.from(
        element.querySelectorAll('a.rm-news-item__link, [class*="__card"], [class*="__item"]')
      );
    }
    items = [...new Set(items)];
    const sharedImage = element.querySelector(
      "picture.stadium-cameras__figure img, .stadium-cameras__figure img"
    );
    const cells = [];
    items.forEach((item) => {
      const imgs = Array.from(item.querySelectorAll("img"));
      let image = imgs.find((img) => {
        const src = img.getAttribute("src") || "";
        return src && !src.startsWith("data:");
      }) || imgs[0] || null;
      if (!image && sharedImage) image = sharedImage.cloneNode(true);
      const headingSrc = item.querySelector(
        'h2, h3, h4, .card__title, .rm-news-item__excerpt, .stadium-cameras__site, .rm-palmares__name, .rm-bar__title, [class*="__name"], [class*="__title"], [class*="__excerpt"], [class*="__site"]'
      );
      let linkEl = null;
      let href = null;
      if (item.tagName === "A" && item.getAttribute("href")) {
        linkEl = item;
        href = item.getAttribute("href");
      } else {
        const innerLink = item.querySelector("a[href]");
        if (innerLink) {
          linkEl = innerLink;
          href = innerLink.getAttribute("href");
        }
      }
      const buttonLabel = item.querySelector(".rm-button__content");
      const headingText = headingSrc ? headingSrc.textContent.trim() : "";
      const ctaText = buttonLabel ? buttonLabel.textContent.trim() : "";
      if (!image && !headingText && !ctaText) return;
      const contentCell = [];
      if (headingText) {
        const h = document.createElement("h3");
        h.textContent = headingText;
        contentCell.push(h);
      }
      if (href) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = ctaText || headingText || linkEl && linkEl.textContent.trim() || "Ver m\xE1s";
        contentCell.push(a);
      } else if (ctaText) {
        const p = document.createElement("p");
        p.textContent = ctaText;
        contentCell.push(p);
      }
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse2(element, { document }) {
    const card = element.querySelector("a.merchandising__card, .merchandising__card") || element;
    const image = element.querySelector(
      ".card__media img, img.media, .merchandising__card img, img"
    );
    const sectionTitle = element.querySelector(
      "header .rm-web-module__title, .rm-web-module__title, header h2"
    );
    const cardTitle = element.querySelector(".card__title, h4, h3");
    const ctaButtonLabel = element.querySelector(".rm-button__content");
    const href = card && card.getAttribute && card.getAttribute("href") || element.querySelector("a[href]") && element.querySelector("a[href]").getAttribute("href");
    const cells = [];
    if (image) cells.push([image]);
    const contentCell = [];
    if (sectionTitle && sectionTitle.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = sectionTitle.textContent.trim();
      contentCell.push(h2);
    }
    if (cardTitle && cardTitle.textContent.trim()) {
      const h3 = document.createElement("h3");
      h3.textContent = cardTitle.textContent.trim();
      contentCell.push(h3);
    }
    if (href) {
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = ctaButtonLabel && ctaButtonLabel.textContent.trim() || cardTitle && cardTitle.textContent.trim() || "M\xE1s informaci\xF3n";
      contentCell.push(a);
    } else if (ctaButtonLabel && ctaButtonLabel.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = ctaButtonLabel.textContent.trim();
      contentCell.push(p);
    }
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news.js
  function parse3(element, { document }) {
    let slides = Array.from(element.querySelectorAll("app-news-item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll("a.rm-news-item__link, .carousel-news__item"));
    }
    slides = [...new Set(slides)];
    const cells = [];
    slides.forEach((slide) => {
      const imgs = Array.from(slide.querySelectorAll("img"));
      const image = imgs.find((img) => {
        const src = img.getAttribute("src") || "";
        return src && !src.startsWith("data:");
      }) || imgs[0] || null;
      const excerpt = slide.querySelector(
        '.rm-news-item__excerpt, figcaption p, h2, h3, [class*="__excerpt"], [class*="__title"]'
      );
      const headingText = excerpt ? excerpt.textContent.trim() : "";
      let href = null;
      if (slide.tagName === "A" && slide.getAttribute("href")) {
        href = slide.getAttribute("href");
      } else {
        const innerLink = slide.querySelector("a[href]");
        if (innerLink) href = innerLink.getAttribute("href");
      }
      if (!image && !headingText) return;
      const contentCell = [];
      if (headingText) {
        const h = document.createElement("h3");
        h.textContent = headingText;
        contentCell.push(h);
      }
      if (href) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = headingText || "Ver m\xE1s";
        contentCell.push(a);
      }
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-app.js
  function parse4(element, { document }) {
    const root = element.matches && element.matches(".rm-stores") ? element : element.querySelector("section.rm-stores, .rm-stores") || element;
    const kicker = root.querySelector(".rm-stores__title, p.rm-stores__title");
    const heading = root.querySelector(".rm-stores__subtitle, h2.rm-stores__subtitle, h2");
    const storeLinks = Array.from(
      root.querySelectorAll(".rm-stores__list a.rm-stores__link, .rm-stores__item a[href], ul a[href] img")
    ).map((el) => el.tagName === "IMG" ? el.closest("a") || el : el).filter(Boolean);
    const uniqueLinks = [...new Set(storeLinks)].filter((a) => a.tagName === "A");
    const textCell = [];
    if (heading && heading.textContent.trim()) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    if (kicker && kicker.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = kicker.textContent.trim();
      textCell.push(p);
    }
    const linksCell = [];
    uniqueLinks.forEach((a) => linksCell.push(a));
    if (!textCell.length && !linksCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      textCell.length ? textCell : "",
      linksCell.length ? linksCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/realmadrid-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        // OneTrust cookie-consent SDK container
        ".onetrust-pc-dark-filter",
        // OneTrust modal dark-filter overlay
        "app-ads",
        // Google ad / sponsored-content containers (x4)
        "app-header",
        // global navigation chrome            (line 17)
        "app-footer-social",
        // footer social / legal links         (line 2581)
        "app-footer-banners",
        // empty footer banner container       (line 2254)
        "section.rm-sponsors"
        // sponsor/partner logo strip          (line 2382)
      ]);
      element.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
        if (h.textContent.trim() === "Comunidad Madridista") {
          h.textContent = "Comunidad Madridista test2";
        }
      });
    }
  }

  // tools/importer/transformers/realmadrid-sections.js
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

  // tools/importer/transformers/realmadrid-dm-images.js
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
  function transform3(hookName, element, payload) {
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

  // tools/importer/import-realmadrid-home.js
  var parsers = {
    "cards-articles": parse,
    "hero-banner": parse2,
    "carousel-news": parse3,
    "columns-app": parse4
  };
  var PAGE_TEMPLATE = {
    name: "realmadrid-home",
    description: "Real Madrid homepage (Angular SPA). Modular content: news hero banners, merchandising carousel, trophies/palmares grid, stadium cameras, and footer with sponsors. Spanish locale (/es-ES). Ad-heavy.",
    urls: [
      "https://www.realmadrid.com/es-ES"
    ],
    blocks: [
      {
        name: "cards-articles",
        instances: [
          "app-news-herobanner:has(main.rm-web-module__main--notitle)",
          "app-merchandising:has(.rm-web-module__subtitle)",
          "app-palmares:nth-of-type(1)",
          "app-stadium-camera:nth-of-type(1)"
        ]
      },
      {
        name: "hero-banner",
        instances: ["app-merchandising:has(.card__bg)"]
      },
      {
        name: "carousel-news",
        instances: ["app-news-herobanner:has(header .rm-web-module__title)"]
      },
      {
        name: "columns-app",
        instances: [
          "app-footer-sponsors section.rm-stores",
          "section.rm-stores"
        ]
      },
      {
        name: "section-palmares",
        instances: ["app-palmares:nth-of-type(1)"],
        section: "dark"
      }
    ],
    sections: [
      { id: "section-1", name: "Featured news hero", selector: "app-news-herobanner:nth-of-type(1)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-2", name: "News grid 4-up", selector: "app-news-herobanner:nth-of-type(2)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-3", name: "News grid 3-up (official)", selector: "app-news-herobanner:nth-of-type(3)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-4", name: "News grid 3-up (sponsors)", selector: "app-news-herobanner:nth-of-type(4)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-5", name: "News grid 4-up", selector: "app-news-herobanner:nth-of-type(5)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-6", name: "Comunidad Madridista promo", selector: "app-merchandising:nth-of-type(1)", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-7", name: "Noticias Madridistas carousel", selector: "app-news-herobanner:nth-of-type(6)", style: null, blocks: ["carousel-news"], defaultContent: ["app-news-herobanner:nth-of-type(6) header h2"] },
      { id: "section-8", name: "Tienda Oficial products", selector: "app-merchandising:nth-of-type(2)", style: null, blocks: ["cards-articles"], defaultContent: ["app-merchandising:nth-of-type(2) header h2", "app-merchandising:nth-of-type(2) header h3"] },
      { id: "section-9", name: "Palmares trophies", selector: "app-palmares:nth-of-type(1)", style: "dark", blocks: ["cards-articles"], defaultContent: ["app-palmares:nth-of-type(1) header h2", "app-palmares:nth-of-type(1) header a"] },
      { id: "section-10", name: "Stadium cameras", selector: "app-stadium-camera:nth-of-type(1)", style: null, blocks: ["cards-articles"], defaultContent: [] },
      { id: "section-11", name: "Especiales carousel", selector: "app-news-herobanner:nth-of-type(7)", style: null, blocks: ["carousel-news"], defaultContent: ["app-news-herobanner:nth-of-type(7) header h2"] },
      { id: "section-12", name: "Real Madrid App promo", selector: "app-footer-sponsors:nth-of-type(1)", style: null, blocks: ["columns-app"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
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
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document.querySelectorAll(selector);
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
          return;
        }
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (pageBlocks.some((b) => b.element === element)) return;
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
  var import_realmadrid_home_default = {
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
      const path = "/realmadrid-home";
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
  return __toCommonJS(import_realmadrid_home_exports);
})();
