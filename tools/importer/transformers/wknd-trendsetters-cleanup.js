/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters.site site-wide cleanup.
 *
 * Removes non-authorable site chrome and decorative artifacts so the import
 * contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html for https://www.wknd-trendsetters.site/.
 *
 * Non-authorable content found in captured DOM:
 *  - <a class="skip-link">Skip to main content</a>  (a11y skip link, page shell)
 *  - <div class="navbar"> ... </div>  (global header: logo, mega menu, mobile toggle)
 *  - <footer class="footer inverse-footer"> ... </footer>  (global footer)
 *  - <div class="breadcrumbs"> ... </div>  (breadcrumb trail inside the article teaser section)
 *  - decorative inline SVG icons authored as <img src="data:image/svg+xml;base64,...">
 *    (nav carets, mega-nav item icons, button arrow icons, footer social icons,
 *     faq toggle icons, breadcrumb chevron) — these are presentational glyphs,
 *     not authorable content images. The real content images use ./images/*.png
 *     or https://www.wknd-trendsetters.site/images/*.avif src values and are kept.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome. Selectors from captured DOM.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',       // <a href="#main-content" class="skip-link">
      '.navbar',          // global header / mega menu / mobile toggle
      'footer',           // <footer class="footer inverse-footer">
      '.breadcrumbs',     // breadcrumb trail (Home > Case studies)
    ]);

    // Remove decorative inline-SVG data-URI icons. These are presentational
    // glyphs (carets, arrows, social/faq icons) authored as data-URI <img>;
    // an author would never upload them as content. Content images use
    // ./images/*.png or .../images/*.avif and are left untouched.
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
      img.remove();
    });
  }
}
