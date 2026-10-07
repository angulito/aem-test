/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-patient.
 * Base block: columns.
 * Source: https://www.abbvie.com/patients.html (section 5 — Patient Health & Engagement).
 * Generated: 2026-06-09.
 *
 * Layout: a heading/intro column (eyebrow + heading) placed beside a multi-item
 * feature grid. Each feature item = image + small bold header + paragraph + optional
 * "Learn More" CTA (Patient support programs, Educational programs, Partnerships, Grants).
 *
 * Columns convention (blockStructuresFetched.columns): first row = block name;
 * subsequent rows = cells, one per column. The columns-patient decorator treats
 * block.firstElementChild.children as the set of columns, so we emit a single content
 * row whose cells are: [headingColumn, featureItem1, featureItem2, ...].
 *
 * Feature item images are Scene7 DM images — emitted normally as img/picture so the
 * DM transformer can convert them downstream.
 */
export default function parse(element, { document }) {
  // ---- Heading / intro column -------------------------------------------------
  // Eyebrow lives in a .cmp-header > .cmp-header__text span; the heading is a
  // .cmp-title__text element (h1-h6). Both sit in the left grid cell.
  const headingColumn = [];

  const eyebrowSpan = element.querySelector('.cmp-header .cmp-header__text');
  const headingEl = element.querySelector('.cmp-title .cmp-title__text');

  if (eyebrowSpan) {
    const eyebrowText = (eyebrowSpan.textContent || '').trim();
    if (eyebrowText) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = eyebrowText;
      p.append(strong);
      headingColumn.push(p);
    }
  }
  if (headingEl) headingColumn.push(headingEl);

  // ---- Feature items ----------------------------------------------------------
  // Each feature item has a leading image (.cmp-image __image) and lives in its own
  // grid cell within the nested feature grid. We anchor on each feature image, then
  // walk its sibling header/text/CTA nodes inside the same grid cell.
  const featureImages = Array.from(
    element.querySelectorAll('.cmp-image .cmp-image__image, .cmp-image img'),
  );

  const featureCells = [];
  const seenCells = new Set();

  featureImages.forEach((img) => {
    // The grid cell that contains this image (image + header + text + optional CTA).
    const cell = img.closest('.grid-cell') || img.closest('.image')?.parentElement;
    if (!cell || seenCells.has(cell)) return;
    seenCells.add(cell);

    const itemContent = [];

    // Image (picture preferred so DM transformer can convert; else the img itself).
    const picture = img.closest('picture');
    itemContent.push(picture || img);

    // Small bold header for this feature item.
    const itemHeaderSpan = cell.querySelector('.cmp-header .cmp-header__text');
    if (itemHeaderSpan) {
      const headerText = (itemHeaderSpan.textContent || '').trim();
      if (headerText) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = headerText;
        p.append(strong);
        itemContent.push(p);
      }
    }

    // Paragraph(s) of body copy.
    const paragraphs = Array.from(cell.querySelectorAll('.cmp-text p, p.cmp-text, .text p'));
    paragraphs.forEach((p) => {
      if (cell.contains(p)) itemContent.push(p);
    });

    // Optional "Learn More" CTA link.
    const cta = cell.querySelector('a.cmp-button, .button a, a[class*="button"]');
    if (cta) {
      // Normalize to a plain anchor carrying the visible button text.
      const ctaText = (cta.textContent || '').trim();
      if (ctaText) cta.textContent = ctaText;
      itemContent.push(cta);
    }

    featureCells.push(itemContent);
  });

  // ---- Assemble single content row: heading column + feature columns ----------
  const row = [];
  if (headingColumn.length) row.push(headingColumn);
  featureCells.forEach((c) => row.push(c));

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-patient', cells });
  element.replaceWith(block);
}
