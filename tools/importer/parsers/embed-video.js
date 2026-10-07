/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-video
 * Base block: embed
 * Source: https://www.abbvie.com/
 * Generated: 2026-06-08
 *
 * Extracts YouTube video embed with poster/thumbnail image from AbbVie video component.
 * Handles variations: different iframe URL formats, missing poster images.
 * Source structure: .cmp-video with poster image (.cmp-video__image img) and
 * YouTube iframe (.youtube-video). Output: embed-video block with poster image
 * row and video URL link row.
 */
export default function parse(element, { document }) {
  // Extract poster/thumbnail image
  const posterImg = element.querySelector('.cmp-video__image img, .cmp-image__image, img[alt*="video"], img[alt*="thumbnail"]');

  // Extract YouTube iframe to get the video URL
  const iframe = element.querySelector('iframe.youtube-video, iframe[src*="youtube.com/embed"], iframe[src*="youtu.be"]');

  // Build the canonical YouTube watch URL from the embed URL
  let videoUrl = '';
  if (iframe) {
    const iframeSrc = iframe.getAttribute('src') || '';
    const embedMatch = iframeSrc.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    } else {
      // Fallback: use iframe src directly
      videoUrl = iframeSrc.split('?')[0];
    }
  }

  // Build cells array matching embed-video block structure:
  // Row 1: poster image (optional)
  // Row 2: video URL as a link
  const cells = [];

  // Add poster image row if available
  if (posterImg) {
    cells.push([posterImg]);
  }

  // Add video URL as a link element
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cells.push([link]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
