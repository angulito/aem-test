/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: realmadrid.com site-wide cleanup.
 *
 * Real Madrid is a heavily client-side-rendered Angular SPA (Spanish locale
 * /es-ES). This transformer strips the non-authorable app shell, advertising,
 * cookie-consent SDK, and the boilerplate sponsor-logo strip so the import
 * contains only the authorable content modules. All selectors below were
 * verified against migration-work/cleaned.html for
 * https://www.realmadrid.com/es-ES.
 *
 * REMOVED (non-authorable):
 *  - #onetrust-consent-sdk + .onetrust-pc-dark-filter
 *      OneTrust cookie-consent SDK container and its dark-filter overlay.
 *      (cleaned.html: id="onetrust-consent-sdk", class="onetrust-pc-dark-filter")
 *  - app-ads
 *      Google ad / "Contenido patrocinado" sponsored-content containers
 *      interspersed between modules. 4 instances in the captured DOM, each
 *      <app-ads class="ng-star-inserted">.
 *  - app-header
 *      Auto-populated global navigation chrome.        (cleaned.html line 17)
 *  - app-footer-social
 *      Auto-populated footer social / legal links.     (cleaned.html line 2581)
 *  - app-footer-banners
 *      Empty / zero-content footer banner container.   (cleaned.html line 2254)
 *  - section.rm-sponsors
 *      The sponsor/partner logo strip (Emirates, adidas, BMW, Louis Vuitton,
 *      etc.) rendered inside app-footer-sponsors. 36 rm-sponsors__item logos —
 *      boilerplate noise.                              (cleaned.html line 2382)
 *
 * PRESERVED (authorable) — explicitly NOT removed:
 *  - .rm-stores ("Real Madrid App" promo with App Store / Google Play / Huawei
 *    store badges) inside app-footer-sponsors. It is a sibling subtree of
 *    .rm-sponsors (cleaned.html line 2358, separate from the logo strip at
 *    line 2382), so removing .rm-sponsors leaves the app promo intact. This is
 *    the columns-app block (template section-12).
 *  - app-news-herobanner, app-merchandising, app-palmares, app-stadium-camera
 *    — the authorable content modules.
 *
 * Run in afterTransform: none of these removals affect block-parser matching
 * (the ad/cookie/footer chrome is not inside the authorable module elements
 * the parsers target), so they belong in the final-cleanup hook.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable chrome, advertising, cookie SDK, and the sponsor
    // logo strip. Every selector verified in migration-work/cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',       // OneTrust cookie-consent SDK container
      '.onetrust-pc-dark-filter',    // OneTrust modal dark-filter overlay
      'app-ads',                     // Google ad / sponsored-content containers (x4)
      'app-header',                  // global navigation chrome            (line 17)
      'app-footer-social',           // footer social / legal links         (line 2581)
      'app-footer-banners',          // empty footer banner container       (line 2254)
      'section.rm-sponsors',         // sponsor/partner logo strip          (line 2382)
    ]);

    // Content override: rewrite the "Comunidad Madridista" hero heading.
    element.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      if (h.textContent.trim() === 'Comunidad Madridista') {
        h.textContent = 'Comunidad Madridista test2';
      }
    });
  }
}
