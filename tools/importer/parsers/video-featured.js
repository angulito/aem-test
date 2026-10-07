/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-featured
 * Base block: video
 * Source: https://www.abbvie.com/
 * Selector: #maincontent > .aem-Grid > .responsivegrid > .aem-Grid > .video.cmp-video-xx-large:first-of-type
 * Generated: 2026-06-08
 *
 * Extracts a featured video component with poster image, descriptive text overlay,
 * and video reference from a Brightcove-embedded video panel.
 */
export default function parse(element, { document }) {
  // Extract poster image from the video panel
  const posterImage = element.querySelector('.cmp-video__image img.cmp-image__image, .cmp-video__image img');

  // Extract description text from the overlay text content
  const textContent = element.querySelector('.cmp-video__text-content > div');
  const descriptionText = textContent ? textContent.childNodes[0] : null;

  // Extract play button with duration info
  const playButton = element.querySelector('.cmp-video__text-content button');

  // Fallback: outside text content (h5 with same description)
  const outsideText = element.querySelector('.cmp-video__text-content-outside h5');

  // Extract video title from Brightcove player dock
  const videoTitle = element.querySelector('.vjs-dock-title');

  // Extract video poster from the vjs-poster (higher quality version)
  const vjsPoster = element.querySelector('.vjs-poster img');

  // Build cells to match video-featured block structure:
  // Row 1: Poster image (thumbnail/cover)
  // Row 2: Description and CTA/play info
  const cells = [];

  // Row 1: Poster image
  if (posterImage) {
    cells.push([posterImage]);
  } else if (vjsPoster) {
    cells.push([vjsPoster]);
  }

  // Row 2: Description text and play button
  const contentCell = [];

  // Prefer the overlay text content div; fallback to outside h5
  if (textContent) {
    // Create a clean paragraph with the description text
    const descP = document.createElement('p');
    descP.textContent = textContent.textContent.trim().replace(/\s*Watch\s+\d+:\d+\s*/, '');
    contentCell.push(descP);
  } else if (outsideText) {
    contentCell.push(outsideText);
  }

  // Add play button info (duration context)
  if (playButton) {
    const buttonP = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = playButton.textContent.trim();
    buttonP.appendChild(strong);
    contentCell.push(buttonP);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-featured', cells });
  element.replaceWith(block);
}
