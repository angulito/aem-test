/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters (v15) site-wide cleanup.
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified by reading
 * migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banner, modal, or overlay present in captured DOM — nothing to
    // remove before block parsing.
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (verified in cleaned.html):
    //  - a.skip-link        : "Skip to main content" accessibility link (line 1)
    //  - div.navbar         : global site header — logo, mega-menu nav, dropdowns,
    //                         Subscribe button, mobile menu toggle (line 1)
    //  - footer.footer      : global site footer — logo, social icons, nav columns (line 98)
    //  - .breadcrumbs       : breadcrumb nav inside the featured-article section
    //                         (line 48); not part of that section's authorable content
    //  - iframe/link/noscript: safe non-authorable leftovers if present
    // NOTE: main > header.secondary-section is the Hero SECTION (authorable),
    // NOT site chrome — it is intentionally NOT removed.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
      '.breadcrumbs',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
