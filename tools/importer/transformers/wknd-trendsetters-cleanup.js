/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters.site site-wide cleanup.
 *
 * Removes non-authorable site chrome and decorative artifacts so the import
 * contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html for
 * https://www.wknd-trendsetters.site/faq.
 *
 * Non-authorable content found in the captured FAQ DOM:
 *  - <a href="#main-content" class="skip-link">Skip to main content</a>
 *      (a11y skip link, part of the page shell)            [cleaned.html line 1]
 *  - <div class="navbar"> ... </div>
 *      (global header: logo, mega menu, support dropdown,
 *       subscribe button, mobile toggle)                   [cleaned.html line 1]
 *  - <footer class="footer inverse-footer"> ... </footer>
 *      (global footer: logo, social icons, link columns)   [cleaned.html line 60]
 *  - decorative inline-SVG icons authored as
 *    <img src="data:image/svg+xml;base64,...">
 *      (nav carets, mega-nav item icons, button arrow,
 *       mobile-menu glyph, footer social icons, faq toggle
 *       "+" icons) — presentational glyphs, not authorable
 *       content images. The single real content image uses
 *       ./images/fd5561e18c4c7f1c44f4708f862c23c2.png and is kept.
 *
 * Note: this site's breadcrumbs (.breadcrumbs) only appear on other templates
 * (e.g. the homepage article-teaser section) and are not present on the FAQ
 * page, so no breadcrumb selector is included here. Add one (verified against
 * that template's captured DOM) when augmenting for a template that has it.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome. Selectors verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link', // <a href="#main-content" class="skip-link">  (line 1)
      '.navbar',    // global header / mega menu / mobile toggle    (line 1)
      'footer',     // <footer class="footer inverse-footer">       (line 60)
    ]);

    // Remove decorative inline-SVG data-URI icons. These are presentational
    // glyphs (carets, arrows, social/faq toggle icons) authored as data-URI
    // <img>; an author would never upload them as content. The real content
    // image uses ./images/*.png and is left untouched.
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
      img.remove();
    });
  }
}
