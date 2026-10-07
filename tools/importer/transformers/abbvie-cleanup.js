/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie banner, tracking pixels).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (OneTrust) - found at line 5288: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Remove "warn on departure" / leaving-site modal popups (chrome, not body content)
    WebImporter.DOMUtils.remove(element, ['#abbvie-warn-on-departure-popup', '.modal-popup', '.popup-departure']);

    // Remove the Bowen Craggs site survey popup (loads intermittently, chrome not content).
    // Target by the widget image source and by the survey link host, then climb to the
    // smallest wrapper that holds the whole popup.
    const surveyAnchors = element.querySelectorAll(
      'img[src*="bowencraggs.com"], a[href*="research.net/r/"], a[href*="SurveyType=PopUp"]',
    );
    const surveyWrappers = new Set();
    surveyAnchors.forEach((node) => {
      // Climb up to a reasonable popup container (max 6 levels) and remove it.
      let el = node;
      for (let i = 0; i < 6 && el && el.parentElement && el.parentElement !== element; i += 1) {
        el = el.parentElement;
      }
      surveyWrappers.add(el);
    });
    surveyWrappers.forEach((el) => { if (el && el.remove) el.remove(); });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header experience fragment - found at line 9: <div class="cmp-experiencefragment cmp-experiencefragment--header">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--header']);

    // Remove footer experience fragment - found at line 4792: <div class="cmp-experiencefragment cmp-experiencefragment--footer">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--footer']);

    // Remove back-to-top button - found at line 4799: <div class="button back-to-top">
    WebImporter.DOMUtils.remove(element, ['.back-to-top']);

    // Remove CSS link elements - found at lines 10-11: <link href="/etc.clientlibs/...">
    WebImporter.DOMUtils.remove(element, ['link']);

    // Remove tracking iframes (doubleclick, TTD pixel, etc.) - found at lines 5543-5560
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove <noscript> blocks (tracking pixels like facebook.com/tr live here;
    // browsers keep their content as raw text, which the markdown converter would
    // otherwise flatten into stray images). Never authorable content.
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // Remove tracking pixel images (Twitter/X, analytics) - found at lines 5549-5562
    const trackingImgs = element.querySelectorAll('img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"], img[src*="doubleclick.net"], img[src*="facebook.com/tr"]');
    trackingImgs.forEach((img) => img.remove());

    // Remove data-cmp-data-layer-enabled attribute from body - found at line 1
    element.removeAttribute('data-cmp-data-layer-enabled');
  }
}
