/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cover. Base: hero.
 * Source: https://new.express.adobe.com/webpage/DYft29Wzo0QLK
 * Instance selector: .article > .section.title-section
 *
 * Block contract (blocks/hero-cover/hero-cover.js, 1 column):
 *   Row 1: background image
 *   Row 2: h1 title + byline paragraph (+ optional CTA)
 *
 * Validated selectors (source.html):
 *   .section-background-image img  -> background photo
 *   h1.title                       -> title (span wrapper stripped by express-cleanup)
 *   p.subtitle                     -> byline
 */
// Live viewer renders the photo as an inline background-image on .section-background-image;
// express-cleanup normally inserts an <img>, this is a fallback when it has not run.
function imageFromBackground(document, el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  if (!m) return null;
  const img = document.createElement('img');
  img.src = m[1];
  const alt = el.getAttribute('data-alt');
  if (alt) img.alt = alt;
  return img;
}

export default function parse(element, { document }) {
  const bgImage = element.querySelector('.section-background-image img')
    || element.querySelector('.section-background img')
    || imageFromBackground(document, element.querySelector('.section-background-image'));

  const heading = element.querySelector('.title-header h1, h1.title')
    || element.querySelector('h1, h2');

  const subtitles = [...element.querySelectorAll('.title-header p.subtitle, .title-header-view > p')]
    .filter((p, i, arr) => arr.indexOf(p) === i && p.textContent.trim());

  const ctas = [...element.querySelectorAll('.title-header a[href]')];

  if (!heading && !bgImage && !subtitles.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) {
    // Normalise to h1 — the page title hero
    if (heading.tagName !== 'H1') {
      const h1 = document.createElement('h1');
      h1.innerHTML = heading.innerHTML;
      contentCell.push(h1);
    } else {
      contentCell.push(heading);
    }
  }
  subtitles.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    contentCell.push(para);
  });
  ctas.forEach((a) => {
    if (!contentCell.some((el) => el.contains && el.contains(a))) {
      const p = document.createElement('p');
      p.append(a);
      contentCell.push(p);
    }
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cover', cells });
  element.replaceWith(block);
}
