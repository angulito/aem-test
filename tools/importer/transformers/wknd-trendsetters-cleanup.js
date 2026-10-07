/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html:
 *   <a href="#main-content" class="skip-link">           (skip link, before navbar)
 *   <div class="navbar"> ... <nav class="nav-menu" id="nav-menu"> (site header / mega menu)
 *   <div class="breadcrumbs"> inside main > section:nth-of-type(1) (breadcrumb trail)
 *   <footer class="footer inverse-footer">               (site footer)
 *   data-astro-cid-* attributes (e.g. <body data-astro-cid-37fxchfa="">)
 *
 * NOTE: Do NOT remove bare `header` - the hero section is <header class="section secondary-section">
 * inside <main> and is authorable content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs sit inside the columns-meta block area; remove before parsing so
    // the parser does not capture them as authorable content.
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (header nav, skip link, footer)
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      '#nav-menu',
      'footer.footer',
      'link',
      'noscript',
    ]);

    // Strip Astro scoping attributes
    element.querySelectorAll('*').forEach((el) => {
      Array.from(el.attributes)
        .filter((attr) => attr.name.startsWith('data-astro-cid'))
        .forEach((attr) => el.removeAttribute(attr.name));
    });
  }
}
