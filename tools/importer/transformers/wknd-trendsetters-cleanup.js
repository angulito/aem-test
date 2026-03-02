/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Tested: / (homepage)
 * Generated: 2026-02-24
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Site built with Astro framework (data-astro-cid-* attributes)
 * - Elements: .navbar, footer.footer, .skip-link, .nav-mobile-menu-button
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation elements
    // EXTRACTED: Found <div class="navbar"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.navbar'
    ]);

    // Remove footer elements
    // EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer'
    ]);

    // Remove skip link
    // EXTRACTED: Found <a href="#main-content" class="skip-link"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.skip-link'
    ]);

    // Remove mobile menu button
    // EXTRACTED: Found <button class="nav-mobile-menu-button"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav-mobile-menu-button'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up Astro-specific attributes
    // EXTRACTED: Found data-astro-cid-* attributes on body and elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove remaining unwanted elements
    // Standard HTML elements - safe to use
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);
  }
}
