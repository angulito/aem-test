/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie story-article ("Our Stories") page builder.
 *
 * Rebuilds the body into clean EDS sections:
 *   1. story-hero block — full-bleed hero image + back-link + meta (date / category / read-time)
 *      + title + dek (article header that sits below the image on white).
 *   2. Long-form body — default content: section headings, prose paragraphs, inline images
 *      with italic captions, and the closing "Media inquiries" mailto line.
 * Plus a trailing Metadata block (Title, Description, Image, nav, footer).
 *
 * Source structure (validated against migration-work/cleaned.html):
 *   #maincontent
 *     .container.large-radius > img.cmp-container__bg-image          (hero image)
 *     .container.overlap-predecessor                                  (article header)
 *       .back-cta a            -> back-link
 *       .storyinfo  > div > p  -> "<date> <category-link>" + "<read-time>"
 *       .title h1              -> title
 *       .text .cmp-text p      -> dek
 *     .grid .grid-row__col-with-8.grid-cell                           (body column)
 *       alternating .container (heading+text blocks) and .image (img + caption span)
 *
 * The hero meta/title/dek come from the page itself, so this generalizes across
 * the ~119 story pages (each supplies its own image, date, category, title, body).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = element.ownerDocument;
  const main = element.querySelector('#maincontent') || element;

  // --- 1. Article header pieces ---
  const heroImg = main.querySelector('img.cmp-container__bg-image, .container.large-radius img, picture img, img');

  const backLinkSrc = main.querySelector('.back-cta a, .button.back-cta a');
  const storyInfo = main.querySelector('.storyinfo');
  const titleSrc = main.querySelector('.overlap-predecessor .cmp-title__text, .overlap-predecessor h1, h1');
  const dekSrc = main.querySelector('.overlap-predecessor .cmp-text p, .overlap-predecessor .text p');

  // --- 2. Body column ---
  const bodyCell = main.querySelector('.grid-row__col-with-8.grid-cell')
    || main.querySelector('.grid .grid-cell');

  // Collect body content in document order BEFORE we wipe main.
  const bodyEls = [];
  if (bodyCell) {
    [...bodyCell.children].forEach((child) => {
      if (child.classList.contains('image') || child.querySelector('.cmp-image')) {
        // Inline image + caption span -> <picture>/<img> + italic caption paragraph.
        const img = child.querySelector('img');
        const captionSrc = child.querySelector('.cmp-image__title, figcaption, .caption');
        if (img) {
          // Below-fold images may be lazy-loaded with a blob: src at import time;
          // recover the real Scene7 URL from the common lazy-load data attributes.
          const realSrc = ['data-src', 'data-original', 'data-lazy-src', 'data-lazy']
            .map((attr) => img.getAttribute(attr))
            .find((v) => v && !v.startsWith('blob:'));
          const curSrc = img.getAttribute('src') || '';
          if (curSrc.startsWith('blob:') && realSrc) img.setAttribute('src', realSrc);
          bodyEls.push(img);
        }
        if (captionSrc && captionSrc.textContent.trim()) {
          const cap = document.createElement('p');
          const em = document.createElement('em');
          em.textContent = captionSrc.textContent.trim();
          cap.appendChild(em);
          bodyEls.push(cap);
        }
      } else {
        // Text container: pull out headings and paragraphs in order, skip separators.
        const inner = child.querySelector('.cmp-container') || child;
        [...inner.children].forEach((node) => {
          if (node.classList.contains('separator')) return;
          const heading = node.querySelector('h1, h2, h3, h4, h5, h6');
          if (heading) {
            bodyEls.push(heading);
            return;
          }
          const paras = node.querySelectorAll('p');
          if (paras.length) {
            paras.forEach((p) => { if (p.textContent.trim() || p.querySelector('a')) bodyEls.push(p); });
          } else if (node.tagName === 'P' && (node.textContent.trim() || node.querySelector('a'))) {
            bodyEls.push(node);
          }
        });
      }
    });
  }

  // --- Build the story-hero block cells (one authored row each) ---
  const heroCells = [];
  if (heroImg) heroCells.push([heroImg]);
  if (backLinkSrc) {
    const a = document.createElement('a');
    a.href = backLinkSrc.getAttribute('href') || '#';
    const t = backLinkSrc.querySelector('.cmp-button__text, span');
    a.textContent = t ? t.textContent.trim() : backLinkSrc.textContent.trim();
    heroCells.push([a]);
  }
  if (storyInfo) {
    // Meta line: date text + category link + read-time, as a single paragraph.
    const metaP = document.createElement('p');
    const infoParas = storyInfo.querySelectorAll('p');
    const dateNode = infoParas[0];
    if (dateNode) {
      // dateNode contains "<date text> <category link>"
      const catLink = dateNode.querySelector('a');
      const dateText = dateNode.childNodes[0] ? dateNode.textContent.replace(catLink ? catLink.textContent : '', '').trim() : dateNode.textContent.trim();
      if (dateText) metaP.appendChild(document.createTextNode(dateText));
      if (catLink) {
        const a = document.createElement('a');
        a.href = catLink.getAttribute('href') || '#';
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
    const h1 = document.createElement('h1');
    h1.textContent = titleSrc.textContent.trim();
    heroCells.push([h1]);
  }
  if (dekSrc) {
    const p = document.createElement('p');
    p.textContent = dekSrc.textContent.trim();
    heroCells.push([p]);
  }

  const heroBlock = WebImporter.Blocks.createBlock(document, {
    name: 'story-hero',
    cells: heroCells,
  });

  // --- Rebuild main: hero block, <hr>, body, <hr>, metadata ---
  main.textContent = '';
  main.appendChild(heroBlock);

  if (bodyEls.length) {
    main.appendChild(document.createElement('hr'));
    bodyEls.forEach((el) => main.appendChild(el));
  }

  // --- Metadata ---
  const metaCells = {};
  const titleText = (document.title || (titleSrc ? titleSrc.textContent.trim() : '')).trim();
  if (titleText) metaCells.Title = titleText;
  const descMeta = document.querySelector('meta[name="description"], meta[property="og:description"]');
  if (descMeta && descMeta.getAttribute('content')) metaCells.Description = descMeta.getAttribute('content').trim();
  const ogImg = document.querySelector('meta[property="og:image"], meta[property="og:image:url"]');
  if (ogImg && ogImg.getAttribute('content')) metaCells.Image = ogImg.getAttribute('content').trim();
  metaCells.nav = '/content/nav';
  metaCells.footer = '/content/footer';

  const metaBlock = WebImporter.Blocks.createBlock(document, { name: 'Metadata', cells: metaCells });
  main.appendChild(document.createElement('hr'));
  main.appendChild(metaBlock);
}
