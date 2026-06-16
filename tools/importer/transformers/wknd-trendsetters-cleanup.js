/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * Removes non-authorable global chrome so the import contains only
 * page-level authorable content.
 *
 * Selectors verified against migration-work/cleaned.html:
 *   - <a class="skip-link" href="#main-content">  (accessibility skip link, non-authorable)
 *   - <div class="navbar"> ... </div>             (global header/nav, auto-populated)
 *   - <footer class="footer inverse-footer"> ... </footer> (global footer, auto-populated)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (verified in cleaned.html)
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'header.navbar',
      'nav#nav-menu',
      'footer.footer',
      'footer',
    ]);
  }
}
