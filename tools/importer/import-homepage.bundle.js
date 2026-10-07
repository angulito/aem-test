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

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-home-hero__primary, .cmp-home-hero__alternative");
    const cells = [];
    slides.forEach((slide) => {
      const bgImage = slide.querySelector("img.cmp-container__bg-image");
      const heading = slide.querySelector("h1.cmp-title__text, .cmp-title__text");
      const ctaLink = slide.querySelector(".cmp-text a, .anchor-link a");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);
      if (bgImage && contentCell.length > 0) {
        cells.push([bgImage, contentCell]);
      } else if (contentCell.length > 0) {
        cells.push([contentCell]);
      } else if (bgImage) {
        cells.push([bgImage]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-homepage.js
  function parse2(element, { document }) {
    const gridRow = element.querySelector(":scope .grid-container > .grid-row");
    const columns = gridRow ? gridRow.querySelectorAll(":scope > .grid-cell") : [];
    const col1Cell = [];
    const col1 = element.querySelector(":scope .grid-row > .grid-row__col-with-4");
    if (col1) {
      const col1Header = col1.querySelector(".cmp-header__text");
      if (col1Header) {
        const h3 = document.createElement("h3");
        h3.textContent = col1Header.textContent.trim();
        col1Cell.push(h3);
      }
      const rssLinks = col1.querySelectorAll(".carousel-rss__link");
      if (rssLinks.length > 0) {
        const list = document.createElement("ul");
        rssLinks.forEach((link) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href");
          const eyebrow = link.querySelector(".carousel-rss__eyebrow");
          const title = link.querySelector(".carousel-rss__title");
          const linkText = [];
          if (eyebrow) linkText.push(eyebrow.textContent.trim());
          if (title) linkText.push(title.textContent.trim());
          a.textContent = linkText.join(" - ");
          li.appendChild(a);
          list.appendChild(li);
        });
        col1Cell.push(list);
      }
    }
    const col2Cell = [];
    const col2 = element.querySelector(":scope .grid-container > .grid-row > .grid-row__col-with-7");
    if (col2) {
      const col2Header = col2.querySelector(":scope > .header .cmp-header__text");
      if (col2Header) {
        const h3 = document.createElement("h3");
        h3.textContent = col2Header.textContent.trim();
        col2Cell.push(h3);
      }
      const featuredImage = col2.querySelector(".cmp-image__image");
      if (featuredImage) {
        col2Cell.push(featuredImage);
      }
      const featuredTitle = col2.querySelector(".cmp-title__text");
      if (featuredTitle) {
        col2Cell.push(featuredTitle);
      }
      const featuredCta = col2.querySelector(".cmp-button");
      if (featuredCta) {
        col2Cell.push(featuredCta);
      }
    }
    const cells = [
      [col1Cell, col2Cell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-featured.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/cards-dashboard.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cardLink = element.querySelector(":scope > a, a");
    const href = cardLink ? cardLink.getAttribute("href") || "" : "";
    const image = element.querySelector(".card-image-container img, img.card-image, picture");
    const tag = element.querySelector(".card-metadata-tag, .card-metadata-container span:last-child");
    const date = element.querySelector(".card-metadata-date, .card-metadata-container span:first-child");
    const title = element.querySelector(".card-title, h4, .card-text-container h4");
    const description = element.querySelector(".card-description, .card-text-container p");
    const ctaText = element.querySelector(".card-cta-read-article");
    const readTime = element.querySelector(".card-cta-timestamp");
    const textCell = [];
    if (tag) {
      const tagEl = document.createElement("p");
      tagEl.innerHTML = `<em>${tag.textContent.trim()}</em>`;
      textCell.push(tagEl);
    }
    if (date) {
      const dateEl = document.createElement("p");
      dateEl.textContent = date.textContent.trim();
      textCell.push(dateEl);
    }
    if (title) {
      const headingEl = document.createElement("h4");
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = title.textContent.trim();
        headingEl.appendChild(link);
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
    if (ctaText || readTime) {
      const ctaEl = document.createElement("p");
      const parts = [];
      if (ctaText) parts.push(ctaText.textContent.trim());
      if (readTime) parts.push(readTime.textContent.trim());
      ctaEl.textContent = parts.join(" | ");
      textCell.push(ctaEl);
    }
    const imageCell = image ? [image] : [];
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/cards-investor.js
  function parse8(element, { document }) {
    const cells = [];
    const earningsCard = element.querySelector(".cardpagestory.card-dashboard, .cardpagestory.card-medium, .card-dashboard");
    if (earningsCard) {
      const link = earningsCard.querySelector("a[href]");
      const image = earningsCard.querySelector(".card-image-container img, img.card-image");
      const eyebrow = earningsCard.querySelector(".card-eyebrow, span.card-eyebrow");
      const title = earningsCard.querySelector("h4.card-title, .card-title");
      const description = earningsCard.querySelector("p.card-description, .card-description");
      const cta = earningsCard.querySelector(".card-cta, span.card-cta");
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
      if (description && description.textContent.trim()) {
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
    const linksCard = element.querySelector(".dashboardcards .cmp-dashboardcard, .cmp-dashboardcard");
    if (linksCard) {
      const linkList = linksCard.querySelector('.dashboard-card_link__list, [class*="link__list"]');
      const eyebrow = linksCard.querySelector('.linkcard-eyebrow, [class*="linkcard-eyebrow"]');
      const title = linksCard.querySelector("h5.linkcard-title, .linkcard-title");
      const links = linksCard.querySelectorAll("a.linkcard-link, .linkcard-links a");
      const textCell = [];
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        textCell.push(eyebrowEl);
      }
      if (title) {
        const headingEl = document.createElement("h5");
        headingEl.textContent = title.textContent.trim();
        textCell.push(headingEl);
      }
      if (links.length > 0) {
        const ul = document.createElement("ul");
        links.forEach((linkEl) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = linkEl.getAttribute("href") || "";
          const linkText = linkEl.querySelector(".link-text, span");
          a.textContent = linkText ? linkText.textContent.trim() : linkEl.textContent.trim();
          if (linkEl.getAttribute("title")) {
            a.title = linkEl.getAttribute("title");
          }
          li.appendChild(a);
          ul.appendChild(li);
        });
        textCell.push(ul);
      }
      cells.push([[], textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-investor", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse9(element, { document }) {
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

  // tools/importer/parsers/cards-stats.js
  function parse10(element, { document }) {
    const bgImage = element.querySelector('.cmp-container__bg-image, img[class*="bg-image"]');
    const gridCells = element.querySelectorAll(".grid-cell, .grid-row__col-with-3, .grid-row__col-with-6");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    gridCells.forEach((gridCell) => {
      const cardContent = [];
      const factsCard = gridCell.querySelector(".dashboard-card-facts");
      if (factsCard) {
        const eyebrow = factsCard.querySelector(".eyebrow");
        const dataPoint = factsCard.querySelector(".data-point");
        const dataSuffix = factsCard.querySelector(".data-point-suffix");
        const description = factsCard.querySelector(".description");
        if (eyebrow) cardContent.push(eyebrow);
        if (dataPoint) {
          const statText = dataPoint.textContent.trim() + (dataSuffix ? dataSuffix.textContent.trim() : "");
          const statHeading = document.createElement("h2");
          statHeading.textContent = statText;
          cardContent.push(statHeading);
        }
        if (description) cardContent.push(description);
        cells.push(cardContent);
        return;
      }
      const storyCard = gridCell.querySelector(".cardpagestory, .card-dashboard");
      if (storyCard) {
        const cardLink = storyCard.querySelector("a[href]");
        const cardImage = storyCard.querySelector(".card-image, img");
        const cardEyebrow = storyCard.querySelector(".card-eyebrow");
        const cardTitle = storyCard.querySelector(".card-title, h4, h3, h2");
        const cardDescription = storyCard.querySelector(".card-description, p");
        const cardCta = storyCard.querySelector(".card-cta");
        if (cardImage) cardContent.push(cardImage);
        if (cardEyebrow) cardContent.push(cardEyebrow);
        if (cardTitle) cardContent.push(cardTitle);
        if (cardDescription) cardContent.push(cardDescription);
        if (cardLink && cardCta) {
          const link = document.createElement("a");
          link.href = cardLink.href || cardLink.getAttribute("href");
          link.textContent = cardCta.textContent.trim();
          cardContent.push(link);
        } else if (cardLink) {
          cardContent.push(cardLink);
        }
        cells.push(cardContent);
        return;
      }
      const linksCard = gridCell.querySelector(".dashboard-card_link__list");
      if (linksCard) {
        const linkEyebrow = linksCard.querySelector(".linkcard-eyebrow");
        const linkTitle = linksCard.querySelector(".linkcard-title, h5, h4");
        const links = linksCard.querySelectorAll(".linkcard-link");
        if (linkEyebrow) cardContent.push(linkEyebrow);
        if (linkTitle) cardContent.push(linkTitle);
        links.forEach((link) => {
          cardContent.push(link);
        });
        cells.push(cardContent);
        return;
      }
      const anyContent = gridCell.querySelector("h2, h3, h4, h5, p, a, img");
      if (anyContent) {
        cardContent.push(gridCell);
        cells.push(cardContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-homepage": parse2,
    "video-featured": parse3,
    "cards-dashboard": parse4,
    "cards-article": parse5,
    "embed-video": parse6,
    "cards-feature": parse7,
    "cards-investor": parse8,
    "columns-feature": parse9,
    "cards-stats": parse10
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AbbVie corporate homepage with hero, featured content sections, and calls to action",
    urls: ["https://www.abbvie.com/"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".homepage-hero-controller .cmp-home-hero"]
      },
      {
        name: "columns-homepage",
        instances: [".container.homepage-overlap .cmp-grid-custom"]
      },
      {
        name: "video-featured",
        instances: ["#maincontent > .aem-Grid > .responsivegrid > .aem-Grid > .video.cmp-video-xx-large:first-of-type"]
      },
      {
        name: "cards-dashboard",
        instances: ["#teaser-12e164de76 ~ .grid.aem-GridColumn"]
      },
      {
        name: "cards-article",
        instances: [".container.cmp-container-large .cardpagestory.card-standard"]
      },
      {
        name: "embed-video",
        instances: ["#teaser-12e164de76 ~ .container ~ .video.cmp-video-xx-large"]
      },
      {
        name: "cards-feature",
        instances: ["#section02 ~ .grid.cmp-grid-custom"]
      },
      {
        name: "cards-investor",
        instances: ["#section03 ~ .grid.aem-GridColumn"]
      },
      {
        name: "columns-feature",
        instances: [".container.cmp-container-xxx-large.default-radius .grid.no-bottom-margin"]
      },
      {
        name: "cards-stats",
        instances: ["#section04 ~ .container.cmp-container-full-width"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".homepage-hero-controller",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Press Releases and Featured",
        selector: ".container.homepage-overlap",
        style: null,
        blocks: ["columns-homepage"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Patients Section",
        selector: ["#teaser-f34db54d6a", ".video.cmp-video-xx-large:first-of-type"],
        style: null,
        blocks: ["video-featured"],
        defaultContent: ["#teaser-f34db54d6a .cmp-teaser__title", "#teaser-f34db54d6a .cmp-teaser__description", "#teaser-f34db54d6a .cmp-teaser__action-container"]
      },
      {
        id: "section-4",
        name: "Science and Innovation",
        selector: ["#teaser-12e164de76", ".container.cmp-container-large"],
        style: null,
        blocks: ["cards-dashboard", "cards-article", "embed-video"],
        defaultContent: ["#teaser-12e164de76 .cmp-teaser__pretitle", "#teaser-12e164de76 .cmp-teaser__title", "#teaser-12e164de76 .cmp-teaser__description"]
      },
      {
        id: "section-5",
        name: "Culture and Careers",
        selector: ["#section02", ".grid.cmp-grid-custom"],
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["#section02 .cmp-teaser__pretitle", "#section02 .cmp-teaser__title", "#section02 .cmp-teaser__description"]
      },
      {
        id: "section-6",
        name: "Explore Opportunities",
        selector: ".container.medium-radius.cmp-container-xxx-large",
        style: "dark",
        blocks: [],
        defaultContent: ["#title-efb1f4a0fb .cmp-title__text", "#text-a600f16dc1 .cmp-text", "#button-22d1824ab9"]
      },
      {
        id: "section-7",
        name: "Investor Resources",
        selector: ["#section03", "#section03 ~ .grid"],
        style: null,
        blocks: ["cards-investor"],
        defaultContent: ["#section03 .cmp-teaser__pretitle", "#section03 .cmp-teaser__title", "#section03 .cmp-teaser__description"]
      },
      {
        id: "section-8",
        name: "Manufacturing Feature",
        selector: ".container.default-radius.cmp-container-xxx-large",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "ESG Sustainability",
        selector: ["#section04", "#section04 ~ .container.cmp-container-full-width"],
        style: null,
        blocks: ["cards-stats"],
        defaultContent: ["#section04 .cmp-teaser__pretitle", "#section04 .cmp-teaser__title", "#section04 .cmp-teaser__description"]
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
  return __toCommonJS(import_homepage_exports);
})();
