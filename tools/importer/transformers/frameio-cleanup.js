/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Frame.io website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: frame.io (all pages)
 * Generated: 2026-02-06
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Elements identified: nav, footer, cookie banners, overlays
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation elements
    WebImporter.DOMUtils.remove(element, [
      'nav',
      '[class*="Navigation_"]',
      '[class*="NavBar_"]',
      '[class*="MobileMenu_"]',
      '[class*="nav_"]',
    ]);

    // Remove footer elements
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '[class*="Footer_"]',
      '[class*="footer_"]',
    ]);

    // Remove cookie banners and overlays
    WebImporter.DOMUtils.remove(element, [
      '[class*="CookieBanner_"]',
      '[class*="cookie"]',
      '[class*="Modal_"]',
      '[class*="overlay_"]',
    ]);

    // Remove logo wall (decorative, hard to import)
    WebImporter.DOMUtils.remove(element, [
      '[class*="LogoWall_"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up React-specific attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      const attrs = Array.from(el.attributes);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-') && attr.name !== 'data-src') {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove script/style leftovers
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'style',
    ]);
  }
}
