/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Adobe Express Webpage (new.express.adobe.com/webpage/*) site-wide cleanup.
 *
 * Removes the Express viewer chrome so only authorable page content remains, and
 * normalises lazy / background-image media into plain <img> elements so block parsers
 * and default-content import can pick them up.
 *
 * All selectors verified against migration-work/cleaned.html (line refs below) and
 * migration-work/page-structure.json analysisNotes.excluded.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Extract the first url(...) from an inline background-image style.
function getBackgroundUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const match = style.match(/background(?:-image)?\s*:[^;]*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return match ? match[1] : null;
}

function createImg(doc, src, alt) {
  const img = doc.createElement('img');
  img.setAttribute('src', src);
  if (alt) img.setAttribute('alt', alt);
  return img;
}

export default function transform(hookName, element, payload) {
  const doc = element.ownerDocument || document;

  if (hookName === TransformHook.beforeTransform) {
    // Viewer overlays / dialogs that sit around the article (remove before parsing).
    //  - #luca-splash : loading splash screen (line 5) — contains a duplicate hero img
    //  - .report-abuse-dialog : report abuse modal (line 329) — also contains a nested
    //    `.article` div, so remove it before any `.article > ...` selector runs
    //  - .banner.js-report-success / .banner.js-report-error : report result banners (323-328)
    //  - .toast-container, #copy-link-to-section : copy-link toast + a11y label (305-308)
    //  - #published-webpages-growth-link : floating "Made in Adobe Express" button (293)
    //  - .embedded-link-viewer : embed overlay with Close button (310)
    //  - .wp-collection-browser : empty collection browser (321)
    //  - #analytics-iframe : analytics iframe (317)
    //  - #view-static-version-link : "View Screen Reader-Friendly Version" link (2)
    WebImporter.DOMUtils.remove(element, [
      '#luca-splash',
      '.report-abuse-dialog',
      '.banner.js-report-success',
      '.banner.js-report-error',
      '.toast-container',
      '#copy-link-to-section',
      '#published-webpages-growth-link',
      '.embedded-link-viewer',
      '.wp-collection-browser',
      '#analytics-iframe',
      '#view-static-version-link',
    ]);

    // Non-content sections / controls inside the article.
    //  - .section.spacer-section : 2px decorative dividers (lines 93, 119)
    //  - .section.bumper-section : branded footer (ToS / Privacy / Report Abuse) (266)
    //  - .back-to-top-button : back to top (273)
    //  - .wp-scrollbar : custom scrollbar (277)
    //  - .wp-swipe-panel-group-next-link / -previous-link : panel nav (285-286)
    //  - .publication-viewer-next-link / -previous-link : viewer nav (289-290)
    //  - .page-heading-anchor : "Copy link" buttons next to headings (58, 82, ...)
    //  - .navigation-hint : scroll-down arrow on the hero (46)
    //  - .gradient-overlay : decorative empty span in hero hgroup (36)
    WebImporter.DOMUtils.remove(element, [
      '.section.spacer-section',
      '.section.bumper-section',
      '.back-to-top-button',
      '.wp-scrollbar',
      '.wp-swipe-panel-group-next-link',
      '.wp-swipe-panel-group-previous-link',
      '.publication-viewer-next-link',
      '.publication-viewer-previous-link',
      '.page-heading-anchor',
      '.navigation-hint',
      '.gradient-overlay',
    ]);

    // Sections are rendered with a `hidden` state class until scrolled into view
    // (e.g. line 50). It's a viewer animation flag, not content — drop it so nothing
    // downstream treats these sections as invisible.
    element.querySelectorAll('.article > .section.hidden').forEach((section) => {
      section.classList.remove('hidden');
    });

    // Lazy images: promote data-src / data-srcset when src is missing or a placeholder.
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const lazySrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (lazySrc && (!src || src.startsWith('data:') || src === '#')) {
        img.setAttribute('src', lazySrc);
      }
      const lazySrcset = img.getAttribute('data-srcset');
      if (lazySrcset && !img.getAttribute('srcset')) img.setAttribute('srcset', lazySrcset);
    });

    // Section background images: in the live viewer these can be rendered as a
    // background-image on .section-background-image instead of a child <img> (line 30).
    element.querySelectorAll('.section-background-image').forEach((bg) => {
      if (bg.querySelector('img')) return;
      const url = getBackgroundUrl(bg);
      if (url) bg.append(createImg(doc, url));
    });

    // Photo grid tiles: a.photo-image anchors are empty and display the photo via
    // background-image; href points to the size=1024 rendition (lines 224-245).
    // Insert a real <img> so the photo grid (cards-mosaic) parser can extract it.
    element.querySelectorAll('.photo-grid a.photo-image').forEach((a) => {
      if (a.querySelector('img')) return;
      const url = a.getAttribute('href') || getBackgroundUrl(a);
      if (url && url !== '#') a.append(createImg(doc, url));
    });

    // Inline content images (default content): <div class="image"><div class="image-wrapper">
    // <a class="image-viewer-link" href="(same image)"><img></a></div><div class="caption">
    // (lines 196-203). The lightbox link is not authorable — unwrap to the bare <img>,
    // and turn the caption into a paragraph that follows the image.
    element.querySelectorAll('a.image-viewer-link').forEach((a) => {
      const img = a.querySelector('img');
      if (img) a.replaceWith(img);
    });
    element.querySelectorAll('.image > .caption').forEach((caption) => {
      const p = doc.createElement('p');
      const em = doc.createElement('em');
      em.textContent = caption.textContent.trim();
      p.append(em);
      caption.replaceWith(p);
    });

    // Headings wrap their text in a single <span> (e.g. span.auto-size-span, line 39).
    element.querySelectorAll('h1 > span:only-child, h2 > span:only-child, h3 > span:only-child, h4 > span:only-child, p.subtitle > span:only-child').forEach((span) => {
      span.replaceWith(...span.childNodes);
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Any remaining non-authorable elements.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'button',
      'form',
    ]);
  }
}
