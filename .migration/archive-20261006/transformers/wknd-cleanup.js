/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banner / modal / overlay present in captured DOM.
    // Stray empty <meta> tags appear inside teaser images (e.g. cleaned.html
    // line 183) and are not authorable content — remove before parsing so they
    // don't get pulled into block cells.
    WebImporter.DOMUtils.remove(element, ['meta']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (verified in cleaned.html):
    //  - header.cmp-experiencefragment--header : global header XF (logo, nav,
    //    search, sign-in buttons, language navigation) — cleaned.html line 5
    //  - footer.cmp-experiencefragment--footer : global footer XF (logo, nav,
    //    social buttons, copyright) — cleaned.html line 471
    //  - #toggleNav : mobile nav hamburger toggle — cleaned.html line 568
    //  - #mobileNav : mobile navigation drawer — cleaned.html line 574
    //  - iframe#destination_publishing_iframe... : Adobe ID syncing iframe — line 566
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      '#toggleNav',
      '#mobileNav',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
