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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1.h1-heading, h1, h2.h2-heading, h2, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const coverImages = Array.from(element.querySelectorAll('img.cover-image, img[class*="cover"]'));
    const cells = [];
    if (coverImages.length) {
      cells.push([coverImages]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (ctaLinks.length) contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const grid = element.querySelector(".grid-layout") || element;
    const columns = Array.from(grid.querySelectorAll(":scope > div"));
    const image = element.querySelector("img.utility-aspect-3x2, .cover-image, img");
    const heading = element.querySelector('h2, h1, [class*="h2-heading"], [class*="heading"]');
    let textColumn = null;
    if (heading) {
      textColumn = columns.find((col) => col.contains(heading)) || null;
    }
    const rightCell = [];
    if (heading) rightCell.push(heading);
    if (textColumn) {
      Array.from(textColumn.children).forEach((child) => {
        if (child === heading) return;
        if (child.classList && child.classList.contains("breadcrumbs")) return;
        if (child.querySelector && child.querySelector(".breadcrumbs") === child) return;
        if (child.matches && child.matches(".breadcrumbs")) return;
        rightCell.push(child);
      });
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const grid = element.querySelector(".grid-layout:has(.utility-aspect-1x1)") || element.querySelector(".grid-layout");
    let cardWrappers = Array.from((grid || element).querySelectorAll(":scope > .utility-aspect-1x1"));
    let imageNodes = cardWrappers.map((wrap) => wrap.querySelector("img")).filter(Boolean);
    if (imageNodes.length === 0) {
      imageNodes = Array.from((grid || element).querySelectorAll(".utility-aspect-1x1 img, img.cover-image"));
    }
    const cells = [];
    imageNodes.forEach((img) => {
      cells.push([img]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const menu = element.querySelector('.tab-menu, [class*="tab-menu"]');
    const labelButtons = menu ? Array.from(menu.querySelectorAll(":scope > button, :scope > .tab-menu-link, button.tab-menu-link")) : Array.from(element.querySelectorAll("button.tab-menu-link"));
    const content = element.querySelector('.tabs-content, [class*="tabs-content"]');
    const panes = content ? Array.from(content.querySelectorAll(':scope > .tab-pane, :scope > [class*="tab-pane"]')) : Array.from(element.querySelectorAll('.tab-pane, [class*="tab-pane"]'));
    const cells = [];
    const count = Math.max(labelButtons.length, panes.length);
    for (let i = 0; i < count; i += 1) {
      const button = labelButtons[i];
      const pane = panes[i];
      let labelCell;
      if (button) {
        const labelParts = [];
        const avatar = button.querySelector(".avatar img, img");
        if (avatar) labelParts.push(avatar);
        const textWrappers = Array.from(button.querySelectorAll(":scope > div, .flex-horizontal > div")).filter((d) => !d.classList.contains("avatar") && !d.querySelector(".avatar") && !d.querySelector("img"));
        if (textWrappers.length) {
          labelParts.push(textWrappers[0]);
        } else {
          const name = button.querySelector("strong");
          if (name) labelParts.push(name);
        }
        labelCell = labelParts.length ? labelParts : button;
      } else {
        labelCell = `Tab ${i + 1}`;
      }
      let contentCell;
      if (pane) {
        const contentParts = [];
        const portrait = pane.querySelector("img");
        if (portrait) contentParts.push(portrait);
        const nameRole = pane.querySelector(".paragraph-xl strong") ? pane.querySelector(".paragraph-xl strong").closest("div").parentElement : null;
        if (nameRole) contentParts.push(nameRole);
        const quote = pane.querySelector("p");
        if (quote) contentParts.push(quote);
        contentCell = contentParts.length ? contentParts : pane;
      } else {
        contentCell = "";
      }
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse5(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll("a.article-card, a.card-link, .article-card")
    );
    const uniqueCards = [...new Set(cards)];
    const cells = [];
    uniqueCards.forEach((card) => {
      const image = card.querySelector(".article-card-image img, picture, img");
      const meta = card.querySelector(".article-card-meta");
      const title = card.querySelector('h3, .h4-heading, [class*="heading"]');
      const href = card.getAttribute("href");
      let titleNode = title;
      if (title && href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = title.textContent.trim();
        const heading = document.createElement(title.tagName);
        heading.append(link);
        titleNode = heading;
      }
      const bodyCell = [];
      if (meta) bodyCell.push(meta);
      if (titleNode) bodyCell.push(titleNode);
      const imageCell = [];
      if (image) imageCell.push(image);
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(":scope > details.faq-item, :scope details.faq-item");
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const answer = item.querySelector('.faq-answer, div[class*="answer"]');
      let questionEl = summary ? summary.querySelector("span") : null;
      if (!questionEl && summary) {
        questionEl = document.createElement("span");
        questionEl.textContent = summary.textContent.trim();
      }
      const questionText = questionEl ? questionEl.textContent.trim() : "";
      const answerNodes = [];
      if (answer) {
        answer.childNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === "IMG" && node.classList.contains("faq-icon")) return;
            answerNodes.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            answerNodes.push(node.textContent.trim());
          }
        });
      }
      if (questionText || answerNodes.length) {
        cells.push([questionText, answerNodes.length ? answerNodes : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    let bgImage = element.querySelector(
      'img.cover-image.utility-overlay, img.utility-overlay, img.cover-image, img[class*="cover"]'
    ) || element.querySelector("img");
    if (!bgImage) {
      const bgEl = Array.from(element.querySelectorAll("*")).find((el) => {
        const bg = el.style && el.style.backgroundImage;
        return bg && bg !== "none" && /url\(/i.test(bg);
      });
      if (bgEl) {
        const match = bgEl.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/i);
        if (match && match[1]) {
          const img = document.createElement("img");
          img.src = match[1];
          bgImage = img;
        }
      }
    }
    const heading = element.querySelector(
      '.card-body h1, .card-body h2, h1.h1-heading, h1, h2.h1-heading, h2, [class*="heading"]'
    );
    const subheading = element.querySelector(".card-body p.subheading, .subheading, .card-body p, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (ctaLinks.length) contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // <a href="#main-content" class="skip-link">
        ".navbar",
        // global header / mega menu / mobile toggle
        "footer",
        // <footer class="footer inverse-footer">
        ".breadcrumbs"
        // breadcrumb trail (Home > Case studies)
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
        img.remove();
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolveSectionEl = (selector) => {
      if (!selector) return null;
      let el = element.querySelector(selector);
      if (!el) return null;
      while (el.parentElement && el.parentElement !== element) {
        el = el.parentElement;
      }
      return el.parentElement === element ? el : null;
    };
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolveSectionEl(section.selector);
      if (!sectionEl) {
        console.warn("Section selector did not match, skipping:", section.selector);
        continue;
      }
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(block);
      }
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = doc.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Site homepage with hero, featured content sections, and promotional blocks",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["section.section:has(.breadcrumbs)"]
      },
      {
        name: "cards-gallery",
        instances: ["section.section.secondary-section:has(.utility-aspect-1x1)"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-articles",
        instances: ["section.section.secondary-section:has(.article-card)"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.section.inverse-section"]
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
        name: "Featured article teaser",
        selector: "section.section:has(.breadcrumbs)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Photo gallery",
        selector: "section.section.secondary-section:has(.utility-aspect-1x1)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: [
          "section.section.secondary-section:has(.utility-aspect-1x1) .utility-text-align-center h2",
          "section.section.secondary-section:has(.utility-aspect-1x1) .utility-text-align-center p"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "section.section:has(.tabs-wrapper)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest articles",
        selector: "section.section.secondary-section:has(.article-card)",
        style: "secondary",
        blocks: ["cards-articles"],
        defaultContent: [
          "section.section.secondary-section:has(.article-card) .utility-text-align-center h2",
          "section.section.secondary-section:has(.article-card) .utility-text-align-center p"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "section.section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "section.section:has(.faq-list) h2",
          "section.section:has(.faq-list) .subheading"
        ]
      },
      {
        id: "section-7",
        name: "Closing CTA banner",
        selector: "section.section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-articles": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
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
  var import_homepage_default = {
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
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
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
  return __toCommonJS(import_homepage_exports);
})();
