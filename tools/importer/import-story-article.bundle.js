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

  // tools/importer/import-story-article.js
  var import_story_article_exports = {};
  __export(import_story_article_exports, {
    default: () => import_story_article_default
  });

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, ["#abbvie-warn-on-departure-popup", ".modal-popup", ".popup-departure"]);
      const surveyAnchors = element.querySelectorAll(
        'img[src*="bowencraggs.com"], a[href*="research.net/r/"], a[href*="SurveyType=PopUp"]'
      );
      const surveyWrappers = /* @__PURE__ */ new Set();
      surveyAnchors.forEach((node) => {
        let el = node;
        for (let i = 0; i < 6 && el && el.parentElement && el.parentElement !== element; i += 1) {
          el = el.parentElement;
        }
        surveyWrappers.add(el);
      });
      surveyWrappers.forEach((el) => {
        if (el && el.remove) el.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--header"]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--footer"]);
      WebImporter.DOMUtils.remove(element, [".back-to-top"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      const trackingImgs = element.querySelectorAll('img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"], img[src*="doubleclick.net"], img[src*="facebook.com/tr"]');
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

  // tools/importer/transformers/abbvie-story-article.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const document = element.ownerDocument;
    const main = element.querySelector("#maincontent") || element;
    const heroImg = main.querySelector("img.cmp-container__bg-image, .container.large-radius img, picture img, img");
    const backLinkSrc = main.querySelector(".back-cta a, .button.back-cta a");
    const storyInfo = main.querySelector(".storyinfo");
    const titleSrc = main.querySelector(".overlap-predecessor .cmp-title__text, .overlap-predecessor h1, h1");
    const dekSrc = main.querySelector(".overlap-predecessor .cmp-text p, .overlap-predecessor .text p");
    const bodyCell = main.querySelector(".grid-row__col-with-8.grid-cell") || main.querySelector(".grid .grid-cell");
    const bodyEls = [];
    if (bodyCell) {
      [...bodyCell.children].forEach((child) => {
        if (child.classList.contains("image") || child.querySelector(".cmp-image")) {
          const img = child.querySelector("img");
          const captionSrc = child.querySelector(".cmp-image__title, figcaption, .caption");
          if (img) {
            const realSrc = ["data-src", "data-original", "data-lazy-src", "data-lazy"].map((attr) => img.getAttribute(attr)).find((v) => v && !v.startsWith("blob:"));
            const curSrc = img.getAttribute("src") || "";
            if (curSrc.startsWith("blob:") && realSrc) img.setAttribute("src", realSrc);
            bodyEls.push(img);
          }
          if (captionSrc && captionSrc.textContent.trim()) {
            const cap = document.createElement("p");
            const em = document.createElement("em");
            em.textContent = captionSrc.textContent.trim();
            cap.appendChild(em);
            bodyEls.push(cap);
          }
        } else {
          const inner = child.querySelector(".cmp-container") || child;
          [...inner.children].forEach((node) => {
            if (node.classList.contains("separator")) return;
            const heading = node.querySelector("h1, h2, h3, h4, h5, h6");
            if (heading) {
              bodyEls.push(heading);
              return;
            }
            const paras = node.querySelectorAll("p");
            if (paras.length) {
              paras.forEach((p) => {
                if (p.textContent.trim() || p.querySelector("a")) bodyEls.push(p);
              });
            } else if (node.tagName === "P" && (node.textContent.trim() || node.querySelector("a"))) {
              bodyEls.push(node);
            }
          });
        }
      });
    }
    const heroCells = [];
    if (heroImg) heroCells.push([heroImg]);
    if (backLinkSrc) {
      const a = document.createElement("a");
      a.href = backLinkSrc.getAttribute("href") || "#";
      const t = backLinkSrc.querySelector(".cmp-button__text, span");
      a.textContent = t ? t.textContent.trim() : backLinkSrc.textContent.trim();
      heroCells.push([a]);
    }
    if (storyInfo) {
      const metaP = document.createElement("p");
      const infoParas = storyInfo.querySelectorAll("p");
      const dateNode = infoParas[0];
      if (dateNode) {
        const catLink = dateNode.querySelector("a");
        const dateText = dateNode.childNodes[0] ? dateNode.textContent.replace(catLink ? catLink.textContent : "", "").trim() : dateNode.textContent.trim();
        if (dateText) metaP.appendChild(document.createTextNode(dateText));
        if (catLink) {
          const a = document.createElement("a");
          a.href = catLink.getAttribute("href") || "#";
          a.textContent = catLink.textContent.trim();
          metaP.appendChild(a);
        }
      }
      const readTime = infoParas[1];
      if (readTime && readTime.textContent.trim()) {
        metaP.appendChild(document.createTextNode(readTime.textContent.trim()));
      }
      if (metaP.childNodes.length) heroCells.push([metaP]);
    }
    if (titleSrc) {
      const h1 = document.createElement("h1");
      h1.textContent = titleSrc.textContent.trim();
      heroCells.push([h1]);
    }
    if (dekSrc) {
      const p = document.createElement("p");
      p.textContent = dekSrc.textContent.trim();
      heroCells.push([p]);
    }
    const heroBlock = WebImporter.Blocks.createBlock(document, {
      name: "story-hero",
      cells: heroCells
    });
    main.textContent = "";
    main.appendChild(heroBlock);
    if (bodyEls.length) {
      main.appendChild(document.createElement("hr"));
      bodyEls.forEach((el) => main.appendChild(el));
    }
    const metaCells = {};
    const titleText = (document.title || (titleSrc ? titleSrc.textContent.trim() : "")).trim();
    if (titleText) metaCells.Title = titleText;
    const descMeta = document.querySelector('meta[name="description"], meta[property="og:description"]');
    if (descMeta && descMeta.getAttribute("content")) metaCells.Description = descMeta.getAttribute("content").trim();
    const ogImg = document.querySelector('meta[property="og:image"], meta[property="og:image:url"]');
    if (ogImg && ogImg.getAttribute("content")) metaCells.Image = ogImg.getAttribute("content").trim();
    metaCells.nav = "/content/nav";
    metaCells.footer = "/content/footer";
    const metaBlock = WebImporter.Blocks.createBlock(document, { name: "Metadata", cells: metaCells });
    main.appendChild(document.createElement("hr"));
    main.appendChild(metaBlock);
  }

  // tools/importer/import-story-article.js
  var transformers = [
    transform,
    transform3,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "story-article",
    description: 'AbbVie "Our Stories" editorial article: full-bleed hero image + article header (back-link, date/category/read-time, title, dek) via story-hero block, then long-form default-content body with inline images and captions',
    urls: ["https://www.abbvie.com/who-we-are/our-stories/a-molecular-behavior-chart-speeding-up-research-with-predictive-analytics.html"],
    blocks: [],
    sections: []
  };
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
  var import_story_article_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let path = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!path) path = "/index";
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: ["story-hero"]
        }
      }];
    }
  };
  return __toCommonJS(import_story_article_exports);
})();
