/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns.
 * Source: https://www.wknd-trendsetters.site/blog (featured article section)
 * Generated: 2026-06-11
 *
 * Content model: 1 row, 2 columns.
 *   Column 1: 3x2 cover image.
 *   Column 2: meta row (Featured tag + date), H2 heading, lead paragraph, "Read the full article" CTA link.
 *
 * Selectors validated against migration-work/block-context/columns-feature/source.html.
 * Fallbacks added for cross-page resilience.
 */
export default function parse(element, { document }) {
  // The block content lives inside the grid layout; fall back to the section itself.
  const grid = element.querySelector('.grid-layout') || element;

  // Column 1: cover image.
  const image = grid.querySelector('img.cover-image, img[class*="cover"], img');

  // Column 2: text content cell.
  const textCell = [];

  // Meta row: Featured tag + date.
  const metaRow = grid.querySelector('.flex-horizontal, [class*="flex"]');
  if (metaRow && (metaRow.querySelector('.tag') || metaRow.querySelector('[class*="paragraph"]'))) {
    textCell.push(metaRow);
  }

  // Heading.
  const heading = grid.querySelector('h2.h2-heading, h2, [class*="heading"]');
  if (heading) textCell.push(heading);

  // Lead paragraph (exclude paragraphs already inside the meta row).
  const lead = grid.querySelector('p.paragraph-lg, p[class*="paragraph-lg"]')
    || Array.from(grid.querySelectorAll('p')).find((p) => !metaRow || !metaRow.contains(p));
  if (lead) textCell.push(lead);

  // CTA link.
  const ctaGroup = grid.querySelector('.button-group');
  const cta = (ctaGroup && ctaGroup.querySelector('a')) || grid.querySelector('a.button, a[class*="button"]');
  if (cta) textCell.push(cta);

  // Empty-block guard: bail gracefully if nothing meaningful was found.
  if (!image && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build the single row with two columns: [image] | [text content].
  const cells = [[image || '', textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
