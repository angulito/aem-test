/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-quote.
 * Base block: columns.
 * Source: https://www.abbvie.com/science.html (section 6 "The tenacity to take on the toughest challenges").
 * Generated: 2026-06-10
 *
 * Layout: 2-column columns block.
 *   - Left column: video poster image (Scene7 DM image, emitted as a normal img/picture) + "Watch" play label.
 *   - Right column: pull quote text + author attribution.
 *
 * The container element holds two `.grid` blocks: the first is the default-content
 * heading + intro paragraph (NOT part of this block), the second holds the video
 * column beside the quote column (this block). We therefore extract from the grid
 * that contains the `.quote` component.
 */
export default function parse(element, { document }) {
  // Locate the quote component; the columns-quote block is the grid that contains it.
  const quote = element.querySelector('.cmp-quote, .quote');
  const blockGrid = quote
    ? (quote.closest('.grid') || element)
    : element;

  // --- Left column: video poster image + watch label ---
  const videoCol = [];

  // Poster image: prefer the semantic poster (descriptive alt) over the player-generated one.
  const posterImg = blockGrid.querySelector('.cmp-video__image img, .cmp-video__image picture, .video img, .video picture');
  if (posterImg) videoCol.push(posterImg);

  // "Watch 1:30" play control. Source renders it as a <button>; capture as a link if it
  // has an href, otherwise preserve the label text.
  const watchLink = blockGrid.querySelector('.cmp-video a[href], .video a[href]');
  if (watchLink) {
    videoCol.push(watchLink);
  } else {
    const watchBtn = blockGrid.querySelector('.cmp-video__text-content button, .cmp-video__text-content, .video button');
    if (watchBtn) {
      const label = watchBtn.textContent.trim();
      if (label) {
        const p = document.createElement('p');
        p.textContent = label;
        videoCol.push(p);
      }
    }
  }

  // --- Right column: quote text + author attribution ---
  const quoteCol = [];
  if (quote) {
    const quoteText = quote.querySelector('.cmp-quote__text, blockquote, p');
    if (quoteText) quoteCol.push(quoteText);

    const authorBlock = quote.querySelector('.cmp-quote__author-block');
    if (authorBlock) {
      quoteCol.push(authorBlock);
    } else {
      const authorName = quote.querySelector('.author-name');
      const authorTitle = quote.querySelector('.author-title');
      if (authorName) quoteCol.push(authorName);
      if (authorTitle) quoteCol.push(authorTitle);
    }
  }

  // columns convention: first row = block name (handled by createBlock);
  // second row = one cell per column (left video, right quote).
  const cells = [
    [videoCol, quoteCol],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-quote', cells });
  element.replaceWith(block);
}
