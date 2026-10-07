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

  // tools/importer/import-contact-location.js
  var import_contact_location_exports = {};
  __export(import_contact_location_exports, {
    default: () => import_contact_location_default
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

  // tools/importer/transformers/abbvie-contact-location.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const document = element.ownerDocument;
    const main = element.querySelector("#maincontent") || element;
    const h1 = main.querySelector(".title .cmp-title__text, h1.cmp-title__text, h1");
    const cardContainer = main.querySelector(".container.cmp-container-small");
    const cardHeading = cardContainer ? cardContainer.querySelector(".cmp-title__text, h1, h2, h3, h4, h5, h6") : null;
    const cardParagraphs = cardContainer ? Array.from(cardContainer.querySelectorAll(".cmp-text p")) : [];
    let legalParagraphs = [];
    const textBlocks = Array.from(main.querySelectorAll(".text .cmp-text"));
    const legalBlock = textBlocks.find((tb) => !cardContainer || !cardContainer.contains(tb));
    if (legalBlock) {
      legalParagraphs = Array.from(legalBlock.children).filter(
        (el) => el.textContent.trim() || el.querySelector("a")
      );
    }
    const sections = [];
    const countryName = h1 ? h1.textContent.trim() : "";
    if (countryName) {
      const cell = document.createElement("div");
      const breadcrumb = document.createElement("p");
      breadcrumb.textContent = `Contact Center > Locations > ${countryName}`;
      cell.appendChild(breadcrumb);
      const heading = document.createElement("h1");
      heading.textContent = countryName;
      cell.appendChild(heading);
      const heroBlock = WebImporter.Blocks.createBlock(document, {
        name: "hero-contact",
        cells: [[cell]]
      });
      sections.push([heroBlock]);
    }
    const cardEls = [];
    if (cardHeading) {
      const h = document.createElement("h3");
      h.textContent = cardHeading.textContent.trim();
      cardEls.push(h);
    }
    cardParagraphs.forEach((p) => cardEls.push(p));
    if (cardEls.length) {
      sections.push({ els: cardEls, style: "contact-card" });
    }
    if (legalParagraphs.length) {
      sections.push(legalParagraphs);
    }
    main.textContent = "";
    sections.forEach((section, idx) => {
      if (idx > 0) main.appendChild(document.createElement("hr"));
      const isStyled = !Array.isArray(section);
      const els = isStyled ? section.els : section;
      els.forEach((el) => main.appendChild(el));
      if (isStyled && section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { Style: section.style }
        });
        main.appendChild(sectionMetadata);
      }
    });
    const titleText = (document.title || (h1 ? h1.textContent.trim() : "")).trim();
    const metaCells = {};
    if (titleText) metaCells.Title = titleText;
    metaCells.nav = "/content/nav";
    metaCells.footer = "/content/footer";
    const metaBlock = WebImporter.Blocks.createBlock(document, {
      name: "Metadata",
      cells: metaCells
    });
    main.appendChild(document.createElement("hr"));
    main.appendChild(metaBlock);
  }

  // tools/importer/import-contact-location.js
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "contact-location",
    description: "AbbVie country/contact location page: H1 country name, centered contact card (company + address + phones), and left-aligned legal disclosure text with register links",
    urls: ["https://www.abbvie.com/contact-center/locations/croatia.html"],
    blocks: [],
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
  var import_contact_location_default = {
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
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_contact_location_exports);
})();
