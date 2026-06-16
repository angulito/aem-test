/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-blog. Base block: hero.
 * Source: https://www.wknd-trendsetters.site/blog
 * Generated: 2026-06-11
 *
 * Target structure (from block library example):
 *   Row 1: cover image
 *   Row 2: H1 heading + subheading paragraph + CTA links (Read now, See trends)
 *
 * Source HTML (validated):
 *   <header class="section secondary-section">
 *     <div class="container">
 *       <div class="grid-layout ...">
 *         <div>            <-- text column: h1.h1-heading, p.subheading, div.button-group > a.button
 *         <div>            <-- image column: img.cover-image
 */
export default function parse(element, { document }) {
  // Heading — H1 in source; fall back to other heading levels / title classes
  const heading = element.querySelector('h1, h1.h1-heading, [class*="h1-heading"], h2');

  // Subheading paragraph — explicit subheading class in source, fall back to first paragraph
  const subheading = element.querySelector('p.subheading, [class*="subheading"], .container p');

  // CTA links — buttons inside the button group; fall back to any anchors in the text area
  let ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));
  if (ctaLinks.length === 0) {
    ctaLinks = Array.from(element.querySelectorAll('.container a'));
  }

  // Cover image — explicit cover-image class in source, fall back to any image in the header
  const coverImage = element.querySelector('img.cover-image, [class*="cover-image"], img');

  // Empty-block guard: bail gracefully if essential content is missing
  if (!heading && !subheading && !coverImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: cover image (only if present)
  if (coverImage) {
    cells.push([coverImage]);
  }

  // Row 2: heading + subheading + CTA links, grouped into a single cell.
  // Wrap in one container so the importer renders this as one cell (one column),
  // not separate columns per element.
  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.append(heading);
  if (subheading) contentWrapper.append(subheading);
  ctaLinks.forEach((link) => contentWrapper.append(link));
  cells.push([contentWrapper]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
