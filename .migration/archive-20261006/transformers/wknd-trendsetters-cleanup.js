/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters cleanup.
 * Removes non-authorable site chrome elements.
 * Selectors validated against captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banners or modals detected in captured DOM
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome:
    // .navbar - site navigation header (div.navbar containing logo, nav-menu, subscribe button)
    // footer.footer - site footer with social links and nav columns
    // a.skip-link - "Skip to main content" accessibility link
    // .breadcrumbs - breadcrumb navigation within article section
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'a.skip-link',
      '.breadcrumbs',
    ]);
  }
}
